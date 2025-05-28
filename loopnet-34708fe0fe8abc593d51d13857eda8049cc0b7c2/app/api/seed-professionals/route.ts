import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Professional from "@/models/Professional"

export async function POST() {
  try {
    await connectToDatabase()

    console.log("👔 Vérification et création des professionnels...")

    const professionals = [
      {
        name: "Pierre Dubois",
        email: "pierre.dubois@commercial-expert.fr",
        phone: "+33 1 42 56 78 90",
        company: "Commercial Expert",
        title: "Directeur Commercial",
        bio: "Expert en immobilier commercial avec plus de 20 ans d'expérience dans la région parisienne.",
        specialties: ["Bureaux", "Commerces", "Investissement"],
        location: {
          address: "15 Avenue des Champs-Élysées",
          city: "Paris",
          postalCode: "75008",
          country: "France",
        },
        rating: 4.8,
        reviews: 156,
        yearsExperience: 20,
        totalTransactions: 89,
        totalVolume: 45000000,
        languages: ["Français", "Anglais"],
        certifications: ["FNAIM", "UNIS"],
        avatar: "/placeholder.svg?height=150&width=150&query=professional+man",
        isActive: true,
        isVerified: true,
      },
      {
        name: "Sophie Martin",
        email: "sophie.martin@lyon-immobilier.fr",
        phone: "+33 4 78 90 12 34",
        company: "Lyon Immobilier",
        title: "Responsable Investissement",
        bio: "Spécialiste de l'investissement immobilier commercial dans la région Rhône-Alpes.",
        specialties: ["Investissement", "Entrepôts", "Bureaux"],
        location: {
          address: "25 Rue de la République",
          city: "Lyon",
          postalCode: "69002",
          country: "France",
        },
        rating: 4.6,
        reviews: 98,
        yearsExperience: 12,
        totalTransactions: 67,
        totalVolume: 32000000,
        languages: ["Français", "Anglais", "Italien"],
        certifications: ["FNAIM"],
        avatar: "/placeholder.svg?height=150&width=150&query=professional+woman",
        isActive: true,
        isVerified: true,
      },
    ]

    const results = {
      created: [],
      skipped: [],
      errors: [],
    }

    for (const profData of professionals) {
      try {
        console.log(`🔍 Vérification professionnel: ${profData.email}`)

        // Vérifier si le professionnel existe déjà
        const existingProf = await Professional.findOne({ email: profData.email })

        if (existingProf) {
          console.log(`⚠️ Professionnel déjà existant: ${profData.email}`)
          results.skipped.push({
            email: profData.email,
            name: profData.name,
            reason: "Email déjà utilisé",
            existingId: existingProf._id,
          })
          continue
        }

        // Créer le nouveau professionnel
        console.log(`➕ Création professionnel: ${profData.email}`)
        const newProf = await Professional.create(profData)

        console.log(`✅ Professionnel créé: ${newProf.email} (${newProf.company})`)
        results.created.push({
          id: newProf._id,
          name: newProf.name,
          email: newProf.email,
          company: newProf.company,
          city: newProf.location.city,
        })
      } catch (error) {
        console.error(`❌ Erreur création professionnel ${profData.email}:`, error)
        results.errors.push({
          email: profData.email,
          name: profData.name,
          error: error instanceof Error ? error.message : "Erreur inconnue",
        })
      }
    }

    const message = `Professionnels: ${results.created.length} créés, ${results.skipped.length} ignorés, ${results.errors.length} erreurs`
    console.log(`📊 ${message}`)

    return NextResponse.json({
      success: true,
      message,
      results,
      summary: {
        total: professionals.length,
        created: results.created.length,
        skipped: results.skipped.length,
        errors: results.errors.length,
      },
    })
  } catch (error) {
    console.error("Erreur globale lors de la création des professionnels:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la création des professionnels",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    )
  }
}
