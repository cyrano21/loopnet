import mongoose from 'mongoose'
import SearchAlert from '../models/SearchAlert'
import User from '../models/User'
import { connectDB } from '../lib/mongodb'

const searchAlertsData = [
  {
    name: 'Alerte Bureaux Paris',
    searchCriteria: {
      query: 'bureau standing',
      location: {
        city: 'Paris',
        postalCode: '75008',
        radius: 3
      },
      propertyType: 'bureau',
      transactionType: 'rent',
      priceRange: {
        min: 3000,
        max: 10000
      },
      surfaceRange: {
        min: 100,
        max: 300
      }
    },
    frequency: 'daily',
    isActive: true,
    emailNotifications: true,
    pushNotifications: true
  },
  {
    name: 'Alerte Commerces Lyon',
    searchCriteria: {
      query: 'local commercial centre ville',
      location: {
        city: 'Lyon',
        postalCode: '69002',
        radius: 5
      },
      propertyType: 'commercial',
      transactionType: 'sale',
      priceRange: {
        min: 150000,
        max: 800000
      },
      surfaceRange: {
        min: 50,
        max: 200
      }
    },
    frequency: 'weekly',
    isActive: true,
    emailNotifications: true,
    pushNotifications: false
  },
  {
    name: 'Alerte Entrepôts Bordeaux',
    searchCriteria: {
      query: 'entrepôt logistique',
      location: {
        city: 'Bordeaux',
        postalCode: '33000',
        radius: 25
      },
      propertyType: 'entrepot',
      transactionType: 'rent',
      priceRange: {
        min: 8000,
        max: 25000
      },
      surfaceRange: {
        min: 1000,
        max: 5000
      }
    },
    frequency: 'weekly',
    isActive: true,
    emailNotifications: true,
    pushNotifications: true
  },
  {
    name: 'Alerte Terrains Lille',
    searchCriteria: {
      query: 'terrain industriel',
      location: {
        city: 'Lille',
        postalCode: '59000',
        radius: 30
      },
      propertyType: 'terrain',
      transactionType: 'sale',
      priceRange: {
        min: 100000,
        max: 500000
      },
      surfaceRange: {
        min: 2000,
        max: 10000
      }
    },
    frequency: 'monthly',
    isActive: false,
    emailNotifications: true,
    pushNotifications: false
  },
  {
    name: 'Alerte Hôtels Côte d\'Azur',
    searchCriteria: {
      query: 'hôtel vue mer',
      location: {
        city: 'Cannes',
        postalCode: '06400',
        radius: 20
      },
      propertyType: 'hotel',
      transactionType: 'sale',
      priceRange: {
        min: 1000000,
        max: 5000000
      }
    },
    frequency: 'monthly',
    isActive: true,
    emailNotifications: true,
    pushNotifications: true
  }
]

export async function seedSearchAlerts() {
  try {
    await connectDB()
    
    // Supprimer les alertes existantes
    await SearchAlert.deleteMany({})
    console.log('🗑️ Alertes de recherche existantes supprimées')
    
    // Récupérer quelques utilisateurs pour associer les alertes
    const users = await User.find().limit(5)
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé. Veuillez d\'abord créer des utilisateurs.')
      return
    }
    
    // Créer les alertes de recherche
    const searchAlerts = []
    for (let i = 0; i < searchAlertsData.length; i++) {
      const alertData = searchAlertsData[i]
      const user = users[i % users.length] // Distribuer les alertes entre les utilisateurs
      
      searchAlerts.push({
        ...alertData,
        user: user._id,
        lastTriggered: i % 2 === 0 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined
      })
    }
    
    await SearchAlert.insertMany(searchAlerts)
    console.log(`✅ ${searchAlerts.length} alertes de recherche créées avec succès`)
    
    // Afficher un résumé
    const count = await SearchAlert.countDocuments()
    const activeCount = await SearchAlert.countDocuments({ isActive: true })
    console.log(`📊 Total des alertes en base: ${count} (${activeCount} actives)`)
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding des alertes de recherche:', error)
    throw error
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedSearchAlerts()
    .then(() => {
      console.log('🎉 Seeding des alertes de recherche terminé')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error)
      process.exit(1)
    })
}