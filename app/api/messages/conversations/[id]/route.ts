import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import connectDB from "@/lib/mongodb"
import Conversation from "@/models/Conversation"
import Message from "@/models/Message"
import mongoose from "mongoose"

// GET /api/messages/conversations/[id] - Récupérer les messages d'une conversation
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    await connectDB()

    const { id: conversationId } = await params
    const userId = new mongoose.Types.ObjectId(session.user.id)

    // Vérifier si l'utilisateur est participant à la conversation
    const conversation = await Conversation.findOne({
      _id: new mongoose.Types.ObjectId(conversationId),
      participants: userId,
    })

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation non trouvée ou accès non autorisé" },
        { status: 404 }
      )
    }

    // Récupérer les messages de la conversation
    const messages = await Message.find({
      conversation: new mongoose.Types.ObjectId(conversationId),
    })
      .populate({
        path: "sender",
        select: "name avatar",
      })
      .populate({
        path: "recipient",
        select: "name avatar",
      })
      .sort({ createdAt: 1 })
      .lean()

    // Marquer les messages non lus comme lus
    await Message.updateMany(
      {
        conversation: new mongoose.Types.ObjectId(conversationId),
        recipient: userId,
        isRead: false,
      },
      {
        $set: { isRead: true, readAt: new Date() },
      }
    )

    // Réinitialiser le compteur de messages non lus pour cet utilisateur
    if (conversation.unreadCount && conversation.unreadCount.get(session.user.id)) {
      conversation.unreadCount.set(session.user.id, 0)
      await conversation.save()
    }

    return NextResponse.json({
      messages,
    })
  } catch (error) {
    console.error("[CONVERSATION_MESSAGES_GET_ERROR]", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des messages" },
      { status: 500 }
    )
  }
}