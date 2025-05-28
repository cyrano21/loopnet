import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Inquiry from "@/models/Inquiry"
import User from "@/models/User"
import Property from "@/models/Property"

export async function POST() {
  try {
    await connectToDatabase()

    console.log("📧 Création des demandes de renseignements...")

    // Récupérer des utilisateurs et propriétés existants
    const users = await User.find().limit(3)
    const properties = await Property.find().limit(2)

    if (users.length === 0 || properties.length === 0) {
      return NextResponse.json(
        {
          error: "Veuillez d'abord créer des utilisateurs et des propriétés",
        },
        { status: 400 },
      )
    }

    const inquiries = [
      {
        property: properties[0]._id,
        owner: users[1]._id, // Marie Martin (agent)
        inquirer: users[0]._id, // Jean Dupont
        message:
          "Bonjour, je suis intéressé par ce bureau pour mon entreprise. Pourriez-vous organiser une visite cette semaine ?",
        contactMethod: "email",
        inquirerInfo: {
          name: "Jean Dupont",
          email: "jean.dupont@example.com",
          phone: "+33 1 23 45 67 89",
        },
        status: "new", // Valeur enum valide
        visitRequested: true,
        preferredVisitDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        property: properties[1]._id,
        owner: users[2]._id, // Admin
        inquirer: users[0]._id, // Jean Dupont
        message:
          "Je représente un client investisseur. Pouvez-vous me fournir plus d'informations sur la rentabilité de ce local ?",
        contactMethod: "phone",
        inquirerInfo: {
          name: "Jean Dupont",
          email: "jean.dupont@example.com",
          phone: "+33 1 23 45 67 89",
        },
        status: "read", // Valeur enum valide
        visitRequested: false,
        ownerResponse: "Merci pour votre intérêt. Je vous envoie les documents par email.",
        respondedAt: new Date(),
      },
    ]

    console.log("📝 Données demandes à insérer:", JSON.stringify(inquiries, null, 2))

    const createdInquiries = await Inquiry.insertMany(inquiries)

    console.log(
      "✅ Demandes créées:",
      createdInquiries.map((i) => ({
        id: i._id,
        property: i.property,
        inquirer: i.inquirerInfo.name,
        status: i.status,
      })),
    )

    return NextResponse.json({
      message: "Demandes créées avec succès",
      count: createdInquiries.length,
      inquiries: createdInquiries,
    })
  } catch (error) {
    console.error("Erreur lors de la création des demandes:", error)
    return NextResponse.json({ error: "Erreur lors de la création des demandes" }, { status: 500 })
  }
}
