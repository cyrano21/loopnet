import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import connectDB from "@/lib/mongodb"
import Conversation from "@/models/Conversation"
import mongoose from "mongoose"

// PUT /api/messages/conversations/[id]/archive - Archiver une conversation
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    await connectDB()

    const { id: conversationId } = await params
    const userId = session.user.id

    // Vérifier si l'utilisateur est participant à la conversation
    const conversation = await Conversation.findOne({
      _id: new mongoose.Types.ObjectId(conversationId),
      participants: new mongoose.Types.ObjectId(userId),
    })

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation non trouvée ou accès non autorisé" },
        { status: 404 }
      )
    }

    // Marquer la conversation comme archivée pour cet utilisateur
    if (!conversation.isArchived) {
      conversation.isArchived = {}
    }
    
    conversation.isArchived.set(userId, true)
    await conversation.save()

    return NextResponse.json({
      success: true,
      message: "Conversation archivée avec succès",
    })
  } catch (error) {
    console.error("[CONVERSATION_ARCHIVE_ERROR]", error)
    return NextResponse.json(
      { error: "Erreur lors de l'archivage de la conversation" },
      { status: 500 }
    )
  }
}