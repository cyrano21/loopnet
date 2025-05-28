import { type NextRequest, NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getAuthSession()
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Utiliser uniquement la clé publique VAPID côté serveur
    const vapidKey = process.env.VAPID_PUBLIC_KEY

    if (!vapidKey) {
      return NextResponse.json({ error: "Clé VAPID non configurée" }, { status: 500 })
    }

    return NextResponse.json({ vapidKey })
  } catch (error) {
    console.error("Erreur récupération clé VAPID:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
