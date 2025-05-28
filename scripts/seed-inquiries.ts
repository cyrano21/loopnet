import mongoose from 'mongoose'
import Inquiry from '../models/Inquiry'
import User from '../models/User'
import Property from '../models/Property'

export async function seedInquiries() {
  try {
    console.log('🔄 Seeding inquiries...')

    // Supprimer les inquiries existantes
    await Inquiry.deleteMany({})

    // Récupérer des utilisateurs et propriétés existants
    const users = await User.find().limit(10)
    const properties = await Property.find().limit(20)

    if (users.length === 0) {
      throw new Error('Aucun utilisateur trouvé. Veuillez d\'abord exécuter le seeding des utilisateurs.')
    }

    if (properties.length === 0) {
      throw new Error('Aucune propriété trouvée. Veuillez d\'abord exécuter le seeding des propriétés.')
    }

    const inquiries = [
      {
        property: properties[0]._id,
        inquirer: users[0]._id,
        owner: users[1]._id,
        message: "Je suis intéressé par cette propriété. Pourriez-vous me fournir plus d'informations sur les conditions de location ?",
        contactMethod: "email" as const,
        inquirerInfo: {
          name: "Jean Dupont",
          email: "jean.dupont@email.com",
          phone: "+33 1 23 45 67 89"
        },
        status: "new" as const,
        visitRequested: true,
        preferredVisitDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Dans 7 jours
      },
      {
        property: properties[1]._id,
        inquirer: users[2]._id,
        owner: users[3]._id,
        message: "Bonjour, cette propriété correspond exactement à ce que je recherche. Serait-il possible d'organiser une visite cette semaine ?",
        contactMethod: "both" as const,
        inquirerInfo: {
          name: "Marie Martin",
          email: "marie.martin@email.com",
          phone: "+33 6 12 34 56 78"
        },
        status: "read" as const,
        visitRequested: true,
        preferredVisitDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // Dans 3 jours
      },
      {
        property: properties[2]._id,
        inquirer: users[4]._id,
        owner: users[5]._id,
        message: "Je représente une entreprise qui cherche des locaux commerciaux. Cette propriété pourrait nous intéresser. Pouvons-nous discuter des modalités ?",
        contactMethod: "phone" as const,
        inquirerInfo: {
          name: "Pierre Durand",
          email: "pierre.durand@entreprise.com",
          phone: "+33 1 98 76 54 32"
        },
        status: "replied" as const,
        visitRequested: false,
        ownerResponse: "Merci pour votre intérêt. Je vous contacte demain pour organiser une visite.",
        respondedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // Il y a 2 jours
      },
      {
        property: properties[3]._id,
        inquirer: users[6]._id,
        owner: users[7]._id,
        message: "Propriété très intéressante ! Quels sont les frais annexes et les conditions de bail ?",
        contactMethod: "email" as const,
        inquirerInfo: {
          name: "Sophie Leblanc",
          email: "sophie.leblanc@email.com"
        },
        status: "new" as const,
        visitRequested: false
      },
      {
        property: properties[4]._id,
        inquirer: users[8]._id,
        owner: users[9]._id,
        message: "Je cherche un investissement locatif. Cette propriété a-t-elle un bon potentiel de rendement ?",
        contactMethod: "both" as const,
        inquirerInfo: {
          name: "Thomas Bernard",
          email: "thomas.bernard@investisseur.com",
          phone: "+33 6 87 65 43 21"
        },
        status: "closed" as const,
        visitRequested: true,
        preferredVisitDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Il y a 5 jours
        ownerResponse: "Merci pour votre intérêt, mais la propriété a été louée.",
        respondedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // Il y a 3 jours
      }
    ]

    // Créer plus d'inquiries si on a assez d'utilisateurs et de propriétés
    const additionalInquiries = []
    for (let i = 5; i < Math.min(properties.length, 15); i++) {
      const inquirer = users[i % users.length]
      const owner = users[(i + 1) % users.length]
      
      if (inquirer._id.toString() !== owner._id.toString()) {
        additionalInquiries.push({
          property: properties[i]._id,
          inquirer: inquirer._id,
          owner: owner._id,
          message: `Demande d'information pour la propriété ${i + 1}. Pourriez-vous me donner plus de détails ?`,
          contactMethod: ["email", "phone", "both"][i % 3] as "email" | "phone" | "both",
          inquirerInfo: {
            name: `Utilisateur ${i + 1}`,
            email: `user${i + 1}@email.com`,
            phone: i % 2 === 0 ? `+33 6 ${String(i).padStart(2, '0')} ${String(i).padStart(2, '0')} ${String(i).padStart(2, '0')} ${String(i).padStart(2, '0')}` : undefined
          },
          status: ["new", "read", "replied", "closed"][i % 4] as "new" | "read" | "replied" | "closed",
          visitRequested: i % 3 === 0
        })
      }
    }

    const allInquiries = [...inquiries, ...additionalInquiries]

    // Insérer les inquiries
    const createdInquiries = await Inquiry.insertMany(allInquiries)

    console.log(`✅ ${createdInquiries.length} inquiries créées avec succès`)
    return { success: true, count: createdInquiries.length }

  } catch (error) {
    console.error('❌ Erreur lors du seeding des inquiries:', error)
    throw error
  }
}

// Fonction pour exécuter le seeding individuellement
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loopnet')
    .then(() => {
      console.log('📦 Connexion à MongoDB établie')
      return seedInquiries()
    })
    .then((result) => {
      console.log('🎉 Seeding des inquiries terminé:', result)
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Erreur:', error)
      process.exit(1)
    })
}