import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { seedDatabase } from "../../../scripts/seed-database"

export async function POST() {
  try {
    console.log("🌱 Démarrage du seed via API...")
    console.log("📡 Variables d'environnement:")
    console.log("- NODE_ENV:", process.env.NODE_ENV)
    console.log("- MONGODB_URI:", process.env.MONGODB_URI ? "✅ Définie" : "❌ Manquante")

    // En production, vérifier que l'utilisateur est admin
    if (process.env.NODE_ENV === "production") {
      const session = await getServerSession(authOptions)

      if (!session?.user) {
        console.log("🚫 Tentative de seed en production sans authentification")
        return NextResponse.json({ error: "Authentification requise pour le seed en production" }, { status: 401 })
      }

      const userRole = (session.user as any)?.role || "user"
      if (userRole !== "admin") {
        console.log(`🚫 Tentative de seed en production par ${session.user.email} (rôle: ${userRole})`)
        return NextResponse.json(
          { error: "Seuls les administrateurs peuvent peupler la base en production" },
          { status: 403 },
        )
      }

      console.log(`✅ Seed autorisé en production pour l'admin ${session.user.email}`)
    }

    const result = await seedDatabase()

    console.log("🎉 Seed API terminé avec succès")

    // Préparer le message de notification
    const summary = result.summary
    const notifications = []

    if (summary.users.skipped > 0) {
      notifications.push(`${summary.users.skipped} utilisateur(s) déjà existant(s) ignoré(s)`)
    }
    if (summary.properties.skipped > 0) {
      notifications.push(`${summary.properties.skipped} propriété(s) déjà existante(s) ignorée(s)`)
    }
    if (summary.inquiries.skipped > 0) {
      notifications.push(`${summary.inquiries.skipped} demande(s) déjà existante(s) ignorée(s)`)
    }

    const message =
      notifications.length > 0
        ? `Base de données peuplée avec succès ! ${notifications.join(", ")}`
        : "Base de données peuplée avec succès ! Toutes les données ont été créées."

    return NextResponse.json({
      success: true,
      message,
      data: {
        usersCreated: summary.users.created,
        usersSkipped: summary.users.skipped,
        propertiesCreated: summary.properties.created,
        propertiesSkipped: summary.properties.skipped,
        inquiriesCreated: summary.inquiries.created,
        inquiriesSkipped: summary.inquiries.skipped,
      },
      notifications: {
        existingUsers: summary.users.existing,
        existingProperties: summary.properties.existing,
        existingInquiries: summary.inquiries.existing,
      },
    })
  } catch (error) {
    console.error("❌ Erreur seed API:", error)
    console.error("📋 Stack trace:", error instanceof Error ? error.stack : "Pas de stack trace")

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors du peuplement de la base de données",
        details: error instanceof Error ? error.message : "Erreur inconnue",
        stack: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.stack : undefined) : undefined,
      },
      { status: 500 },
    )
  }
}
