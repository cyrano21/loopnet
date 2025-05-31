import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import connectDB from "@/lib/mongodb"
import Message from "@/models/Message"
import Conversation from "@/models/Conversation"
import mongoose from "mongoose"

// PUT /api/messages/[id]/read - Marquer un message comme lu
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    await connectDB()

    const messageId = params.id
    const userId = new mongoose.Types.ObjectId(session.user.id)

    // Vérifier si le message existe et si l'utilisateur est le destinataire
    const message = await Message.findOne({
      _id: new mongoose.Types.ObjectId(messageId),
      recipient: userId,
      isRead: false,
    })

    if (!message) {
      return NextResponse.json(
        { error: "Message non trouvé ou déjà lu" },
        { status: 404 }
      )
    }

    // Marquer le message comme lu
    message.isRead = true
    message.readAt = new Date()
    await message.save()

    // Mettre à jour le compteur de messages non lus dans la conversation
    const conversation = await Conversation.findById(message.conversation)
    if (conversation && conversation.unreadCount) {
      const currentUnreadCount = conversation.unreadCount.get(session.user.id) || 0
      if (currentUnreadCount > 0) {
        conversation.unreadCount.set(session.user.id, currentUnreadCount - 1)
        await conversation.save()
      }
    }

    return NextResponse.json({
      success: true,
      message: "Message marqué comme lu",
    })
  } catch (error) {
    console.error("[MESSAGE_READ_ERROR]", error)
    return NextResponse.json(
      { error: "Erreur lors du marquage du message comme lu" },
      { status: 500 }
    )
  }
}