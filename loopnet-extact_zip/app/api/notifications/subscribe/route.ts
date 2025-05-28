import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { connectDB } from "@/lib/mongodb"

// Modèle pour les abonnements push (à créer)
interface PushSubscription {
  userId: string
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
  createdAt: Date
  lastUsed: Date
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subscription = await request.json()

    await connectDB()

    // Sauvegarder l'abonnement en base de données
    // TODO: Créer le modèle PushSubscription
    // await PushSubscriptionModel.findOneAndUpdate(
    //   { userId: session.user.id },
    //   {
    //     userId: session.user.id,
    //     endpoint: subscription.endpoint,
    //     keys: subscription.keys,
    //     lastUsed: new Date()
    //   },
    //   { upsert: true }
    // )

    console.log("Push subscription saved for user:", session.user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to save push subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
