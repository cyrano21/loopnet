import mongoose from 'mongoose'
import SavedSearch from '../models/SavedSearch'
import User from '../models/User'
import { connectDB } from '../lib/mongodb'

const savedSearchesData = [
  {
    name: 'Bureaux Paris Centre',
    searchCriteria: {
      query: 'bureau moderne',
      location: {
        city: 'Paris',
        postalCode: '75001',
        radius: 5
      },
      propertyType: 'bureau',
      transactionType: 'rent',
      priceRange: {
        min: 2000,
        max: 8000
      },
      surfaceRange: {
        min: 50,
        max: 200
      }
    },
    alertsEnabled: true,
    alertFrequency: 'daily'
  },
  {
    name: 'Locaux commerciaux Lyon',
    searchCriteria: {
      query: 'local commercial',
      location: {
        city: 'Lyon',
        postalCode: '69000',
        radius: 10
      },
      propertyType: 'commercial',
      transactionType: 'sale',
      priceRange: {
        min: 100000,
        max: 500000
      },
      surfaceRange: {
        min: 80,
        max: 300
      }
    },
    alertsEnabled: false,
    alertFrequency: 'weekly'
  },
  {
    name: 'Entrepôts Marseille',
    searchCriteria: {
      query: 'entrepôt logistique',
      location: {
        city: 'Marseille',
        postalCode: '13000',
        radius: 15
      },
      propertyType: 'entrepot',
      transactionType: 'rent',
      priceRange: {
        min: 5000,
        max: 20000
      },
      surfaceRange: {
        min: 500,
        max: 2000
      }
    },
    alertsEnabled: true,
    alertFrequency: 'weekly'
  },
  {
    name: 'Terrains constructibles Toulouse',
    searchCriteria: {
      query: 'terrain constructible',
      location: {
        city: 'Toulouse',
        postalCode: '31000',
        radius: 20
      },
      propertyType: 'terrain',
      transactionType: 'sale',
      priceRange: {
        min: 50000,
        max: 300000
      },
      surfaceRange: {
        min: 1000,
        max: 5000
      }
    },
    alertsEnabled: true,
    alertFrequency: 'monthly'
  },
  {
    name: 'Hôtels région PACA',
    searchCriteria: {
      query: 'hôtel restaurant',
      location: {
        city: 'Nice',
        postalCode: '06000',
        radius: 50
      },
      propertyType: 'hotel',
      transactionType: 'sale',
      priceRange: {
        min: 500000,
        max: 2000000
      }
    },
    alertsEnabled: false,
    alertFrequency: 'monthly'
  }
]

export async function seedSavedSearches() {
  try {
    await connectDB()
    
    // Supprimer les recherches sauvegardées existantes
    await SavedSearch.deleteMany({})
    console.log('🗑️ Recherches sauvegardées existantes supprimées')
    
    // Récupérer quelques utilisateurs pour associer les recherches
    const users = await User.find().limit(5)
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé. Veuillez d\'abord créer des utilisateurs.')
      return
    }
    
    // Créer les recherches sauvegardées
    const savedSearches = []
    for (let i = 0; i < savedSearchesData.length; i++) {
      const searchData = savedSearchesData[i]
      const user = users[i % users.length] // Distribuer les recherches entre les utilisateurs
      
      savedSearches.push({
        ...searchData,
        user: user._id
      })
    }
    
    await SavedSearch.insertMany(savedSearches)
    console.log(`✅ ${savedSearches.length} recherches sauvegardées créées avec succès`)
    
    // Afficher un résumé
    const count = await SavedSearch.countDocuments()
    console.log(`📊 Total des recherches sauvegardées en base: ${count}`)
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding des recherches sauvegardées:', error)
    throw error
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedSavedSearches()
    .then(() => {
      console.log('🎉 Seeding des recherches sauvegardées terminé')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error)
      process.exit(1)
    })
}