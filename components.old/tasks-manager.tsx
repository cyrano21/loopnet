'use client'

import React, { useState, ChangeEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { useTasks, type Task, type TaskFilters } from '@/hooks/use-tasks'
import { usePermissions } from '@/hooks/use-permissions'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

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
  viewing: 'Visite',
  'follow-up': 'Suivi',
  documentation: 'Documentation',
  negotiation: 'Négociation',
  inspection: 'Inspection',
  other: 'Autre'
}

export function TasksManager() {
  const { can, requiresUpgrade } = usePermissions()
  const { tasks, loading, error, createTask, updateTask, deleteTask, filters, setFilters } = useTasks()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    status: 'pending' as Task['status'],
    category: 'other' as Task['category'],
    dueDate: '',
    propertyId: '',
    propertyTitle: '',
    tags: [] as string[],
    notes: '',
  })

  if (!can('canManageTasks')) {
    const upgrade = requiresUpgrade('canManageTasks')
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">Gestion des tâches</h3>
            <p className="text-sm mb-4">
              Disponible avec les plans {upgrade === 'premium' ? 'Premium et Agent' : 'Agent'}
            </p>
            <Button variant="outline" size="sm">
              Passer au plan {upgrade === 'premium' ? 'Premium' : 'Agent'}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleCreateTask = async () => {
    try {
      await createTask({
        ...newTask,
        tags: newTask.tags.filter(tag => tag.trim() !== ''),
        reminder: newTask.dueDate ? {
          enabled: true,
          date: new Date(new Date(newTask.dueDate).getTime() - 30 * 60 * 1000).toISOString(),
          sent: false
        } : undefined
      })
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        category: 'other',
        dueDate: '',
        propertyId: '',
        propertyTitle: '',
        tags: [],
        notes: '',
      })
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const handleUpdateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      await updateTask(taskId, { status })
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await deleteTask(taskId)
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  const filteredTasks = tasks.filter(task => {
    if (filters.status?.length && !filters.status.includes(task.status)) return false
    if (filters.priority?.length && !filters.priority.includes(task.priority)) return false
    if (filters.category?.length && !filters.category.includes(task.category)) return false
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  const tasksByStatus = {
    pending: filteredTasks.filter(t => t.status === 'pending'),
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
    completed: filteredTasks.filter(t => t.status === 'completed'),
    cancelled: filteredTasks.filter(t => t.status === 'cancelled')
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 animate-spin text-blue-500" />
            <p>Chargement des tâches...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Erreur lors du chargement des tâches</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des tâches</h2>
          <p className="text-gray-600">Planifiez et suivez vos activités immobilières</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle tâche
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle tâche</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titre de la tâche"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description détaillée"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priorité</Label>
                    <Select value={newTask.priority} onValueChange={(value: Task['priority']) => 
                      setNewTask(prev => ({ ...prev, priority: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Faible</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Haute</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <Select value={newTask.category} onValueChange={(value: Task['category']) => 
                      setNewTask(prev => ({ ...prev, category: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="dueDate">Date d'échéance</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="propertyTitle">Propriété liée</Label>
                  <Input
                    id="propertyTitle"
                    value={newTask.propertyTitle}
                    onChange={(e) => setNewTask(prev => ({ ...prev, propertyTitle: e.target.value }))}
                    placeholder="Nom de la propriété"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newTask.notes}
                    onChange={(e) => setNewTask(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Notes additionnelles"
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleCreateTask}
                  disabled={!newTask.title.trim()}
                >
                  Créer la tâche
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtres */}
      {isFilterOpen && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Recherche</Label>
                <Input
                  placeholder="Rechercher une tâche..."
                  value={filters.search || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
              <div>
                <Label>Statut</Label>                <Select value={filters.status?.[0] || 'all'} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, status: value && value !== 'all' ? [value as Task['status']] : [] }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="in-progress">En cours</SelectItem>
                    <SelectItem value="completed">Terminée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priorité</Label>                <Select value={filters.priority?.[0] || 'all'} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, priority: value && value !== 'all' ? [value as Task['priority']] : [] }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les priorités" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les priorités</SelectItem>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Catégorie</Label>                <Select value={filters.category?.[0] || 'all'} onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, category: value && value !== 'all' ? [value as Task['category']] : [] }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{tasksByStatus.pending.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-blue-600">{tasksByStatus['in-progress'].length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Terminées</p>
                <p className="text-2xl font-bold text-green-600">{tasksByStatus.completed.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En retard</p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredTasks.filter(t => isOverdue(t.dueDate) && t.status !== 'completed').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des tâches */}
      <Card>
        <CardHeader>
          <CardTitle>Mes tâches ({filteredTasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune tâche</h3>
              <p className="text-gray-500 mb-4">
                {tasks.length === 0 
                  ? "Vous n'avez pas encore de tâches. Créez votre première tâche pour commencer."
                  : "Aucune tâche ne correspond aux filtres sélectionnés."
                }
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer une tâche
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 border rounded-lg ${isOverdue(task.dueDate) && task.status !== 'completed' 
                    ? 'border-red-200 bg-red-50' 
                    : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge className={`text-xs ${priorityColors[task.priority]}`}>
                          <Flag className="h-3 w-3 mr-1" />
                          {task.priority === 'low' ? 'Faible' : 
                           task.priority === 'medium' ? 'Moyenne' :
                           task.priority === 'high' ? 'Haute' : 'Urgente'}
                        </Badge>
                        <Badge className={`text-xs ${statusColors[task.status]}`}>
                          {task.status === 'pending' ? 'En attente' :
                           task.status === 'in-progress' ? 'En cours' :
                           task.status === 'completed' ? 'Terminée' : 'Annulée'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {categoryLabels[task.category]}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className={isOverdue(task.dueDate) && task.status !== 'completed' ? 'text-red-600 font-medium' : ''}>
                              {format(new Date(task.dueDate), 'dd MMM yyyy à HH:mm', { locale: fr })}
                            </span>
                          </div>
                        )}
                        {task.propertyTitle && (
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            <span>{task.propertyTitle}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {task.status !== 'completed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedTask(task)
                            setIsEditModalOpen(true)
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          {task.status === 'pending' && (
                            <DropdownMenuItem onClick={() => handleUpdateTaskStatus(task.id, 'in-progress')}>
                              <Clock className="h-4 w-4 mr-2" />
                              Marquer en cours
                            </DropdownMenuItem>
                          )}
                          {task.status !== 'completed' && (
                            <DropdownMenuItem onClick={() => handleUpdateTaskStatus(task.id, 'completed')}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Marquer terminée
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
