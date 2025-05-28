import mongoose from 'mongoose'
import MarketAnalysis from '../models/MarketAnalysis'
import User from '../models/User'
import { connectDB } from '../lib/mongodb'

const cities = [
  { name: 'Paris', postalCode: '75000', region: 'Île-de-France' },
  { name: 'Lyon', postalCode: '69000', region: 'Auvergne-Rhône-Alpes' },
  { name: 'Marseille', postalCode: '13000', region: 'Provence-Alpes-Côte d\'Azur' },
  { name: 'Toulouse', postalCode: '31000', region: 'Occitanie' },
  { name: 'Nice', postalCode: '06000', region: 'Provence-Alpes-Côte d\'Azur' },
  { name: 'Nantes', postalCode: '44000', region: 'Pays de la Loire' },
  { name: 'Bordeaux', postalCode: '33000', region: 'Nouvelle-Aquitaine' },
  { name: 'Lille', postalCode: '59000', region: 'Hauts-de-France' },
  { name: 'Strasbourg', postalCode: '67000', region: 'Grand Est' },
  { name: 'Rennes', postalCode: '35000', region: 'Bretagne' }
]

const propertyTypes = ['bureau', 'commercial', 'entrepot', 'terrain', 'hotel', 'industriel']
const analysisTypes = ['market_overview', 'price_analysis', 'trend_analysis', 'competitive_analysis', 'investment_analysis']

function generateMarketData(city: string, propertyType: string) {
  const basePrice = {
    'Paris': { bureau: 8000, commercial: 12000, entrepot: 150, terrain: 800, hotel: 15000, industriel: 120 },
    'Lyon': { bureau: 4500, commercial: 7000, entrepot: 100, terrain: 400, hotel: 8000, industriel: 80 },
    'Marseille': { bureau: 3800, commercial: 6000, entrepot: 90, terrain: 350, hotel: 7000, industriel: 70 },
    'Toulouse': { bureau: 3500, commercial: 5500, entrepot: 85, terrain: 300, hotel: 6500, industriel: 65 },
    'Nice': { bureau: 4200, commercial: 6800, entrepot: 110, terrain: 450, hotel: 9000, industriel: 85 }
  }[city] || { bureau: 3000, commercial: 5000, entrepot: 80, terrain: 250, hotel: 6000, industriel: 60 }
  
  const price = basePrice[propertyType as keyof typeof basePrice] || 3000
  const variation = (Math.random() - 0.5) * 0.4 // ±20% variation
  
  return {
    averagePrice: Math.round(price * (1 + variation)),
    pricePerSqm: Math.round((price * (1 + variation)) / 100),
    totalListings: Math.floor(Math.random() * 500) + 50,
    activeListings: Math.floor(Math.random() * 300) + 30,
    soldListings: Math.floor(Math.random() * 100) + 10,
    averageDaysOnMarket: Math.floor(Math.random() * 120) + 30,
    priceEvolution: {
      lastMonth: (Math.random() - 0.5) * 10, // ±5%
      lastQuarter: (Math.random() - 0.5) * 20, // ±10%
      lastYear: (Math.random() - 0.5) * 30 // ±15%
    },
    demandIndicators: {
      searchVolume: Math.floor(Math.random() * 1000) + 100,
      inquiryRate: Math.random() * 20 + 5, // 5-25%
      viewingRate: Math.random() * 15 + 10 // 10-25%
    },
    supplyIndicators: {
      newListings: Math.floor(Math.random() * 50) + 10,
      inventory: Math.floor(Math.random() * 200) + 50,
      absorptionRate: Math.random() * 30 + 10 // 10-40%
    }
  }
}

function generateCompetitiveData() {
  const competitors = [
    'Immobilier Pro', 'Commercial Expert', 'Business Properties', 
    'Prime Location', 'Corporate Real Estate', 'Professional Spaces'
  ]
  
  return competitors.slice(0, Math.floor(Math.random() * 4) + 2).map(name => ({
    name,
    marketShare: Math.random() * 25 + 5, // 5-30%
    averagePrice: Math.floor(Math.random() * 5000) + 2000,
    listingCount: Math.floor(Math.random() * 100) + 20,
    strengths: ['Emplacement', 'Prix', 'Service', 'Réseau'].slice(0, Math.floor(Math.random() * 3) + 1),
    weaknesses: ['Disponibilité', 'Flexibilité', 'Communication'].slice(0, Math.floor(Math.random() * 2) + 1)
  }))
}

function generateInvestmentMetrics() {
  return {
    roi: Math.random() * 10 + 3, // 3-13%
    capRate: Math.random() * 8 + 2, // 2-10%
    cashOnCash: Math.random() * 12 + 4, // 4-16%
    paybackPeriod: Math.random() * 15 + 8, // 8-23 ans
    riskScore: Math.floor(Math.random() * 10) + 1, // 1-10
    liquidityScore: Math.floor(Math.random() * 10) + 1, // 1-10
    growthPotential: Math.random() * 20 + 5 // 5-25%
  }
}

export async function seedMarketAnalysis() {
  try {
    await connectDB()
    
    // Supprimer les analyses existantes
    await MarketAnalysis.deleteMany({})
    console.log('🗑️ Analyses de marché existantes supprimées')
    
    // Récupérer des utilisateurs
    const users = await User.find().limit(10)
    
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé. Veuillez d\'abord créer des utilisateurs.')
      return
    }
    
    // Créer les analyses de marché
    const analyses = []
    
    for (let i = 0; i < 40; i++) {
      const city = cities[i % cities.length]
      const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)]
      const analysisType = analysisTypes[Math.floor(Math.random() * analysisTypes.length)]
      const user = users[i % users.length]
      
      // Dates réalistes
      const createdAt = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000) // Derniers 6 mois
      const periodStart = new Date(createdAt.getTime() - 90 * 24 * 60 * 60 * 1000) // 3 mois avant
      const periodEnd = new Date(createdAt.getTime() - 7 * 24 * 60 * 60 * 1000) // 1 semaine avant
      
      const analysis = {
        user: user._id,
        title: `Analyse ${analysisType.replace('_', ' ')} - ${city.name} ${propertyType}`,
        description: `Étude détaillée du marché ${propertyType} à ${city.name} pour la période ${periodStart.toLocaleDateString('fr-FR')} - ${periodEnd.toLocaleDateString('fr-FR')}`,
        location: {
          city: city.name,
          postalCode: city.postalCode,
          region: city.region,
          radius: Math.floor(Math.random() * 30) + 5 // 5-35 km
        },
        propertyType,
        analysisType,
        period: {
          start: periodStart,
          end: periodEnd
        },
        marketData: generateMarketData(city.name, propertyType),
        competitiveAnalysis: Math.random() > 0.3 ? generateCompetitiveData() : undefined,
        investmentMetrics: analysisType === 'investment_analysis' || Math.random() > 0.5 
          ? generateInvestmentMetrics() 
          : undefined,
        trends: [
          {
            indicator: 'Prix moyen',
            direction: Math.random() > 0.5 ? 'up' : 'down',
            magnitude: Math.random() * 15 + 2, // 2-17%
            confidence: Math.random() * 30 + 70, // 70-100%
            description: 'Évolution des prix sur la période analysée'
          },
          {
            indicator: 'Volume de transactions',
            direction: Math.random() > 0.4 ? 'up' : 'down',
            magnitude: Math.random() * 25 + 5, // 5-30%
            confidence: Math.random() * 25 + 75, // 75-100%
            description: 'Évolution du nombre de transactions'
          },
          {
            indicator: 'Temps de vente',
            direction: Math.random() > 0.6 ? 'down' : 'up',
            magnitude: Math.random() * 20 + 3, // 3-23%
            confidence: Math.random() * 20 + 80, // 80-100%
            description: 'Évolution de la durée moyenne de commercialisation'
          }
        ],
        insights: [
          `Le marché ${propertyType} à ${city.name} montre des signes de ${Math.random() > 0.5 ? 'dynamisme' : 'stabilisation'}.`,
          `Les prix ont ${Math.random() > 0.5 ? 'augmenté' : 'diminué'} de ${Math.floor(Math.random() * 10) + 1}% sur la période.`,
          `La demande reste ${Math.random() > 0.5 ? 'soutenue' : 'modérée'} avec ${Math.floor(Math.random() * 50) + 20} nouvelles recherches par semaine.`,
          `Les investisseurs ${Math.random() > 0.5 ? 'privilégient' : 'délaissent'} ce secteur géographique.`
        ],
        recommendations: [
          Math.random() > 0.5 ? 'Maintenir les prix actuels' : 'Ajuster les prix à la baisse',
          Math.random() > 0.5 ? 'Intensifier les efforts marketing' : 'Optimiser la présentation des biens',
          Math.random() > 0.5 ? 'Cibler les investisseurs institutionnels' : 'Développer le marché des particuliers',
          'Surveiller l\'évolution de la concurrence'
        ],
        confidence: Math.random() * 20 + 80, // 80-100%
        methodology: 'Analyse basée sur les données de transactions, les annonces actives et les indicateurs économiques locaux.',
        dataSources: [
          'Base de données interne',
          'Notaires de France',
          'INSEE',
          'Observatoire des loyers commerciaux'
        ],
        isPublic: Math.random() > 0.7, // 30% publiques
        tags: [
          city.name.toLowerCase(),
          propertyType,
          analysisType,
          city.region.toLowerCase().replace(/[^a-z]/g, ''),
          ...(Math.random() > 0.5 ? ['trending'] : []),
          ...(Math.random() > 0.7 ? ['premium'] : [])
        ]
      }
      
      analyses.push(analysis)
    }
    
    await MarketAnalysis.insertMany(analyses)
    console.log(`✅ ${analyses.length} analyses de marché créées avec succès`)
    
    // Afficher un résumé
    const count = await MarketAnalysis.countDocuments()
    console.log(`📊 Total des analyses en base: ${count}`)
    
    // Statistiques par ville
    const cityStats = await MarketAnalysis.aggregate([
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
    
    console.log('🏙️ Analyses par ville:')
    cityStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} analyses`)
    })
    
    // Statistiques par type de propriété
    const propertyStats = await MarketAnalysis.aggregate([
      { $group: { _id: '$propertyType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
    
    console.log('🏢 Analyses par type de propriété:')
    propertyStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} analyses`)
    })
    
    // Statistiques par type d'analyse
    const analysisStats = await MarketAnalysis.aggregate([
      { $group: { _id: '$analysisType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
    
    console.log('📈 Analyses par type:')
    analysisStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} analyses`)
    })
    
    // Analyses publiques
    const publicAnalyses = await MarketAnalysis.countDocuments({ isPublic: true })
    console.log(`🌐 Analyses publiques: ${publicAnalyses}`)
    
    // Confiance moyenne
    const avgConfidence = await MarketAnalysis.aggregate([
      { $group: { _id: null, avgConfidence: { $avg: '$confidence' } } }
    ])
    
    if (avgConfidence.length > 0) {
      console.log(`🎯 Confiance moyenne: ${Math.round(avgConfidence[0].avgConfidence)}%`)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding des analyses de marché:', error)
    throw error
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedMarketAnalysis()
    .then(() => {
      console.log('🎉 Seeding des analyses de marché terminé')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error)
      process.exit(1)
    })
}