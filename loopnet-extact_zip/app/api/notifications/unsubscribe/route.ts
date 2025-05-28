import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { connectDB } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subscription = await request.json()

    await connectDB()

    // Supprimer l'abonnement de la base de données
    // TODO: Créer le modèle PushSubscription
    // await PushSubscriptionModel.deleteOne({
    //   userId: session.user.id,
    //   endpoint: subscription.endpoint
    // })

    console.log("Push subscription removed for user:", session.user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to remove push subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
