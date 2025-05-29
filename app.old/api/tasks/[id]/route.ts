import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

// Interface pour une tâche (répétée pour la cohérence)
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

// Import des données mockées (en production, ceci viendrait de la base de données)
// Pour le développement, nous utilisons une variable globale
declare global {
  var mockTasks: Task[] | undefined
}

function getMockTasks(): Task[] {
  if (!global.mockTasks) {
    global.mockTasks = [
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
      }
    ]
  }
  return global.mockTasks
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tasks = getMockTasks()
    const task = tasks.find(t => t.id === params.id && (t.userId === session.user.id || t.userId === 'user1'))

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const tasks = getMockTasks()
    const taskIndex = tasks.findIndex(t => t.id === params.id && (t.userId === session.user.id || t.userId === 'user1'))

    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const updatedTask = {
      ...tasks[taskIndex],
      ...body,
      updatedAt: new Date().toISOString()
    }

    tasks[taskIndex] = updatedTask
    global.mockTasks = tasks

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tasks = getMockTasks()
    const taskIndex = tasks.findIndex(t => t.id === params.id && (t.userId === session.user.id || t.userId === 'user1'))

    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    tasks.splice(taskIndex, 1)
    global.mockTasks = tasks

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
