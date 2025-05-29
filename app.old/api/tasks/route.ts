import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

// Interface pour une tâche
interface Task {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: string
  createdAt: string
  updatedAt: string
  assignedTo?: string
  propertyId?: string
  propertyTitle?: string
  category: 'viewing' | 'follow-up' | 'documentation' | 'negotiation' | 'inspection' | 'other'
  tags: string[]
  notes?: string
  reminder?: {
    enabled: boolean
    date: string
    sent: boolean
  }
  userId: string
}

// Données d'exemple pour le développement
let mockTasks: Task[] = [
  {
    id: '1',
    title: 'Visite de propriété - Bureau moderne',
    description: 'Organiser une visite pour le client intéressé par le bureau moderne avec terrasse',
    status: 'pending',
    priority: 'high',
    dueDate: '2025-05-30T10:00:00.000Z',
    createdAt: '2025-05-28T08:00:00.000Z',
    updatedAt: '2025-05-28T08:00:00.000Z',
    propertyId: 'bureau-moderne-avec-terrasse-6834ba26512d2c9b817c3667',
    propertyTitle: 'Bureau moderne avec terrasse',
    category: 'viewing',
    tags: ['visite', 'client-prioritaire'],
    notes: 'Client très intéressé, prévoir 1h pour la visite complète',
    reminder: {
      enabled: true,
      date: '2025-05-30T09:30:00.000Z',
      sent: false
    },
    userId: 'user1'
  },
  {
    id: '2',
    title: 'Finaliser le dossier de vente',
    description: 'Préparer tous les documents nécessaires pour la vente de l\'appartement centre-ville',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2025-06-02T17:00:00.000Z',
    createdAt: '2025-05-27T14:00:00.000Z',
    updatedAt: '2025-05-28T10:00:00.000Z',
    category: 'documentation',
    tags: ['documents', 'vente'],
    notes: 'Manque encore le certificat énergétique',
    userId: 'user1'
  },
  {
    id: '3',
    title: 'Négociation avec vendeur',
    description: 'Reprendre les négociations sur le prix de la maison familiale',
    status: 'pending',
    priority: 'urgent',
    dueDate: '2025-05-29T14:00:00.000Z',
    createdAt: '2025-05-26T16:00:00.000Z',
    updatedAt: '2025-05-28T09:00:00.000Z',
    category: 'negotiation',
    tags: ['négociation', 'prix'],
    notes: 'Le vendeur est ouvert à une réduction de 5%',
    userId: 'user1'
  },
  {
    id: '4',
    title: 'Inspection technique',
    description: 'Planifier l\'inspection technique pour l\'entrepôt industriel',
    status: 'completed',
    priority: 'high',
    dueDate: '2025-05-25T11:00:00.000Z',
    createdAt: '2025-05-20T09:00:00.000Z',
    updatedAt: '2025-05-25T16:00:00.000Z',
    category: 'inspection',
    tags: ['inspection', 'technique'],
    notes: 'Inspection réalisée avec succès, rapport disponible',
    userId: 'user1'
  },
  {
    id: '5',
    title: 'Suivi client - Famille Dupont',
    description: 'Appeler la famille Dupont pour faire le point sur leur recherche',
    status: 'pending',
    priority: 'low',
    dueDate: '2025-06-01T15:00:00.000Z',
    createdAt: '2025-05-28T11:00:00.000Z',
    updatedAt: '2025-05-28T11:00:00.000Z',
    category: 'follow-up',
    tags: ['suivi', 'client'],
    userId: 'user1'
  }
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    
    // Filtrer les tâches par utilisateur
    let userTasks = mockTasks.filter(task => task.userId === session.user.id || task.userId === 'user1')
    
    // Appliquer les filtres
    const status = searchParams.get('status')?.split(',')
    if (status?.length) {
      userTasks = userTasks.filter(task => status.includes(task.status))
    }

    const priority = searchParams.get('priority')?.split(',')
    if (priority?.length) {
      userTasks = userTasks.filter(task => priority.includes(task.priority))
    }

    const category = searchParams.get('category')?.split(',')
    if (category?.length) {
      userTasks = userTasks.filter(task => category.includes(task.category))
    }

    const search = searchParams.get('search')
    if (search) {
      const searchLower = search.toLowerCase()
      userTasks = userTasks.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    const propertyId = searchParams.get('propertyId')
    if (propertyId) {
      userTasks = userTasks.filter(task => task.propertyId === propertyId)
    }

    const dueDateFrom = searchParams.get('dueDateFrom')
    const dueDateTo = searchParams.get('dueDateTo')
    if (dueDateFrom || dueDateTo) {
      userTasks = userTasks.filter(task => {
        if (!task.dueDate) return false
        const taskDate = new Date(task.dueDate)
        if (dueDateFrom && taskDate < new Date(dueDateFrom)) return false
        if (dueDateTo && taskDate > new Date(dueDateTo)) return false
        return true
      })
    }

    // Trier par date d'échéance puis par priorité
    userTasks.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
      
      if (a.dueDate && b.dueDate) {
        const dateCompare = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        if (dateCompare !== 0) return dateCompare
      }
      
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })

    return NextResponse.json({
      tasks: userTasks,
      total: userTasks.length
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: session.user.id || 'user1',
      ...body
    }

    mockTasks.unshift(newTask)

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
