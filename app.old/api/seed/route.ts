import { NextResponse } from "next/server"
import { seedDatabase } from "../../../scripts/seed-database"

export async function POST() {
  try {
    // Vérifier l'environnement (seulement en dev)
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Seed non autorisé en production" }, { status: 403 })
    }

    console.log("🌱 Démarrage du seed via API...")
    const result = await seedDatabase()

    return NextResponse.json({
      success: true,
      message: "Base de données peuplée avec succès !",
      data: {
        usersCount: result.users.length,
        propertiesCount: result.properties.length,
        inquiriesCount: result.inquiries.length,
      },
    })
  } catch (error) {
    console.error("Erreur seed API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors du peuplement de la base de données",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    )
  }
}
