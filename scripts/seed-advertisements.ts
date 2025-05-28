import mongoose from 'mongoose'
import Advertisement from '../models/Advertisement'
import User from '../models/User'
import Property from '../models/Property'
import { connectDB } from '../lib/mongodb'

const adTypes = ['banner', 'featured_listing', 'sponsored_search', 'newsletter', 'social_media']
const adTypeWeights = [0.3, 0.25, 0.2, 0.15, 0.1]

const placements = [
  'homepage_hero',
  'search_results_top',
  'search_results_sidebar',
  'property_detail_bottom',
  'newsletter_header',
  'newsletter_footer',
  'social_feed',
  'mobile_banner',
  'category_page_top',
  'footer_banner'
]

const statuses = ['draft', 'active', 'paused', 'completed', 'cancelled']
const statusWeights = [0.1, 0.5, 0.15, 0.2, 0.05]

const targetingCriteria = {
  locations: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
  propertyTypes: ['bureau', 'commercial', 'entrepot', 'terrain', 'hotel', 'industriel'],
  userTypes: ['buyer', 'seller', 'agent', 'investor'],
  budgetRanges: ['0-100000', '100000-300000', '300000-500000', '500000-1000000', '1000000+'],
  interests: ['investment', 'development', 'relocation', 'expansion', 'first_time_buyer']
}

function getRandomAdType(): string {
  const random = Math.random()
  let cumulative = 0
  
  for (let i = 0; i < adTypes.length; i++) {
    cumulative += adTypeWeights[i]
    if (random <= cumulative) {
      return adTypes[i]
    }
  }
  return adTypes[0]
}

function getRandomStatus(): string {
  const random = Math.random()
  let cumulative = 0
  
  for (let i = 0; i < statuses.length; i++) {
    cumulative += statusWeights[i]
    if (random <= cumulative) {
      return statuses[i]
    }
  }
  return statuses[1] // active par défaut
}

function generateAdContent(adType: string, propertyTitle?: string) {
  const templates = {
    banner: {
      title: 'Découvrez nos propriétés exceptionnelles',
      description: 'Plus de 1000 biens immobiliers commerciaux disponibles. Trouvez votre opportunité d\'investissement idéale.',
      callToAction: 'Voir les annonces',
      imageUrl: '/images/ads/banner-commercial.jpg'
    },
    featured_listing: {
      title: `Propriété mise en avant: ${propertyTitle || 'Bureau moderne centre-ville'}`,
      description: 'Emplacement premium, équipements haut de gamme, rentabilité garantie.',
      callToAction: 'Découvrir',
      imageUrl: '/images/ads/featured-property.jpg'
    },
    sponsored_search: {
      title: 'Résultat sponsorisé',
      description: `${propertyTitle || 'Local commercial'} - Opportunité unique d\'investissement`,
      callToAction: 'En savoir plus',
      imageUrl: '/images/ads/sponsored-result.jpg'
    },
    newsletter: {
      title: 'Offre exclusive newsletter',
      description: 'Accédez en avant-première aux meilleures opportunités immobilières.',
      callToAction: 'S\'abonner',
      imageUrl: '/images/ads/newsletter-promo.jpg'
    },
    social_media: {
      title: 'Suivez-nous sur les réseaux',
      description: 'Restez informé des dernières tendances du marché immobilier commercial.',
      callToAction: 'Suivre',
      imageUrl: '/images/ads/social-media.jpg'
    }
  }
  
  return templates[adType as keyof typeof templates] || templates.banner
}

function generateTargeting() {
  return {
    locations: getRandomItems(targetingCriteria.locations, 1, 3),
    propertyTypes: getRandomItems(targetingCriteria.propertyTypes, 1, 2),
    userTypes: getRandomItems(targetingCriteria.userTypes, 1, 2),
    budgetRanges: getRandomItems(targetingCriteria.budgetRanges, 1, 2),
    interests: getRandomItems(targetingCriteria.interests, 1, 3),
    ageRange: {
      min: Math.floor(Math.random() * 20) + 25, // 25-45
      max: Math.floor(Math.random() * 20) + 45  // 45-65
    },
    deviceTypes: getRandomItems(['desktop', 'mobile', 'tablet'], 1, 3),
    timeSlots: getRandomItems(['morning', 'afternoon', 'evening', 'night'], 1, 2)
  }
}

function getRandomItems<T>(array: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function generateBudget() {
  const budgetTypes = ['daily', 'weekly', 'monthly', 'total']
  const budgetType = budgetTypes[Math.floor(Math.random() * budgetTypes.length)]
  
  const baseBudgets = {
    daily: { min: 10, max: 200 },
    weekly: { min: 50, max: 1000 },
    monthly: { min: 200, max: 5000 },
    total: { min: 500, max: 10000 }
  }
  
  const range = baseBudgets[budgetType as keyof typeof baseBudgets]
  const amount = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
  
  return {
    type: budgetType,
    amount,
    currency: 'EUR',
    spent: Math.floor(Math.random() * amount * 0.8), // 0-80% du budget dépensé
    remaining: amount - Math.floor(Math.random() * amount * 0.8)
  }
}

function generatePerformanceMetrics(status: string, startDate: Date) {
  const isActive = status === 'active'
  const daysSinceStart = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  
  // Métriques de base
  const impressions = isActive ? Math.floor(Math.random() * 10000) + 1000 : Math.floor(Math.random() * 5000)
  const clicks = Math.floor(impressions * (Math.random() * 0.05 + 0.01)) // CTR entre 1% et 6%
  const conversions = Math.floor(clicks * (Math.random() * 0.1 + 0.02)) // Taux de conversion entre 2% et 12%
  
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0
  const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0
  const avgCpc = clicks > 0 ? (Math.random() * 2 + 0.5) : 0 // CPC entre 0.5€ et 2.5€
  const totalCost = clicks * avgCpc
  
  return {
    impressions,
    clicks,
    conversions,
    ctr: Math.round(ctr * 100) / 100,
    conversionRate: Math.round(conversionRate * 100) / 100,
    avgCpc: Math.round(avgCpc * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    costPerConversion: conversions > 0 ? Math.round((totalCost / conversions) * 100) / 100 : 0,
    reach: Math.floor(impressions * (Math.random() * 0.3 + 0.7)), // Reach entre 70% et 100% des impressions
    frequency: Math.round((impressions / Math.floor(impressions * (Math.random() * 0.3 + 0.7))) * 100) / 100
  }
}

function generateSchedule() {
  const now = new Date()
  const startDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Commencé dans les 30 derniers jours
  const duration = Math.floor(Math.random() * 60) + 7 // Durée entre 7 et 67 jours
  const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000)
  
  return {
    startDate,
    endDate,
    timezone: 'Europe/Paris',
    dayOfWeek: getRandomItems(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], 1, 7),
    timeSlots: [
      {
        start: '09:00',
        end: '18:00'
      },
      ...(Math.random() > 0.5 ? [{
        start: '19:00',
        end: '22:00'
      }] : [])
    ]
  }
}

export async function seedAdvertisements() {
  try {
    await connectDB()
    
    // Supprimer les publicités existantes
    await Advertisement.deleteMany({})
    console.log('🗑️ Publicités existantes supprimées')
    
    // Récupérer des utilisateurs et des propriétés
    const users = await User.find().limit(15)
    const properties = await Property.find().limit(30)
    
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé. Veuillez d\'abord créer des utilisateurs.')
      return
    }
    
    // Créer les publicités
    const advertisements = []
    const adCount = 50 // Nombre total de publicités à créer
    
    for (let i = 0; i < adCount; i++) {
      const advertiser = users[Math.floor(Math.random() * users.length)]
      const property = properties.length > 0 && Math.random() > 0.3 
        ? properties[Math.floor(Math.random() * properties.length)] 
        : null
      
      const adType = getRandomAdType()
      const status = getRandomStatus()
      const content = generateAdContent(adType, property?.title)
      const targeting = generateTargeting()
      const budget = generateBudget()
      const schedule = generateSchedule()
      const performance = generatePerformanceMetrics(status, schedule.startDate)
      
      const placement = placements[Math.floor(Math.random() * placements.length)]
      
      const advertisement = {
        advertiser: advertiser._id,
        title: content.title,
        description: content.description,
        adType,
        status,
        targetProperty: property?._id,
        content: {
          headline: content.title,
          description: content.description,
          callToAction: content.callToAction,
          imageUrl: content.imageUrl,
          videoUrl: Math.random() > 0.8 ? '/videos/ad-demo.mp4' : undefined,
          landingPageUrl: property 
            ? `/properties/${property._id}` 
            : '/search?featured=true',
          additionalImages: Math.random() > 0.7 ? [
            '/images/ads/gallery-1.jpg',
            '/images/ads/gallery-2.jpg'
          ] : []
        },
        targeting,
        budget,
        schedule,
        placement: {
          position: placement,
          priority: Math.floor(Math.random() * 10) + 1, // Priorité 1-10
          displayRules: {
            maxImpressionsPerUser: Math.floor(Math.random() * 10) + 3, // 3-12 impressions max par utilisateur
            minTimeBetweenShows: Math.floor(Math.random() * 60) + 30, // 30-90 minutes entre les affichages
            excludeCompetitors: Math.random() > 0.5
          }
        },
        performance,
        analytics: {
          trackingPixels: [
            `https://analytics.loopnet.com/pixel/${Date.now()}_${Math.floor(Math.random() * 10000)}`
          ],
          utmParameters: {
            source: 'loopnet',
            medium: adType,
            campaign: `campaign_${i + 1}`,
            content: placement
          },
          conversionGoals: [
            {
              name: 'property_view',
              value: 1,
              completed: performance.conversions
            },
            {
              name: 'contact_form',
              value: 5,
              completed: Math.floor(performance.conversions * 0.3)
            },
            {
              name: 'phone_call',
              value: 10,
              completed: Math.floor(performance.conversions * 0.1)
            }
          ]
        },
        approvalStatus: {
          status: Math.random() > 0.1 ? 'approved' : Math.random() > 0.5 ? 'pending' : 'rejected',
          reviewedBy: Math.random() > 0.3 ? users[0]._id : undefined,
          reviewedAt: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
          comments: Math.random() > 0.7 ? 'Publicité conforme aux guidelines' : undefined
        },
        createdAt: schedule.startDate,
        updatedAt: new Date(schedule.startDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)
      }
      
      advertisements.push(advertisement)
    }
    
    await Advertisement.insertMany(advertisements)
    console.log(`✅ ${advertisements.length} publicités créées avec succès`)
    
    // Afficher un résumé
    const count = await Advertisement.countDocuments()
    console.log(`📊 Total des publicités en base: ${count}`)
    
    // Statistiques par type
    const typeStats = await Advertisement.aggregate([
      {
        $group: {
          _id: '$adType',
          count: { $sum: 1 },
          totalBudget: { $sum: '$budget.amount' },
          totalSpent: { $sum: '$budget.spent' }
        }
      },
      { $sort: { count: -1 } }
    ])
    
    console.log('📈 Statistiques par type:')
    typeStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} publicités (Budget: ${stat.totalBudget.toLocaleString('fr-FR')}€, Dépensé: ${stat.totalSpent.toLocaleString('fr-FR')}€)`)
    })
    
    // Statistiques par statut
    const statusStats = await Advertisement.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ])
    
    console.log('🎯 Statistiques par statut:')
    statusStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} publicités`)
    })
    
    // Performance globale
    const performanceStats = await Advertisement.aggregate([
      {
        $group: {
          _id: null,
          totalImpressions: { $sum: '$performance.impressions' },
          totalClicks: { $sum: '$performance.clicks' },
          totalConversions: { $sum: '$performance.conversions' },
          totalCost: { $sum: '$performance.totalCost' },
          avgCtr: { $avg: '$performance.ctr' },
          avgConversionRate: { $avg: '$performance.conversionRate' }
        }
      }
    ])
    
    if (performanceStats.length > 0) {
      const stats = performanceStats[0]
      console.log('📊 Performance globale:')
      console.log(`   Impressions totales: ${stats.totalImpressions.toLocaleString('fr-FR')}`)
      console.log(`   Clics totaux: ${stats.totalClicks.toLocaleString('fr-FR')}`)
      console.log(`   Conversions totales: ${stats.totalConversions.toLocaleString('fr-FR')}`)
      console.log(`   Coût total: ${Math.round(stats.totalCost).toLocaleString('fr-FR')}€`)
      console.log(`   CTR moyen: ${Math.round(stats.avgCtr * 100) / 100}%`)
      console.log(`   Taux de conversion moyen: ${Math.round(stats.avgConversionRate * 100) / 100}%`)
    }
    
    // Placements les plus utilisés
    const placementStats = await Advertisement.aggregate([
      {
        $group: {
          _id: '$placement.position',
          count: { $sum: 1 },
          totalImpressions: { $sum: '$performance.impressions' }
        }
      },
      { $sort: { count: -1 } }
    ])
    
    console.log('📍 Placements les plus utilisés:')
    placementStats.slice(0, 5).forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} publicités (${stat.totalImpressions.toLocaleString('fr-FR')} impressions)`)
    })
    
    // Budget total et dépenses
    const budgetStats = await Advertisement.aggregate([
      {
        $group: {
          _id: null,
          totalBudget: { $sum: '$budget.amount' },
          totalSpent: { $sum: '$budget.spent' },
          totalRemaining: { $sum: '$budget.remaining' }
        }
      }
    ])
    
    if (budgetStats.length > 0) {
      const stats = budgetStats[0]
      const spentPercentage = (stats.totalSpent / stats.totalBudget * 100).toFixed(1)
      console.log('💰 Budget global:')
      console.log(`   Budget total: ${stats.totalBudget.toLocaleString('fr-FR')}€`)
      console.log(`   Dépensé: ${stats.totalSpent.toLocaleString('fr-FR')}€ (${spentPercentage}%)`)
      console.log(`   Restant: ${stats.totalRemaining.toLocaleString('fr-FR')}€`)
    }
    
    // Publicités actives
    const activeAds = await Advertisement.countDocuments({ status: 'active' })
    console.log(`🟢 Publicités actives: ${activeAds}`)
    
    // Publicités en attente d'approbation
    const pendingApproval = await Advertisement.countDocuments({
      'approvalStatus.status': 'pending'
    })
    console.log(`⏳ En attente d'approbation: ${pendingApproval}`)
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding des publicités:', error)
    throw error
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedAdvertisements()
    .then(() => {
      console.log('🎉 Seeding des publicités terminé')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error)
      process.exit(1)
    })
}