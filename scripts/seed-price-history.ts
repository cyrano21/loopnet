import mongoose from 'mongoose'
import PriceHistory from '../models/PriceHistory'
import Property from '../models/Property'
import User from '../models/User'
import { connectDB } from '../lib/mongodb'

const changeReasons = [
  'Ajustement marché',
  'Négociation client',
  'Réévaluation propriété',
  'Stratégie commerciale',
  'Évolution du marché',
  'Demande client',
  'Analyse concurrentielle',
  'Optimisation prix',
  'Correction d\'erreur',
  'Mise à jour automatique'
]

const priceTypes = ['asking', 'sold', 'estimated']
const priceTypeWeights = [0.6, 0.25, 0.15] // 60% asking, 25% sold, 15% estimated

function getRandomPriceType(): string {
  const random = Math.random()
  let cumulative = 0
  
  for (let i = 0; i < priceTypes.length; i++) {
    cumulative += priceTypeWeights[i]
    if (random <= cumulative) {
      return priceTypes[i]
    }
  }
  return priceTypes[0]
}

function generatePriceEvolution(initialPrice: number, months: number) {
  const priceHistory = []
  let currentPrice = initialPrice
  const baseDate = new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000)
  
  for (let i = 0; i < months; i++) {
    // Variation de prix réaliste (-10% à +15%)
    const variation = (Math.random() - 0.6) * 0.25 // Légèrement biaisé vers la baisse
    const newPrice = Math.round(currentPrice * (1 + variation))
    
    // Éviter les variations trop importantes d'un mois à l'autre
    const maxChange = currentPrice * 0.1 // Max 10% de variation
    const priceChange = Math.max(-maxChange, Math.min(maxChange, newPrice - currentPrice))
    currentPrice = Math.round(currentPrice + priceChange)
    
    const recordDate = new Date(baseDate.getTime() + i * 30 * 24 * 60 * 60 * 1000)
    
    priceHistory.push({
      price: currentPrice,
      priceType: getRandomPriceType(),
      date: recordDate,
      changeReason: i === 0 ? 'Prix initial' : changeReasons[Math.floor(Math.random() * changeReasons.length)],
      marketConditions: {
        demandLevel: Math.random() > 0.5 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
        competitionLevel: Math.random() > 0.5 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
        seasonalFactor: getSeasonalFactor(recordDate.getMonth())
      }
    })
  }
  
  return priceHistory
}

function getSeasonalFactor(month: number): number {
  // Facteur saisonnier pour l'immobilier commercial (0.8 à 1.2)
  const seasonalFactors = {
    0: 0.9,  // Janvier
    1: 0.85, // Février
    2: 0.95, // Mars
    3: 1.1,  // Avril
    4: 1.15, // Mai
    5: 1.2,  // Juin
    6: 1.1,  // Juillet
    7: 0.9,  // Août
    8: 1.15, // Septembre
    9: 1.2,  // Octobre
    10: 1.05, // Novembre
    11: 0.8   // Décembre
  }
  
  return seasonalFactors[month as keyof typeof seasonalFactors] || 1.0
}

function calculateStatistics(priceHistory: any[]) {
  if (priceHistory.length === 0) return {}
  
  const prices = priceHistory.map(p => p.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
  
  // Calcul de la volatilité (écart-type relatif)
  const variance = prices.reduce((acc, price) => acc + Math.pow(price - avgPrice, 2), 0) / prices.length
  const volatility = Math.sqrt(variance) / avgPrice
  
  // Tendance générale
  const firstPrice = prices[0]
  const lastPrice = prices[prices.length - 1]
  const overallTrend = lastPrice > firstPrice ? 'up' : lastPrice < firstPrice ? 'down' : 'stable'
  const trendPercentage = ((lastPrice - firstPrice) / firstPrice) * 100
  
  return {
    minPrice,
    maxPrice,
    avgPrice,
    volatility: Math.round(volatility * 10000) / 100, // En pourcentage avec 2 décimales
    overallTrend,
    trendPercentage: Math.round(trendPercentage * 100) / 100,
    priceRange: maxPrice - minPrice,
    totalChanges: priceHistory.length - 1
  }
}

export async function seedPriceHistory() {
  try {
    await connectDB()
    
    // Supprimer l'historique des prix existant
    await PriceHistory.deleteMany({})
    console.log('🗑️ Historique des prix existant supprimé')
    
    // Récupérer des propriétés et des utilisateurs
    const properties = await Property.find().limit(30)
    const users = await User.find().limit(10)
    
    if (properties.length === 0) {
      console.log('❌ Aucune propriété trouvée. Veuillez d\'abord créer des propriétés.')
      return
    }
    
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé. Veuillez d\'abord créer des utilisateurs.')
      return
    }
    
    // Créer l'historique des prix
    const priceHistories = []
    
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i]
      const user = users[i % users.length]
      
      // Générer un prix initial basé sur le type de propriété
      const basePrice = {
        'bureau': 300000,
        'commercial': 250000,
        'entrepot': 400000,
        'terrain': 150000,
        'hotel': 800000,
        'industriel': 500000
      }[property.propertyType] || 300000
      
      const initialPrice = Math.round(basePrice * (0.5 + Math.random() * 1.5)) // ±50% variation
      
      // Générer 6 à 18 mois d'historique
      const monthsOfHistory = Math.floor(Math.random() * 13) + 6
      const priceEvolution = generatePriceEvolution(initialPrice, monthsOfHistory)
      
      const statistics = calculateStatistics(priceEvolution)
      
      const priceHistory = {
        property: property._id,
        user: user._id,
        priceHistory: priceEvolution,
        currentPrice: priceEvolution[priceEvolution.length - 1].price,
        initialPrice,
        statistics,
        lastUpdated: new Date(),
        isActive: Math.random() > 0.1, // 90% actifs
        notes: [
          {
            content: 'Historique des prix initialisé',
            createdAt: new Date(Date.now() - monthsOfHistory * 30 * 24 * 60 * 60 * 1000),
            author: user._id
          },
          ...(Math.random() > 0.5 ? [{
            content: 'Ajustement de prix suite à analyse de marché',
            createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
            author: user._id
          }] : [])
        ],
        alerts: statistics.volatility > 15 ? [{
          type: 'high_volatility',
          message: `Volatilité élevée détectée (${statistics.volatility}%)`,
          createdAt: new Date(),
          isActive: true
        }] : [],
        metadata: {
          source: 'manual_entry',
          accuracy: Math.random() * 20 + 80, // 80-100%
          lastValidation: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          dataQuality: Math.random() > 0.8 ? 'excellent' : Math.random() > 0.5 ? 'good' : 'fair'
        }
      }
      
      priceHistories.push(priceHistory)
    }
    
    await PriceHistory.insertMany(priceHistories)
    console.log(`✅ ${priceHistories.length} historiques de prix créés avec succès`)
    
    // Afficher un résumé
    const count = await PriceHistory.countDocuments()
    console.log(`📊 Total des historiques en base: ${count}`)
    
    // Statistiques générales
    const globalStats = await PriceHistory.aggregate([
      {
        $group: {
          _id: null,
          avgCurrentPrice: { $avg: '$currentPrice' },
          avgInitialPrice: { $avg: '$initialPrice' },
          avgVolatility: { $avg: '$statistics.volatility' },
          totalProperties: { $sum: 1 }
        }
      }
    ])
    
    if (globalStats.length > 0) {
      const stats = globalStats[0]
      console.log(`💰 Prix moyen actuel: ${Math.round(stats.avgCurrentPrice).toLocaleString('fr-FR')} €`)
      console.log(`📈 Prix moyen initial: ${Math.round(stats.avgInitialPrice).toLocaleString('fr-FR')} €`)
      console.log(`📊 Volatilité moyenne: ${Math.round(stats.avgVolatility * 100) / 100}%`)
      
      const priceEvolution = ((stats.avgCurrentPrice - stats.avgInitialPrice) / stats.avgInitialPrice) * 100
      console.log(`🔄 Évolution moyenne: ${Math.round(priceEvolution * 100) / 100}%`)
    }
    
    // Propriétés avec forte volatilité
    const highVolatility = await PriceHistory.countDocuments({
      'statistics.volatility': { $gt: 15 }
    })
    console.log(`⚠️ Propriétés à forte volatilité (>15%): ${highVolatility}`)
    
    // Tendances
    const trendStats = await PriceHistory.aggregate([
      {
        $group: {
          _id: '$statistics.overallTrend',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ])
    
    console.log('📈 Tendances générales:')
    trendStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} propriétés`)
    })
    
    // Alertes actives
    const activeAlerts = await PriceHistory.countDocuments({
      'alerts.isActive': true
    })
    console.log(`🚨 Alertes actives: ${activeAlerts}`)
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding de l\'historique des prix:', error)
    throw error
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedPriceHistory()
    .then(() => {
      console.log('🎉 Seeding de l\'historique des prix terminé')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error)
      process.exit(1)
    })
}