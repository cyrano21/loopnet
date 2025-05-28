import { connectToDatabase } from "../lib/mongodb"
import Professional from "../models/Professional"

const professionals = [
  {
    name: "John Smith",
    title: "Senior Commercial Broker",
    company: "Premier Commercial Realty",
    email: "john.smith@premier.com",
    phone: "+33 1 23 45 67 89",
    location: {
      city: "Paris",
      state: "Île-de-France",
      address: "123 Avenue des Champs-Élysées",
      zipCode: "75008",
    },
    specialties: ["Office", "Retail"],
    certifications: ["CCIM", "SIOR"],
    rating: 4.9,
    reviews: 127,
    yearsExperience: 15,
    totalTransactions: 245,
    totalVolume: 125000000,
    bio: "Expert en immobilier commercial avec plus de 15 ans d'expérience dans la région parisienne.",
    languages: ["Français", "Anglais"],
    isVerified: true,
  },
  // ... plus de professionnels
]

export async function seedProfessionals() {
  try {
    await connectToDatabase()

    // Supprimer les données existantes
    await Professional.deleteMany({})

    // Insérer les nouvelles données
    await Professional.insertMany(professionals)

    console.log("✅ Professionnels créés avec succès")
  } catch (error) {
    console.error("❌ Erreur lors de la création des professionnels:", error)
  }
}
