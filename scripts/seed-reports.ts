import mongoose from 'mongoose'
import Report from '../models/Report'
import User from '../models/User'
import { connectDB } from '../lib/mongodb'

const reportTemplates = [
  {
    title: 'Analyse de marché Q1 2024',
    type: 'market_analysis',
    description: 'Rapport trimestriel sur l\'évolution du marché immobilier commercial',
    parameters: {
      dateRange: {
        start: new Date('2024-01-01'),
        end: new Date('2024-03-31')
      },
      location: {
        city: 'Paris',
        radius: 25
      },
      propertyTypes: ['bureau', 'commercial', 'entrepot'],
      transactionTypes: ['sale', 'rent']
    }
  },
  {
    title: 'Évaluation immobilière - Bureau Champs-Élysées',
    type: 'property_valuation',
    description: 'Estimation détaillée d\'un bureau de standing',
    parameters: {
      location: {
        city: 'Paris',
        postalCode: '75008'
      },
      propertyTypes: ['bureau'],
      surfaceRange: {
        min: 200,
        max: 300
      }
    }
  },
  {
    title: 'Résumé commissions Janvier 2024',
    type: 'commission_summary',
    description: 'Synthèse des commissions perçues sur le mois',
    parameters: {
      dateRange: {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31')
      }
    }
  },
  {
    title: 'Performance commerciale équipe',
    type: 'performance',
    description: 'Analyse des performances de l\'équipe commerciale',
    parameters: {
      dateRange: {
        start: new Date('2024-01-01'),
        end: new Date('2024-03-31')
      },
      metrics: ['transactions', 'commissions', 'clients']
    }
  },
  {
    title: 'Activité clients VIP',
    type: 'client_activity',
    description: 'Suivi de l\'activité des clients premium',
    parameters: {
      dateRange: {
        start: new Date('2024-02-01'),
        end: new Date('2024-02-29')
      },
      clientSegments: ['premium', 'vip']
    }
  },
  {
    title: 'Rapport personnalisé - Investisseurs',
    type: 'custom',
    description: 'Analyse spécifique pour les investisseurs institutionnels',
    parameters: {
      customFilters: {
        investmentType: 'institutional',
        minAmount: 1000000
      },
      location: {
        city: 'Lyon',
        radius: 15
      }
    }
  }
]

const reportStatuses = ['draft', 'generating', 'completed', 'failed', 'archived']
const statusWeights = [0.1, 0.05, 0.7, 0.05, 0.1]

function getRandomStatus(): string {
  const random = Math.random()
  let cumulative = 0
  
  for (let i = 0; i < reportStatuses.length; i++) {
    cumulative += statusWeights[i]
    if (random <= cumulative) {
      return reportStatuses[i]
    }
  }
  return reportStatuses[2] // default to completed
}

function generateReportData(type: string) {
  const baseData = {
    summary: {
      totalProperties: Math.floor(Math.random() * 500) + 50,
      totalTransactions: Math.floor(Math.random() * 100) + 10,
      averagePrice: Math.floor(Math.random() * 500000) + 100000,
      marketTrend: Math.random() > 0.5 ? 'up' : 'down'
    }
  }
  
  switch (type) {
    case 'market_analysis':
      return {
        ...baseData,
        marketAnalysis: {
          priceEvolution: Math.random() * 20 - 10, // -10% à +10%
          volumeEvolution: Math.random() * 30 - 15,
          competitiveAnalysis: {
            marketShare: Math.random() * 100,
            mainCompetitors: ['Competitor A', 'Competitor B', 'Competitor C']
          }
        }
      }
    
    case 'commission_summary':
      return {
        ...baseData,
        commissions: {
          totalAmount: Math.floor(Math.random() * 100000) + 10000,
          transactionCount: Math.floor(Math.random() * 50) + 5,
          averageCommission: Math.floor(Math.random() * 5000) + 1000,
          topPerformers: ['Agent A', 'Agent B', 'Agent C']
        }
      }
    
    case 'performance':
      return {
        ...baseData,
        performance: {
          teamMetrics: {
            totalSales: Math.floor(Math.random() * 50) + 10,
            conversionRate: Math.random() * 30 + 10,
            customerSatisfaction: Math.random() * 30 + 70
          },
          individualMetrics: [
            { agent: 'Agent A', sales: Math.floor(Math.random() * 20) + 5 },
            { agent: 'Agent B', sales: Math.floor(Math.random() * 20) + 5 },
            { agent: 'Agent C', sales: Math.floor(Math.random() * 20) + 5 }
          ]
        }
      }
    
    default:
      return baseData
  }
}

export async function seedReports() {
  try {
    await connectDB()
    
    // Supprimer les rapports existants
    await Report.deleteMany({})
    console.log('🗑️ Rapports existants supprimés')
    
    // Récupérer des utilisateurs
    const users = await User.find().limit(10)
    
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé. Veuillez d\'abord créer des utilisateurs.')
      return
    }
    
    // Créer les rapports
    const reports = []
    
    for (let i = 0; i < 30; i++) {
      const template = reportTemplates[i % reportTemplates.length]
      const user = users[i % users.length]
      const status = getRandomStatus()
      
      // Dates réalistes
      const createdAt = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) // Derniers 90 jours
      
      let generatedAt: Date | undefined
      let completedAt: Date | undefined
      
      if (status === 'completed' || status === 'archived') {
        generatedAt = new Date(createdAt.getTime() + Math.random() * 60 * 60 * 1000) // 1h max pour générer
        completedAt = new Date(generatedAt.getTime() + Math.random() * 30 * 60 * 1000) // 30 min max pour finaliser
      } else if (status === 'generating') {
        generatedAt = new Date(createdAt.getTime() + Math.random() * 30 * 60 * 1000)
      }
      
      const report = {
        user: user._id,
        title: `${template.title} - ${new Date(createdAt).toLocaleDateString('fr-FR')}`,
        type: template.type,
        description: template.description,
        parameters: template.parameters,
        status,
        generatedAt,
        completedAt,
        data: status === 'completed' || status === 'archived' 
          ? generateReportData(template.type) 
          : undefined,
        fileUrl: status === 'completed' || status === 'archived'
          ? `/reports/${template.type}-${Date.now()}.pdf`
          : undefined,
        fileSize: status === 'completed' || status === 'archived'
          ? Math.floor(Math.random() * 5000000) + 500000 // 500KB à 5.5MB
          : undefined,
        isPublic: Math.random() > 0.7, // 30% des rapports sont publics
        tags: [
          template.type,
          ...(template.parameters.location?.city ? [template.parameters.location.city.toLowerCase()] : []),
          ...(Math.random() > 0.5 ? ['quarterly'] : []),
          ...(Math.random() > 0.7 ? ['priority'] : [])
        ],
        metadata: {
          version: '1.0',
          format: 'pdf',
          language: 'fr',
          generationTime: status === 'completed' ? Math.floor(Math.random() * 300) + 30 : undefined // 30s à 5min
        }
      }
      
      reports.push(report)
    }
    
    await Report.insertMany(reports)
    console.log(`✅ ${reports.length} rapports créés avec succès`)
    
    // Afficher un résumé
    const count = await Report.countDocuments()
    console.log(`📊 Total des rapports en base: ${count}`)
    
    // Statistiques par type
    const typeStats = await Report.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
    
    console.log('📈 Rapports par type:')
    typeStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} rapports`)
    })
    
    // Statistiques par statut
    const statusStats = await Report.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
    
    console.log('📊 Rapports par statut:')
    statusStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} rapports`)
    })
    
    // Rapports publics
    const publicReports = await Report.countDocuments({ isPublic: true })
    console.log(`🌐 Rapports publics: ${publicReports}`)
    
    // Taille totale des fichiers
    const totalSize = await Report.aggregate([
      { $match: { fileSize: { $exists: true } } },
      { $group: { _id: null, total: { $sum: '$fileSize' } } }
    ])
    
    if (totalSize.length > 0) {
      const sizeInMB = Math.round(totalSize[0].total / 1024 / 1024)
      console.log(`💾 Taille totale des fichiers: ${sizeInMB} MB`)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding des rapports:', error)
    throw error
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedReports()
    .then(() => {
      console.log('🎉 Seeding des rapports terminé')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error)
      process.exit(1)
    })
}