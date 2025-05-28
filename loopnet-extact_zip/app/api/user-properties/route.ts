import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const propertyData = await request.json()

  try {
    // Ici vous intégreriez avec votre base de données
    // Pour la démo, on simule la création

    const newProperty = {
      id: Date.now(),
      ...propertyData,
      status: "pending", // En attente de validation
      publishedDate: new Date().toISOString(),
      views: 0,
      favorites: 0,
      inquiries: 0,
      userId: "user-123", // À récupérer depuis l'authentification
    }

    // Simulation d'envoi d'email de confirmation
    console.log("Nouvelle propriété créée:", newProperty)

    return NextResponse.json({
      success: true,
      message: "Votre annonce a été soumise avec succès !",
      property: newProperty,
      estimatedValidationTime: "24 heures",
    })
  } catch (error) {
    console.error("Erreur création propriété:", error)
    return NextResponse.json({ error: "Erreur lors de la création de l'annonce" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId") || "user-123"

  // Simulation de récupération des propriétés de l'utilisateur
  const userProperties = [
    {
      id: 1,
      title: "Appartement 3 pièces avec balcon",
      address: "15 Rue de la Paix, Paris 75001",
      price: 450000,
      priceType: "sale",
      type: "Appartement",
      status: "active",
      views: 247,
      favorites: 12,
      inquiries: 8,
      publishedDate: "2024-01-15",
      userId: userId,
    },
    // ... autres propriétés
  ]

  return NextResponse.json({
    properties: userProperties,
    total: userProperties.length,
  })
}
