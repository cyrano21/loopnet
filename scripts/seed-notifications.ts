import mongoose from 'mongoose'
import Notification from '../models/Notification'
import User from '../models/User'
import Property from '../models/Property'
import { connectDB } from '../lib/mongodb'

const notificationTypes = [
  'property_alert',
  'price_change',
  'new_listing',
  'saved_search_match',
  'inquiry_received',
  'appointment_reminder',
  'document_ready',
  'system_update',
  'marketing_campaign',
  'commission_update',
  'task_reminder',
  'report_ready'
]

const priorities = ['low', 'medium', 'high', 'urgent']
const priorityWeights = [0.4, 0.35, 0.2, 0.05] // 40% low, 35% medium, 20% high, 5% urgent

const channels = ['email', 'sms', 'push', 'in_app']
const channelWeights = [0.8, 0.3, 0.6, 0.9] // Probabilités pour chaque canal

function getRandomPriority(): string {
  const random = Math.random()
  let cumulative = 0
  
  for (let i = 0; i < priorities.length; i++) {
    cumulative += priorityWeights[i]
    if (random <= cumulative) {
      return priorities[i]
    }
  }
  return priorities[0]
}

function getRandomChannels(): string[] {
  const selectedChannels = []
  
  for (let i = 0; i < channels.length; i++) {
    if (Math.random() <= channelWeights[i]) {
      selectedChannels.push(channels[i])
    }
  }
  
  // Assurer qu'au moins un canal est sélectionné
  if (selectedChannels.length === 0) {
    selectedChannels.push('in_app')
  }
  
  return selectedChannels
}

function generateNotificationContent(type: string, propertyTitle?: string) {
  const templates = {
    property_alert: {
      title: 'Nouvelle propriété correspondant à vos critères',
      message: `Une nouvelle propriété "${propertyTitle || 'Bureau moderne'}" correspond à vos critères de recherche.`,
      actionText: 'Voir la propriété',
      actionUrl: '/properties/123'
    },
    price_change: {
      title: 'Changement de prix détecté',
      message: `Le prix de "${propertyTitle || 'Bureau centre-ville'}" a été modifié. Nouvelle estimation disponible.`,
      actionText: 'Voir les détails',
      actionUrl: '/properties/123/price-history'
    },
    new_listing: {
      title: 'Nouvelle annonce publiée',
      message: `Votre annonce "${propertyTitle || 'Local commercial'}" a été publiée avec succès.`,
      actionText: 'Gérer l\'annonce',
      actionUrl: '/dashboard/listings'
    },
    saved_search_match: {
      title: 'Nouvelle correspondance pour votre recherche sauvegardée',
      message: `${Math.floor(Math.random() * 5) + 1} nouvelles propriétés correspondent à votre recherche "Bureaux Paris".`,
      actionText: 'Voir les résultats',
      actionUrl: '/saved-searches/123'
    },
    inquiry_received: {
      title: 'Nouvelle demande d\'information',
      message: `Vous avez reçu une nouvelle demande d\'information pour "${propertyTitle || 'Entrepôt logistique'}".`,
      actionText: 'Répondre',
      actionUrl: '/dashboard/inquiries'
    },
    appointment_reminder: {
      title: 'Rappel de rendez-vous',
      message: `Votre rendez-vous pour la visite de "${propertyTitle || 'Bureau standing'}" est prévu dans 1 heure.`,
      actionText: 'Voir les détails',
      actionUrl: '/dashboard/appointments'
    },
    document_ready: {
      title: 'Document prêt à télécharger',
      message: `Le rapport d\'évaluation pour "${propertyTitle || 'Immeuble de bureaux'}" est maintenant disponible.`,
      actionText: 'Télécharger',
      actionUrl: '/documents/report-123.pdf'
    },
    system_update: {
      title: 'Mise à jour système',
      message: 'De nouvelles fonctionnalités sont disponibles sur la plateforme LoopNet.',
      actionText: 'Découvrir',
      actionUrl: '/updates'
    },
    marketing_campaign: {
      title: 'Nouvelle campagne marketing',
      message: 'Votre campagne publicitaire pour vos annonces a été lancée avec succès.',
      actionText: 'Voir les statistiques',
      actionUrl: '/dashboard/marketing'
    },
    commission_update: {
      title: 'Mise à jour commission',
      message: `Votre commission pour la vente de "${propertyTitle || 'Local commercial'}" a été mise à jour.`,
      actionText: 'Voir les détails',
      actionUrl: '/dashboard/commissions'
    },
    task_reminder: {
      title: 'Rappel de tâche',
      message: 'Vous avez des tâches en attente qui nécessitent votre attention.',
      actionText: 'Voir les tâches',
      actionUrl: '/dashboard/tasks'
    },
    report_ready: {
      title: 'Rapport disponible',
      message: 'Votre rapport d\'analyse de marché mensuel est maintenant disponible.',
      actionText: 'Consulter',
      actionUrl: '/reports/monthly-analysis'
    }
  }
  
  return templates[type as keyof typeof templates] || templates.system_update
}

function generateDeliveryStatus() {
  const statuses = ['pending', 'sent', 'delivered', 'failed', 'read']
  const weights = [0.05, 0.1, 0.7, 0.05, 0.1] // Majorité delivered
  
  const random = Math.random()
  let cumulative = 0
  
  for (let i = 0; i < statuses.length; i++) {
    cumulative += weights[i]
    if (random <= cumulative) {
      return statuses[i]
    }
  }
  return 'delivered'
}

function generateScheduledDate(): Date | null {
  // 20% de chance d'avoir une notification programmée
  if (Math.random() > 0.2) return null
  
  // Programmer entre maintenant et 30 jours dans le futur
  const now = Date.now()
  const futureTime = now + Math.random() * 30 * 24 * 60 * 60 * 1000
  return new Date(futureTime)
}

function generateMetadata(type: string) {
  const baseMetadata = {
    source: 'system',
    campaign_id: Math.random() > 0.7 ? `campaign_${Math.floor(Math.random() * 1000)}` : undefined,
    tracking_id: `track_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    user_agent: 'LoopNet/1.0',
    ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`
  }
  
  // Métadonnées spécifiques par type
  const specificMetadata = {
    property_alert: {
      search_criteria: {
        location: 'Paris',
        property_type: 'bureau',
        price_range: '200000-500000'
      }
    },
    price_change: {
      old_price: Math.floor(Math.random() * 500000) + 100000,
      new_price: Math.floor(Math.random() * 500000) + 100000,
      change_percentage: (Math.random() - 0.5) * 20 // -10% à +10%
    },
    marketing_campaign: {
      campaign_type: 'email_blast',
      target_audience: 'premium_users',
      budget: Math.floor(Math.random() * 5000) + 1000
    }
  }
  
  return {
    ...baseMetadata,
    ...(specificMetadata[type as keyof typeof specificMetadata] || {})
  }
}

export async function seedNotifications() {
  try {
    await connectDB()
    
    // Supprimer les notifications existantes
    await Notification.deleteMany({})
    console.log('🗑️ Notifications existantes supprimées')
    
    // Récupérer des utilisateurs et des propriétés
    const users = await User.find().limit(20)
    const properties = await Property.find().limit(50)
    
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé. Veuillez d\'abord créer des utilisateurs.')
      return
    }
    
    // Créer les notifications
    const notifications = []
    const notificationCount = 150 // Nombre total de notifications à créer
    
    for (let i = 0; i < notificationCount; i++) {
      const user = users[Math.floor(Math.random() * users.length)]
      const property = properties.length > 0 ? properties[Math.floor(Math.random() * properties.length)] : null
      const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]
      const priority = getRandomPriority()
      const channels = getRandomChannels()
      
      const content = generateNotificationContent(type, property?.title)
      const scheduledFor = generateScheduledDate()
      const isScheduled = scheduledFor !== null
      
      // Générer des dates cohérentes
      const createdAt = isScheduled 
        ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Créé dans les 7 derniers jours
        : new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Créé dans les 30 derniers jours
      
      const sentAt = !isScheduled && Math.random() > 0.1 
        ? new Date(createdAt.getTime() + Math.random() * 60 * 60 * 1000) // Envoyé dans l'heure suivant la création
        : null
      
      const readAt = sentAt && Math.random() > 0.4 
        ? new Date(sentAt.getTime() + Math.random() * 24 * 60 * 60 * 1000) // Lu dans les 24h suivant l'envoi
        : null
      
      // Statut de livraison par canal
      const deliveryStatus = {}
      channels.forEach(channel => {
        deliveryStatus[channel] = {
          status: generateDeliveryStatus(),
          timestamp: sentAt || new Date(),
          attempts: Math.floor(Math.random() * 3) + 1,
          error: Math.random() > 0.9 ? 'Temporary delivery failure' : null
        }
      })
      
      const notification = {
        recipient: user._id,
        type,
        priority,
        title: content.title,
        message: content.message,
        channels,
        relatedEntity: property ? {
          entityType: 'Property',
          entityId: property._id,
          entityTitle: property.title
        } : undefined,
        actionButton: {
          text: content.actionText,
          url: content.actionUrl,
          style: priority === 'urgent' ? 'danger' : priority === 'high' ? 'warning' : 'primary'
        },
        scheduledFor,
        isRead: readAt !== null,
        readAt,
        sentAt,
        deliveryStatus,
        preferences: {
          allowEmail: channels.includes('email'),
          allowSMS: channels.includes('sms'),
          allowPush: channels.includes('push'),
          frequency: Math.random() > 0.7 ? 'immediate' : Math.random() > 0.5 ? 'daily' : 'weekly'
        },
        metadata: generateMetadata(type),
        createdAt,
        updatedAt: readAt || sentAt || createdAt
      }
      
      notifications.push(notification)
    }
    
    await Notification.insertMany(notifications)
    console.log(`✅ ${notifications.length} notifications créées avec succès`)
    
    // Afficher un résumé
    const count = await Notification.countDocuments()
    console.log(`📊 Total des notifications en base: ${count}`)
    
    // Statistiques par type
    const typeStats = await Notification.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          unreadCount: {
            $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ])
    
    console.log('📈 Statistiques par type:')
    typeStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} total (${stat.unreadCount} non lues)`)
    })
    
    // Statistiques par priorité
    const priorityStats = await Notification.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ])
    
    console.log('🎯 Statistiques par priorité:')
    priorityStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} notifications`)
    })
    
    // Statistiques de lecture
    const readStats = await Notification.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          read: { $sum: { $cond: [{ $eq: ['$isRead', true] }, 1, 0] } },
          sent: { $sum: { $cond: [{ $ne: ['$sentAt', null] }, 1, 0] } },
          scheduled: { $sum: { $cond: [{ $ne: ['$scheduledFor', null] }, 1, 0] } }
        }
      }
    ])
    
    if (readStats.length > 0) {
      const stats = readStats[0]
      const readRate = (stats.read / stats.total * 100).toFixed(1)
      const sentRate = (stats.sent / stats.total * 100).toFixed(1)
      
      console.log(`📖 Taux de lecture: ${readRate}% (${stats.read}/${stats.total})`)
      console.log(`📤 Taux d'envoi: ${sentRate}% (${stats.sent}/${stats.total})`)
      console.log(`⏰ Notifications programmées: ${stats.scheduled}`)
    }
    
    // Canaux les plus utilisés
    const channelStats = await Notification.aggregate([
      { $unwind: '$channels' },
      {
        $group: {
          _id: '$channels',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ])
    
    console.log('📱 Canaux de notification:')
    channelStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} utilisations`)
    })
    
    // Notifications urgentes non lues
    const urgentUnread = await Notification.countDocuments({
      priority: 'urgent',
      isRead: false
    })
    console.log(`🚨 Notifications urgentes non lues: ${urgentUnread}`)
    
    // Notifications des dernières 24h
    const last24h = await Notification.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    })
    console.log(`🕐 Notifications des dernières 24h: ${last24h}`)
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding des notifications:', error)
    throw error
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedNotifications()
    .then(() => {
      console.log('🎉 Seeding des notifications terminé')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error)
      process.exit(1)
    })
}