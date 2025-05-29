'use client'

import React, { useState, ChangeEvent } from 'react'
import { useTasks, type Task, type TaskFilters } from '@/hooks/use-tasks'
import { usePermissions } from '@/hooks/use-permissions'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  CheckCircle,
  Clock,
  Plus,
  Filter,
  MoreHorizontal,
  Calendar,
  Flag,
  Building,
  Edit,
  Trash2,
  EyeIcon,
  AlertCircle,
} from 'lucide-react'

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800'
}

const categoryLabels = {
  'property-management': 'Gestion immobilière',
  'client-relations': 'Relations client',
  'administration': 'Administration',
  'maintenance': 'Maintenance',
  'legal': 'Juridique',
  'marketing': 'Marketing',
  'finance': 'Finance',
  'other': 'Autre'
}

interface TasksManagerProps {
  className?: string
}

export function TasksManager({ className }: TasksManagerProps) {
  const permissions = usePermissions()
  
  if (!permissions.canManageTasks) {
    return (
      <div className={`p-6 text-center ${className}`}>
        <div className="max-w-md mx-auto">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Gestion des tâches
          </h3>
          <p className="text-gray-500 mb-4">
            Disponible avec les plans Agent
          </p>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Passer au plan Agent
          </button>
        </div>
      </div>
    )
  }

  const {
    tasks,
    isLoading,
    isCreating,
    createTask,
    updateTaskStatus,
    deleteTask
  } = useTasks()

  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    status: [],
    priority: [],
    category: []
  })

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    category: 'other' as Task['category'],
    dueDate: '',
    propertyTitle: '',
    notes: ''
  })

  const resetNewTask = () => {
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: 'other',
      dueDate: '',
      propertyTitle: '',
      notes: ''
    })
  }

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      toast.error('Le titre est requis')
      return
    }

    try {
      await createTask({
        title: newTask.title.trim(),
        description: newTask.description.trim() || undefined,
        priority: newTask.priority,
        category: newTask.category,
        dueDate: newTask.dueDate || undefined,
        propertyTitle: newTask.propertyTitle.trim() || undefined,
        notes: newTask.notes.trim() || undefined,
      })
      
      setIsCreateModalOpen(false)
      resetNewTask()
      toast.success('Tâche créée avec succès')
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error)
      toast.error('Erreur lors de la création de la tâche')
    }
  }

  const handleUpdateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      await updateTaskStatus(taskId, status)
      toast.success('Statut mis à jour')
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return

    try {
      await deleteTask(taskId)
      toast.success('Tâche supprimée')
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !task.description?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }

    if (filters.status && filters.status.length > 0 && !filters.status.includes(task.status)) {
      return false
    }

    if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
      return false
    }

    if (filters.category && filters.category.length > 0 && !filters.category.includes(task.category)) {
      return false
    }

    return true
  })

  const handleInputChange = (field: keyof typeof newTask) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewTask(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSelectChange = (field: keyof typeof newTask) => (value: string) => {
    setNewTask(prev => ({ ...prev, [field]: value }))
  }

  const handleFilterChange = (field: keyof TaskFilters) => (value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value ? [value] : []
    }))
  }

  if (isLoading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <Clock className="h-8 w-8 mx-auto mb-2 animate-spin text-blue-500" />
          <span className="ml-2">Chargement des tâches...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header avec bouton de création */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des tâches</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle tâche
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">En attente</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tasks.filter(t => t.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">En cours</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tasks.filter(t => t.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Terminées</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tasks.filter(t => t.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Urgentes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tasks.filter(t => t.priority === 'urgent').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <Filter className="h-4 w-4 mr-2" />
          <span className="font-medium">Filtres</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Titre ou description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={filters.status?.[0] || ''}
              onChange={(e) => handleFilterChange('status')(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="in-progress">En cours</option>
              <option value="completed">Terminée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
            <select
              value={filters.priority?.[0] || ''}
              onChange={(e) => handleFilterChange('priority')(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes les priorités</option>
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              value={filters.category?.[0] || ''}
              onChange={(e) => handleFilterChange('category')(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes les catégories</option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune tâche trouvée
            </h3>
            <p className="text-gray-500 mb-4">
              Commencez par créer votre première tâche
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer une tâche
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                      <Flag className="h-3 w-3 mr-1" />
                      {task.priority === 'low' ? 'Faible' : 
                       task.priority === 'medium' ? 'Moyenne' :
                       task.priority === 'high' ? 'Haute' : 'Urgente'}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                      {task.status === 'pending' ? 'En attente' :
                       task.status === 'in-progress' ? 'En cours' :
                       task.status === 'completed' ? 'Terminée' : 'Annulée'}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-gray-600 mb-3">{task.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {task.dueDate && (
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3" />
                        <span className="ml-1">
                          {format(new Date(task.dueDate), 'dd MMM yyyy', { locale: fr })}
                        </span>
                      </div>
                    )}
                    
                    {task.propertyTitle && (
                      <div className="flex items-center">
                        <Building className="h-3 w-3" />
                        <span className="ml-1">{task.propertyTitle}</span>
                      </div>
                    )}

                    <span className="text-xs">
                      {categoryLabels[task.category]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                  
                  <div className="relative">
                    <button className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de création */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Créer une nouvelle tâche
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={handleInputChange('title')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Titre de la tâche"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newTask.description}
                      onChange={handleInputChange('description')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Description de la tâche"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                      <select
                        value={newTask.priority}
                        onChange={handleInputChange('priority')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="low">Faible</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Haute</option>
                        <option value="urgent">Urgente</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                      <select
                        value={newTask.category}
                        onChange={handleInputChange('category')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        {Object.entries(categoryLabels).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={handleInputChange('dueDate')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Propriété liée</label>
                    <input
                      type="text"
                      value={newTask.propertyTitle}
                      onChange={handleInputChange('propertyTitle')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nom de la propriété"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={newTask.notes}
                      onChange={handleInputChange('notes')}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Notes additionnelles"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
                
                <button
                  onClick={handleCreateTask}
                  disabled={isCreating || !newTask.title.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Création...' : 'Créer la tâche'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
