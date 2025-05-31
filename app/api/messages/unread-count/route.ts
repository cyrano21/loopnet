import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import connectDB from "@/lib/mongodb"
import Conversation from "@/models/Conversation"
import Message from "@/models/Message"
import mongoose from "mongoose"

// GET /api/messages/unread-count - Récupérer le nombre total de messages non lus
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    await connectDB()

    const userId = new mongoose.Types.ObjectId(session.user.id)

    // Récupérer toutes les conversations de l'utilisateur
    const conversations = await Conversation.find({
      participants: userId,
    })

    // Calculer le nombre total de messages non lus
    let totalUnreadCount = 0

    // Si nous avons des conversations avec un compteur de messages non lus
    if (conversations.length > 0) {
      for (const conversation of conversations) {
        if (conversation.unreadCount && conversation.unreadCount.get(session.user.id)) {
          totalUnreadCount += conversation.unreadCount.get(session.user.id)
        }
      }
    } else {
      // Méthode alternative: compter directement les messages non lus
      totalUnreadCount = await Message.countDocuments({
        recipient: userId,
        isRead: false,
      })
    }

    return NextResponse.json({
      count: totalUnreadCount,
    })
  } catch (error) {
    console.error("[UNREAD_COUNT_ERROR]", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération du nombre de messages non lus" },
      { status: 500 }
    )
  }
}