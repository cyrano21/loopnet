import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import connectDB from "@/lib/mongodb"
import Conversation from "@/models/Conversation"
import User from "@/models/User"
import Message from "@/models/Message"
import mongoose from "mongoose"

// GET /api/messages/conversations - Récupérer toutes les conversations de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    await connectDB()

    const userId = new mongoose.Types.ObjectId(session.user.id)

    // Récupérer les conversations où l'utilisateur est participant
    const conversations = await Conversation.find({
      participants: userId,
      "isArchived.userId": { $ne: true } // Ne pas inclure les conversations archivées
    })
      .populate({
        path: "participants",
        select: "name avatar",
      })
      .populate({
        path: "property",
        select: "title images",
      })
      .populate({
        path: "lastMessage",
        select: "content createdAt sender",
      })
      .sort({ updatedAt: -1 })
      .lean()

    // Transformer les données pour le client
    const formattedConversations = conversations.map((conv: any) => {
      // Calculer le nombre de messages non lus
      const unreadCount = conv.unreadCount?.[session.user.id] || 0

      return {
        _id: conv._id,
        participants: conv.participants,
        property: conv.property,
        lastMessage: conv.lastMessage,
        unreadCount,
        updatedAt: conv.updatedAt,
      }
    })

    return NextResponse.json({
      conversations: formattedConversations,
    })
  } catch (error) {
    console.error("[CONVERSATIONS_GET_ERROR]", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des conversations" },
      { status: 500 }
    )
  }
}

// POST /api/messages/conversations - Créer une nouvelle conversation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const { recipientId, propertyId } = body

    if (!recipientId) {
      return NextResponse.json(
        { error: "ID du destinataire requis" },
        { status: 400 }
      )
    }

    const userId = new mongoose.Types.ObjectId(session.user.id)
    const recipientObjectId = new mongoose.Types.ObjectId(recipientId)

    // Vérifier si le destinataire existe
    const recipient = await User.findById(recipientObjectId)
    if (!recipient) {
      return NextResponse.json(
        { error: "Destinataire non trouvé" },
        { status: 404 }
      )
    }

    // Vérifier si une conversation existe déjà entre ces utilisateurs
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, recipientObjectId] },
      property: propertyId ? new mongoose.Types.ObjectId(propertyId) : { $exists: false },
    })

    // Si la conversation existe mais est archivée, la désarchiver
    if (conversation && conversation.isArchived?.[session.user.id]) {
      conversation.isArchived.set(session.user.id, false)
      await conversation.save()
    }

    // Si aucune conversation n'existe, en créer une nouvelle
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, recipientObjectId],
        property: propertyId ? new mongoose.Types.ObjectId(propertyId) : undefined,
        unreadCount: { [recipientId]: 0 },
        isArchived: {},
      })
    }

    // Récupérer les détails complets de la conversation
    const populatedConversation = await Conversation.findById(conversation._id)
      .populate({
        path: "participants",
        select: "name avatar",
      })
      .populate({
        path: "property",
        select: "title images",
      })
      .lean()

    return NextResponse.json({
      conversation: {
        ...populatedConversation,
        unreadCount: populatedConversation.unreadCount?.[session.user.id] || 0,
      },
    }, { status: 201 })
  } catch (error) {
    console.error("[CONVERSATION_CREATE_ERROR]", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de la conversation" },
      { status: 500 }
    )
  }
}