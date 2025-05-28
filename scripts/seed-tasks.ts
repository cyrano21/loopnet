import mongoose from 'mongoose'
import Task from '../models/Task'
import User from '../models/User'
import Property from '../models/Property'
import { connectDB } from '../lib/mongodb'

const taskTemplates = [
  {
    title: 'Appeler le client pour rendez-vous',
    description: 'Prendre contact avec M. Dupont pour organiser la visite du bureau',
    category: 'follow_up',
    priority: 'high'
  },
  {
    title: 'Préparer dossier de présentation',
    description: 'Créer le dossier commercial pour la propriété commerciale',
    category: 'documentation',
    priority: 'medium'
  },
  {
    title: 'Visite propriété avec client',
    description: 'Rendez-vous à 14h pour visite de l\'entrepôt',
    category: 'viewing',
    priority: 'high'
  },
  {
    title: 'Mise à jour annonce en ligne',
    description: 'Actualiser les photos et la description sur le site',
    category: 'marketing',
    priority: 'medium'
  },
  {
    title: 'Finaliser contrat de location',
    description: 'Réviser les clauses et envoyer au client pour signature',
    category: 'administrative',
    priority: 'urgent'
  },
  {
    title: 'Étude de marché secteur',
    description: 'Analyser les prix du marché pour le quartier',
    category: 'other',
    priority: 'low'
  },
  {
    title: 'Relance client prospect',
    description: 'Rappeler Mme Martin concernant sa recherche de local',
    category: 'follow_up',
    priority: 'medium'
  },
  {
    title: 'Organiser séance photo',
    description: 'Planifier la prise de vues professionnelles',
    category: 'marketing',
    priority: 'medium'
  },
  {
    title: 'Vérification documents légaux',
    description: 'Contrôler la conformité des documents propriété',
    category: 'administrative',
    priority: 'high'
  },
  {
    title: 'Négociation prix avec propriétaire',
    description: 'Discuter des conditions tarifaires',
    category: 'other',
    priority: 'high'
  },
  {
    title: 'Préparer rapport mensuel',
    description: 'Compiler les statistiques du mois',
    category: 'administrative',
    priority: 'low'
  },
  {
    title: 'Formation nouveaux outils',
    description: 'Participer à la formation sur le nouveau CRM',
    category: 'other',
    priority: 'medium'
  }
]

const statuses = ['todo', 'in_progress', 'completed', 'cancelled']
const statusWeights = [0.4, 0.3, 0.25, 0.05] // Probabilités pour chaque statut

function getRandomStatus(): string {
  const random = Math.random()
  let cumulative = 0
  
  for (let i = 0; i < statuses.length; i++) {
    cumulative += statusWeights[i]
    if (random <= cumulative) {
      return statuses[i]
    }
  }
  return statuses[0]
}

export async function seedTasks() {
  try {
    await connectDB()
    
    // Supprimer les tâches existantes
    await Task.deleteMany({})
    console.log('🗑️ Tâches existantes supprimées')
    
    // Récupérer des utilisateurs et des propriétés
    const users = await User.find().limit(15)
    const properties = await Property.find().limit(20)
    
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé. Veuillez d\'abord créer des utilisateurs.')
      return
    }
    
    // Créer les tâches
    const tasks = []
    
    for (let i = 0; i < 50; i++) {
      const template = taskTemplates[i % taskTemplates.length]
      const user = users[i % users.length]
      const status = getRandomStatus()
      
      // Dates réalistes
      const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Derniers 30 jours
      
      let dueDate: Date | undefined
      let completedAt: Date | undefined
      
      // Date d'échéance basée sur la priorité
      const daysFromNow = template.priority === 'urgent' ? 1 : 
                         template.priority === 'high' ? 3 :
                         template.priority === 'medium' ? 7 : 14
      
      dueDate = new Date(createdAt.getTime() + daysFromNow * 24 * 60 * 60 * 1000)
      
      // Date de completion si la tâche est terminée
      if (status === 'completed') {
        completedAt = new Date(createdAt.getTime() + Math.random() * (dueDate.getTime() - createdAt.getTime()))
      }
      
      const task = {
        user: user._id,
        title: template.title,
        description: template.description,
        category: template.category,
        priority: template.priority,
        status,
        dueDate,
        completedAt,
        relatedProperty: properties.length > 0 && Math.random() > 0.3 
          ? properties[Math.floor(Math.random() * properties.length)]._id 
          : undefined,
        tags: [
          template.category,
          template.priority,
          ...(Math.random() > 0.5 ? ['client'] : []),
          ...(Math.random() > 0.7 ? ['urgent'] : []),
          ...(Math.random() > 0.8 ? ['important'] : [])
        ],
        estimatedDuration: Math.floor(Math.random() * 240) + 30, // 30 min à 4h30
        actualDuration: status === 'completed' 
          ? Math.floor(Math.random() * 300) + 15 // 15 min à 5h15
          : undefined,
        notes: Math.random() > 0.6 ? [
          {
            content: 'Note ajoutée lors de la création',
            createdAt: createdAt
          },
          ...(Math.random() > 0.7 ? [{
            content: 'Mise à jour du statut',
            createdAt: new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000)
          }] : [])
        ] : [],
        reminders: template.priority === 'urgent' || template.priority === 'high' ? [
          {
            type: 'email',
            scheduledFor: new Date(dueDate.getTime() - 24 * 60 * 60 * 1000), // 1 jour avant
            sent: status === 'completed' || Math.random() > 0.5
          },
          {
            type: 'push',
            scheduledFor: new Date(dueDate.getTime() - 2 * 60 * 60 * 1000), // 2h avant
            sent: status === 'completed' || Math.random() > 0.3
          }
        ] : []
      }
      
      tasks.push(task)
    }
    
    await Task.insertMany(tasks)
    console.log(`✅ ${tasks.length} tâches créées avec succès`)
    
    // Afficher un résumé
    const count = await Task.countDocuments()
    console.log(`📊 Total des tâches en base: ${count}`)
    
    // Statistiques par statut
    const statusStats = await Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
    
    console.log('📈 Tâches par statut:')
    statusStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} tâches`)
    })
    
    // Statistiques par priorité
    const priorityStats = await Task.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
    
    console.log('🎯 Tâches par priorité:')
    priorityStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} tâches`)
    })
    
    // Statistiques par catégorie
    const categoryStats = await Task.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
    
    console.log('📂 Tâches par catégorie:')
    categoryStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} tâches`)
    })
    
    // Tâches en retard
    const overdueTasks = await Task.countDocuments({
      status: { $in: ['todo', 'in_progress'] },
      dueDate: { $lt: new Date() }
    })
    
    console.log(`⚠️ Tâches en retard: ${overdueTasks}`)
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding des tâches:', error)
    throw error
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedTasks()
    .then(() => {
      console.log('🎉 Seeding des tâches terminé')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error)
      process.exit(1)
    })
}