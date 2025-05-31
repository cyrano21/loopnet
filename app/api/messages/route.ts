import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import connectDB from "@/lib/mongodb"
import Message from "@/models/Message"
import Conversation from "@/models/Conversation"
import mongoose from "mongoose"

// POST /api/messages - Envoyer un nouveau message
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    await connectDB()

    const formData = await request.formData()
    const content = formData.get("content") as string
    const conversationId = formData.get("conversationId") as string
    const attachments = formData.getAll("attachments") as File[]

    if (!content || !conversationId) {
      return NextResponse.json(
        { error: "Contenu et ID de conversation requis" },
        { status: 400 }
      )
    }

    const userId = new mongoose.Types.ObjectId(session.user.id)
    const conversationObjectId = new mongoose.Types.ObjectId(conversationId)

    // Vérifier si l'utilisateur est participant à la conversation
    const conversation = await Conversation.findOne({
      _id: conversationObjectId,
      participants: userId,
    })

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation non trouvée ou accès non autorisé" },
        { status: 404 }
      )
    }

    // Trouver le destinataire (l'autre participant)
    const recipientId = conversation.participants.find(
      (participantId: mongoose.Types.ObjectId) => !participantId.equals(userId)
    )

    if (!recipientId) {
      return NextResponse.json(
        { error: "Destinataire non trouvé" },
        { status: 400 }
      )
    }

    // Traiter les pièces jointes si présentes
    let processedAttachments: Array<{
      url: string
      type: string
      name: string
      size?: number
    }> = []

    if (attachments && attachments.length > 0) {
      // TODO: Implémenter l'upload des fichiers vers un service de stockage
      // Pour l'instant, on simule avec des URLs temporaires
      processedAttachments = attachments.map((file) => ({
        url: `/uploads/temp/${file.name}`, // URL temporaire
        type: file.type,
        name: file.name,
        size: file.size,
      }))
    }

    // Créer le nouveau message
    const newMessage = await Message.create({
      conversation: conversationObjectId,
      sender: userId,
      recipient: recipientId,
      content,
      attachments: processedAttachments,
      isRead: false,
    })

    // Mettre à jour la conversation avec le dernier message
    conversation.lastMessage = newMessage._id
    conversation.updatedAt = new Date()
    
    // Incrémenter le compteur de messages non lus pour le destinataire
    if (!conversation.unreadCount) {
      conversation.unreadCount = {}
    }
    
    const currentUnreadCount = conversation.unreadCount.get(recipientId.toString()) || 0
    conversation.unreadCount.set(recipientId.toString(), currentUnreadCount + 1)
    
    await conversation.save()

    // Récupérer le message avec les détails des utilisateurs
    const populatedMessage = await Message.findById(newMessage._id)
      .populate({
        path: "sender",
        select: "name avatar",
      })
      .populate({
        path: "recipient",
        select: "name avatar",
      })
      .lean()

    return NextResponse.json({
      message: populatedMessage,
    }, { status: 201 })
  } catch (error) {
    console.error("[MESSAGE_SEND_ERROR]", error)
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    )
  }
}