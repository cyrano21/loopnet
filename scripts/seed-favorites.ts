import mongoose from 'mongoose'
import Favorite from '../models/Favorite'
import User from '../models/User'
import Property from '../models/Property'
import { connectDB } from '../lib/mongodb'

const favoritesData = [
  {
    notes: 'Excellent emplacement, proche des transports',
    tags: ['transport', 'centre-ville', 'moderne']
  },
  {
    notes: 'Bon potentiel de rentabilité, à négocier',
    tags: ['investissement', 'rentable', 'négociation']
  },
  {
    notes: 'Parfait pour notre expansion',
    tags: ['expansion', 'stratégique', 'croissance']
  },
  {
    notes: 'Intéressant mais nécessite des travaux',
    tags: ['travaux', 'potentiel', 'rénovation']
  },
  {
    notes: 'Coup de cœur, emplacement exceptionnel',
    tags: ['coup-de-coeur', 'premium', 'emplacement']
  },
  {
    notes: 'À surveiller, prix attractif',
    tags: ['prix-attractif', 'opportunité', 'surveillance']
  },
  {
    notes: 'Idéal pour notre activité',
    tags: ['adapté', 'activité', 'fonctionnel']
  },
  {
    notes: 'Belle surface, bien agencé',
    tags: ['surface', 'agencement', 'spacieux']
  },
  {
    notes: 'Parking inclus, très pratique',
    tags: ['parking', 'pratique', 'commodité']
  },
  {
    notes: 'Vue exceptionnelle, standing élevé',
    tags: ['vue', 'standing', 'prestige']
  }
]

export async function seedFavorites() {
  try {
    await connectDB()
    
    // Supprimer les favoris existants
    await Favorite.deleteMany({})
    console.log('🗑️ Favoris existants supprimés')
    
    // Récupérer des utilisateurs et des propriétés
    const users = await User.find().limit(10)
    const properties = await Property.find().limit(20)
    
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé. Veuillez d\'abord créer des utilisateurs.')
      return
    }
    
    if (properties.length === 0) {
      console.log('❌ Aucune propriété trouvée. Veuillez d\'abord créer des propriétés.')
      return
    }
    
    // Créer les favoris
    const favorites = []
    const usedCombinations = new Set()
    
    for (let i = 0; i < Math.min(favoritesData.length * 2, 20); i++) {
      const user = users[Math.floor(Math.random() * users.length)]
      const property = properties[Math.floor(Math.random() * properties.length)]
      const favoriteData = favoritesData[i % favoritesData.length]
      
      // Éviter les doublons user-property
      const combination = `${user._id}-${property._id}`
      if (usedCombinations.has(combination)) {
        continue
      }
      usedCombinations.add(combination)
      
      favorites.push({
        user: user._id,
        property: property._id,
        notes: favoriteData.notes,
        tags: favoriteData.tags,
        isActive: Math.random() > 0.1 // 90% des favoris sont actifs
      })
    }
    
    if (favorites.length > 0) {
      await Favorite.insertMany(favorites)
      console.log(`✅ ${favorites.length} favoris créés avec succès`)
    }
    
    // Afficher un résumé
    const count = await Favorite.countDocuments()
    const activeCount = await Favorite.countDocuments({ isActive: true })
    console.log(`📊 Total des favoris en base: ${count} (${activeCount} actifs)`)
    
    // Statistiques par utilisateur
    const userStats = await Favorite.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$user', count: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { userName: '$user.name', favoriteCount: '$count' } },
      { $sort: { favoriteCount: -1 } }
    ])
    
    console.log('📈 Favoris par utilisateur:')
    userStats.forEach(stat => {
      console.log(`   ${stat.userName}: ${stat.favoriteCount} favoris`)
    })
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding des favoris:', error)
    throw error
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedFavorites()
    .then(() => {
      console.log('🎉 Seeding des favoris terminé')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error)
      process.exit(1)
    })
}