'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePermissions } from './use-permissions'
import { toast } from 'sonner'

export interface Task {
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
}

export interface TaskFilters {
  status?: Task['status'][]
  priority?: Task['priority'][]
  category?: Task['category'][]
  dueDate?: {
    from?: string
    to?: string
  }
  propertyId?: string
  search?: string
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TaskFilters>({})
  const { can, limit } = usePermissions()

  const maxTasks = limit('maxTasks')

  const fetchTasks = useCallback(async () => {
    if (!can('canManageTasks')) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (filters.status?.length) {
        params.append('status', filters.status.join(','))
      }
      if (filters.priority?.length) {
        params.append('priority', filters.priority.join(','))
      }
      if (filters.category?.length) {
        params.append('category', filters.category.join(','))
      }
      if (filters.search) {
        params.append('search', filters.search)
      }
      if (filters.propertyId) {
        params.append('propertyId', filters.propertyId)
      }
      if (filters.dueDate?.from) {
        params.append('dueDateFrom', filters.dueDate.from)
      }
      if (filters.dueDate?.to) {
        params.append('dueDateTo', filters.dueDate.to)
      }

      const response = await fetch(`/api/tasks?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch tasks')
      
      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }, [can, filters])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!can('canManageTasks')) {
      throw new Error('Permission denied')
    }

    if (maxTasks && tasks.length >= maxTasks) {
      throw new Error(`Limite de ${maxTasks} tâches atteinte`)
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) throw new Error('Failed to create task')
      
      const newTask = await response.json()
      setTasks(prev => [newTask, ...prev])
      toast.success('Tâche créée avec succès')
      return newTask
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création'
      toast.error(message)
      throw err
    }
  }, [can, maxTasks, tasks.length])

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    if (!can('canManageTasks')) {
      throw new Error('Permission denied')
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error('Failed to update task')
      
      const updatedTask = await response.json()
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updatedTask } : task
      ))
      toast.success('Tâche mise à jour')
      return updatedTask
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
      toast.error(message)
      throw err
    }
  }, [can])

  const deleteTask = useCallback(async (taskId: string) => {
    if (!can('canManageTasks')) {
      throw new Error('Permission denied')
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete task')
      
      setTasks(prev => prev.filter(task => task.id !== taskId))
      toast.success('Tâche supprimée')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression'
      toast.error(message)
      throw err
    }
  }, [can])

  const getTaskStats = useCallback(() => {
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(t => 
        t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
      ).length,
      highPriority: tasks.filter(t => 
        ['high', 'urgent'].includes(t.priority) && t.status !== 'completed'
      ).length,
    }
  }, [tasks])

  const getUpcomingTasks = useCallback((days: number = 7) => {
    const now = new Date()
    const future = new Date()
    future.setDate(now.getDate() + days)

    return tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) >= now && 
      new Date(task.dueDate) <= future &&
      task.status !== 'completed'
    ).sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
  }, [tasks])

  return {
    tasks,
    loading,
    error,
    filters,
    setFilters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats,
    getUpcomingTasks,
    canManageTasks: can('canManageTasks'),
    maxTasks,
  }
}
