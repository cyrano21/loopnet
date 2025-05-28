import mongoose from 'mongoose'
import Commission from '../models/Commission'
import User from '../models/User'
import Property from '../models/Property'
import { connectDB } from '../lib/mongodb'

const commissionTemplates = [
  {
    transactionType: 'sale',
    commissionRate: 0.05, // 5%
    status: 'confirmed',
    paymentStatus: 'paid',
    description: 'Vente bureau centre-ville Paris'
  },
  {
    transactionType: 'rent',
    commissionRate: 0.08, // 8%
    status: 'pending',
    paymentStatus: 'unpaid',
    description: 'Location local commercial Lyon'
  },
  {
    transactionType: 'lease',
    commissionRate: 0.06, // 6%
    status: 'confirmed',
    paymentStatus: 'partial',
    description: 'Bail commercial longue durée'
  },
  {
    transactionType: 'sale',
    commissionRate: 0.04, // 4%
    status: 'paid',
    paymentStatus: 'paid',
    description: 'Vente entrepôt logistique'
  },
  {
    transactionType: 'rent',
    commissionRate: 0.10, // 10%
    status: 'disputed',
    paymentStatus: 'unpaid',
    description: 'Location bureaux standing'
  },
  {
    transactionType: 'sale',
    commissionRate: 0.03, // 3%
    status: 'confirmed',
    paymentStatus: 'paid',
    description: 'Vente terrain constructible'
  },
  {
    transactionType: 'lease',
    commissionRate: 0.07, // 7%
    status: 'pending',
    paymentStatus: 'unpaid',
    description: 'Bail emphytéotique'
  },
  {
    transactionType: 'rent',
    commissionRate: 0.09, // 9%
    status: 'confirmed',
    paymentStatus: 'paid',
    description: 'Location hôtel restaurant'
  }
]

const paymentMethods = ['virement', 'chèque', 'espèces', 'carte_bancaire']

export async function seedCommissions() {
  try {
    await connectDB()
    
    // Supprimer les commissions existantes
    await Commission.deleteMany({})
    console.log('🗑️ Commissions existantes supprimées')
    
    // Récupérer des agents et des propriétés
    const agents = await User.find({ role: 'agent' }).limit(10)
    const allUsers = await User.find().limit(20)
    const properties = await Property.find().limit(15)
    
    if (agents.length === 0) {
      console.log('❌ Aucun agent trouvé. Utilisation des utilisateurs génériques.')
    }
    
    if (properties.length === 0) {
      console.log('❌ Aucune propriété trouvée. Veuillez d\'abord créer des propriétés.')
      return
    }
    
    if (allUsers.length === 0) {
      console.log('❌ Aucun utilisateur trouvé. Veuillez d\'abord créer des utilisateurs.')
      return
    }
    
    // Créer les commissions
    const commissions = []
    
    for (let i = 0; i < 25; i++) {
      const template = commissionTemplates[i % commissionTemplates.length]
      const agent = agents.length > 0 ? agents[i % agents.length] : allUsers[i % allUsers.length]
      const property = properties[i % properties.length]
      const client = allUsers[Math.floor(Math.random() * allUsers.length)]
      
      // Générer un montant de transaction réaliste
      const transactionAmount = template.transactionType === 'sale' 
        ? Math.floor(Math.random() * 2000000) + 100000 // 100k à 2.1M pour vente
        : Math.floor(Math.random() * 15000) + 1000 // 1k à 16k pour location/bail
      
      const commissionAmount = transactionAmount * template.commissionRate
      
      // Dates réalistes
      const contractDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
      const closingDate = template.status === 'paid' || template.status === 'confirmed'
        ? new Date(contractDate.getTime() + Math.random() * 90 * 24 * 60 * 60 * 1000)
        : undefined
      
      const paymentDate = template.paymentStatus === 'paid'
        ? new Date((closingDate || contractDate).getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000)
        : undefined
      
      const commission = {
        agent: agent._id,
        property: property._id,
        client: client._id,
        transactionType: template.transactionType,
        transactionAmount,
        commissionRate: template.commissionRate,
        commissionAmount,
        status: template.status,
        paymentStatus: template.paymentStatus,
        paymentDate,
        paymentMethod: paymentDate ? paymentMethods[Math.floor(Math.random() * paymentMethods.length)] : undefined,
        contractDate,
        closingDate,
        description: template.description,
        documents: Math.random() > 0.5 ? [
          {
            name: 'Contrat de vente.pdf',
            url: '/documents/contrat-vente.pdf',
            type: 'contract'
          },
          {
            name: 'Justificatif paiement.pdf',
            url: '/documents/justificatif-paiement.pdf',
            type: 'payment'
          }
        ] : []
      }
      
      commissions.push(commission)
    }
    
    await Commission.insertMany(commissions)
    console.log(`✅ ${commissions.length} commissions créées avec succès`)
    
    // Afficher un résumé
    const count = await Commission.countDocuments()
    const totalAmount = await Commission.aggregate([
      { $group: { _id: null, total: { $sum: '$commissionAmount' } } }
    ])
    
    console.log(`📊 Total des commissions en base: ${count}`)
    console.log(`💰 Montant total des commissions: ${Math.round(totalAmount[0]?.total || 0).toLocaleString('fr-FR')} €`)
    
    // Statistiques par statut
    const statusStats = await Commission.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$commissionAmount' } } },
      { $sort: { count: -1 } }
    ])
    
    console.log('📈 Commissions par statut:')
    statusStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} commissions (${Math.round(stat.total).toLocaleString('fr-FR')} €)`)
    })
    
    // Top agents
    const agentStats = await Commission.aggregate([
      { $group: { _id: '$agent', count: { $sum: 1 }, total: { $sum: '$commissionAmount' } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'agent' } },
      { $unwind: '$agent' },
      { $project: { agentName: '$agent.name', commissionCount: '$count', totalEarnings: '$total' } },
      { $sort: { totalEarnings: -1 } },
      { $limit: 5 }
    ])
    
    console.log('🏆 Top 5 agents par commissions:')
    agentStats.forEach((stat, index) => {
      console.log(`   ${index + 1}. ${stat.agentName}: ${stat.commissionCount} commissions (${Math.round(stat.totalEarnings).toLocaleString('fr-FR')} €)`)
    })
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding des commissions:', error)
    throw error
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedCommissions()
    .then(() => {
      console.log('🎉 Seeding des commissions terminé')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error)
      process.exit(1)
    })
}