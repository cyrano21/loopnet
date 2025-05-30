import { connectToDatabase } from "../lib/mongodb"
import Professional from "../models/Professional"
import Property from "../models/Property"

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
    profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Marie Dubois",
    title: "Directrice Commerciale",
    company: "Immobilier Excellence",
    email: "marie.dubois@excellence.com",
    phone: "+33 1 45 78 90 12",
    location: {
      city: "Lyon",
      state: "Auvergne-Rhône-Alpes",
      address: "45 Rue de la République",
      zipCode: "69002",
    },
    specialties: ["Industrial", "Warehouse"],
    certifications: ["CCIM"],
    rating: 4.7,
    reviews: 89,
    yearsExperience: 12,
    totalTransactions: 156,
    totalVolume: 89000000,
    bio: "Spécialiste de l'immobilier industriel et logistique dans la région lyonnaise.",
    languages: ["Français", "Anglais", "Allemand"],
    isVerified: true,
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b566?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Pierre Martin",
    title: "Consultant Senior",
    company: "Urban Properties",
    email: "pierre.martin@urban.com",
    phone: "+33 4 56 78 90 12",
    location: {
      city: "Marseille",
      state: "Provence-Alpes-Côte d'Azur",
      address: "78 La Canebière",
      zipCode: "13001",
    },
    specialties: ["Hotel", "Restaurant"],
    certifications: ["SIOR"],
    rating: 4.8,
    reviews: 203,
    yearsExperience: 18,
    totalTransactions: 312,
    totalVolume: 187000000,
    bio: "Expert en immobilier hôtelier et de restauration sur la côte méditerranéenne.",
    languages: ["Français", "Anglais", "Italien"],
    isVerified: true,
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Sophie Laurent",
    title: "Broker Associate",
    company: "Metropole Realty",
    email: "sophie.laurent@metropole.com",
    phone: "+33 5 67 89 01 23",
    location: {
      city: "Toulouse",
      state: "Occitanie",
      address: "12 Place du Capitole",
      zipCode: "31000",
    },
    specialties: ["Office", "Medical"],
    certifications: ["CCIM", "CPM"],
    rating: 4.6,
    reviews: 145,
    yearsExperience: 10,
    totalTransactions: 198,
    totalVolume: 76000000,
    bio: "Spécialisée dans les bureaux et l'immobilier médical à Toulouse et sa région.",
    languages: ["Français", "Anglais", "Espagnol"],
    isVerified: true,
    profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Alexandre Moreau",
    title: "Investment Specialist",
    company: "Capital Investments",
    email: "alexandre.moreau@capital.com",
    phone: "+33 2 34 56 78 90",
    location: {
      city: "Nantes",
      state: "Pays de la Loire",
      address: "56 Cours des 50 Otages",
      zipCode: "44000",
    },
    specialties: ["Investment", "Development"],
    certifications: ["CCIM", "SIOR", "CRE"],
    rating: 4.9,
    reviews: 76,
    yearsExperience: 20,
    totalTransactions: 87,
    totalVolume: 234000000,
    bio: "Expert en investissement immobilier commercial et développement de projets.",
    languages: ["Français", "Anglais"],
    isVerified: true,
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  }
]

export async function seedProfessionals() {
  try {
    await connectToDatabase()

    // Supprimer les données existantes
    await Professional.deleteMany({})

    // Insérer les nouvelles données
    const createdProfessionals = await Professional.insertMany(professionals)
    console.log(`✅ ${createdProfessionals.length} Professionnels créés avec succès`)

    // Récupérer toutes les propriétés existantes
    const properties = await Property.find({}).limit(20) // Limiter à 20 propriétés pour l'exemple
    
    if (properties.length > 0) {
      console.log(`🔍 ${properties.length} propriétés trouvées, association aux agents...`)
      
      // Associer aléatoirement des agents aux propriétés
      for (let i = 0; i < properties.length; i++) {
        const randomProfessional = createdProfessionals[i % createdProfessionals.length]
        
        // Mettre à jour la propriété avec les informations de l'agent
        await Property.findByIdAndUpdate(properties[i]._id, {
          agent: {
            name: randomProfessional.name,
            phone: randomProfessional.phone,
            email: randomProfessional.email,
            company: randomProfessional.company,
            image: randomProfessional.profileImage
          },
          ownerType: "agent"
        })
      }
      
      console.log(`✅ ${properties.length} propriétés associées aux agents`)
    } else {
      console.log("⚠️ Aucune propriété trouvée pour l'association")
    }

  } catch (error) {
    console.error("❌ Erreur lors de la création des professionnels:", error)
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedProfessionals().then(() => {
    console.log("🏁 Script terminé")
    process.exit(0)
  }).catch((error) => {
    console.error("💥 Erreur fatale:", error)
    process.exit(1)
  })
}
