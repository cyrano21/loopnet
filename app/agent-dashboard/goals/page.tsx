'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Building2, 
  DollarSign, 
  Users, 
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Award,
  BarChart3
} from 'lucide-react'
import { RoleGuard } from '@/components/role-guard'

// Types pour les objectifs
interface Goal {
  id: number
  title: string
  description: string
  type: 'sales' | 'listings' | 'commission' | 'clients'
  target: number
  current: number
  unit: string
  deadline: string
  status: 'active' | 'completed' | 'overdue'
  priority: 'low' | 'medium' | 'high'
  category: 'monthly' | 'quarterly' | 'yearly'
}

// Données fictives pour les objectifs
const initialGoals: Goal[] = [
  {
    id: 1,
    title: 'Ventes mensuelles',
    description: 'Réaliser 10 ventes ce mois-ci',
    type: 'sales',
    target: 10,
    current: 7,
    unit: 'ventes',
    deadline: '2024-01-31',
    status: 'active',
    priority: 'high',
    category: 'monthly'
  },
  {
    id: 2,
    title: 'Nouvelles annonces',
    description: 'Publier 15 nouvelles propriétés ce mois',
    type: 'listings',
    target: 15,
    current: 12,
    unit: 'annonces',
    deadline: '2024-01-31',
    status: 'active',
    priority: 'medium',
    category: 'monthly'
  },
  {
    id: 3,
    title: 'Objectif commission trimestriel',
    description: 'Atteindre 50 000€ de commissions ce trimestre',
    type: 'commission',
    target: 50000,
    current: 35000,
    unit: '€',
    deadline: '2024-03-31',
    status: 'active',
    priority: 'high',
    category: 'quarterly'
  },
  {
    id: 4,
    title: 'Nouveaux clients',
    description: 'Acquérir 20 nouveaux clients ce trimestre',
    type: 'clients',
    target: 20,
    current: 14,
    unit: 'clients',
    deadline: '2024-03-31',
    status: 'active',
    priority: 'medium',
    category: 'quarterly'
  },
  {
    id: 5,
    title: 'Objectif annuel ventes',
    description: 'Réaliser 100 ventes cette année',
    type: 'sales',
    target: 100,
    current: 85,
    unit: 'ventes',
    deadline: '2024-12-31',
    status: 'active',
    priority: 'high',
    category: 'yearly'
  }
]

const goalProgress = [
  { month: 'Jan', target: 10, achieved: 7 },
  { month: 'Fév', target: 10, achieved: 12 },
  { month: 'Mar', target: 10, achieved: 8 },
  { month: 'Avr', target: 10, achieved: 15 },
  { month: 'Mai', target: 10, achieved: 11 },
  { month: 'Juin', target: 10, achieved: 9 },
  { month: 'Juil', target: 10, achieved: 13 },
  { month: 'Août', target: 10, achieved: 10 },
  { month: 'Sep', target: 10, achieved: 14 },
  { month: 'Oct', target: 10, achieved: 12 },
  { month: 'Nov', target: 10, achieved: 8 },
  { month: 'Déc', target: 10, achieved: 16 },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" />Terminé</Badge>
    case 'active':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><Clock className="h-3 w-3 mr-1" />En cours</Badge>
    case 'overdue':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><AlertCircle className="h-3 w-3 mr-1" />En retard</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return <Badge variant="destructive">Haute</Badge>
    case 'medium':
      return <Badge variant="secondary">Moyenne</Badge>
    case 'low':
      return <Badge variant="outline">Basse</Badge>
    default:
      return <Badge variant="secondary">{priority}</Badge>
  }
}

const getGoalIcon = (type: string) => {
  switch (type) {
    case 'sales':
      return <DollarSign className="h-4 w-4" />
    case 'listings':
      return <Building2 className="h-4 w-4" />
    case 'commission':
      return <Target className="h-4 w-4" />
    case 'clients':
      return <Users className="h-4 w-4" />
    default:
      return <Target className="h-4 w-4" />
  }
}

export default function AgentGoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: '',
    description: '',
    type: 'sales',
    target: 0,
    current: 0,
    unit: '',
    deadline: '',
    priority: 'medium',
    category: 'monthly'
  })

  const filteredGoals = goals.filter(goal => {
    const categoryMatch = filterCategory === 'all' || goal.category === filterCategory
    const statusMatch = filterStatus === 'all' || goal.status === filterStatus
    return categoryMatch && statusMatch
  })

  const completedGoals = goals.filter(goal => goal.status === 'completed').length
  const activeGoals = goals.filter(goal => goal.status === 'active').length
  const overdueGoals = goals.filter(goal => goal.status === 'overdue').length
  const totalProgress = goals.reduce((sum, goal) => sum + (goal.current / goal.target * 100), 0) / goals.length

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.target) {
      const goal: Goal = {
        id: Date.now(),
        title: newGoal.title,
        description: newGoal.description || '',
        type: newGoal.type as Goal['type'],
        target: newGoal.target,
        current: newGoal.current || 0,
        unit: newGoal.unit || '',
        deadline: newGoal.deadline || '',
        status: 'active',
        priority: newGoal.priority as Goal['priority'],
        category: newGoal.category as Goal['category']
      }
      setGoals([...goals, goal])
      setNewGoal({
        title: '',
        description: '',
        type: 'sales',
        target: 0,
        current: 0,
        unit: '',
        deadline: '',
        priority: 'medium',
        category: 'monthly'
      })
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id))
  }

  const handleUpdateProgress = (id: number, newCurrent: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        const updatedGoal = { ...goal, current: newCurrent }
        if (newCurrent >= goal.target) {
          updatedGoal.status = 'completed'
        }
        return updatedGoal
      }
      return goal
    }))
  }

  return (
    <RoleGuard allowedRoles={['agent', 'admin']} message="Vous devez être un agent pour accéder à cette page.">
      <div className="w-full px-4 py-8">
        <div className="flex flex-col space-y-8">
          {/* En-tête */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Objectifs</h1>
              <p className="text-gray-500 mt-1">
                Définissez et suivez vos objectifs commerciaux
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvel objectif
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Créer un nouvel objectif</DialogTitle>
                    <DialogDescription>
                      Définissez un nouvel objectif pour suivre vos performances.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Titre
                      </Label>
                      <Input
                        id="title"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={newGoal.description}
                        onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Type
                      </Label>
                      <Select value={newGoal.type} onValueChange={(value) => setNewGoal({...newGoal, type: value as Goal['type']})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales">Ventes</SelectItem>
                          <SelectItem value="listings">Annonces</SelectItem>
                          <SelectItem value="commission">Commission</SelectItem>
                          <SelectItem value="clients">Clients</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="target" className="text-right">
                        Objectif
                      </Label>
                      <Input
                        id="target"
                        type="number"
                        value={newGoal.target}
                        onChange={(e) => setNewGoal({...newGoal, target: parseInt(e.target.value)})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="unit" className="text-right">
                        Unité
                      </Label>
                      <Input
                        id="unit"
                        value={newGoal.unit}
                        onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                        className="col-span-3"
                        placeholder="ex: ventes, €, clients"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="deadline" className="text-right">
                        Échéance
                      </Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="priority" className="text-right">
                        Priorité
                      </Label>
                      <Select value={newGoal.priority} onValueChange={(value) => setNewGoal({...newGoal, priority: value as Goal['priority']})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Basse</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="high">Haute</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        Catégorie
                      </Label>
                      <Select value={newGoal.category} onValueChange={(value) => setNewGoal({...newGoal, category: value as Goal['category']})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Mensuel</SelectItem>
                          <SelectItem value="quarterly">Trimestriel</SelectItem>
                          <SelectItem value="yearly">Annuel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddGoal}>Créer l'objectif</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Objectifs actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{activeGoals}</div>
                <p className="text-xs text-blue-500 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  En cours
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Objectifs terminés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{completedGoals}</div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Réalisés
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  En retard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{overdueGoals}</div>
                <p className="text-xs text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  À rattraper
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Progression moyenne
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalProgress.toFixed(1)}%</div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Tous objectifs
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filtres */}
          <div className="flex gap-4">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="monthly">Mensuel</SelectItem>
                <SelectItem value="quarterly">Trimestriel</SelectItem>
                <SelectItem value="yearly">Annuel</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">En cours</SelectItem>
                <SelectItem value="completed">Terminés</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Onglets pour les différentes vues */}
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="list">
                <Target className="h-4 w-4 mr-2" />
                Liste des objectifs
              </TabsTrigger>
              <TabsTrigger value="progress">
                <BarChart3 className="h-4 w-4 mr-2" />
                Progression
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <Award className="h-4 w-4 mr-2" />
                Analyse
              </TabsTrigger>
            </TabsList>

            {/* Liste des objectifs */}
            <TabsContent value="list" className="space-y-6">
              <div className="grid gap-4">
                {filteredGoals.map((goal) => {
                  const progressPercentage = (goal.current / goal.target) * 100
                  const isOverdue = new Date(goal.deadline) < new Date() && goal.status !== 'completed'
                  
                  return (
                    <Card key={goal.id} className={`${isOverdue ? 'border-red-200' : ''}`}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              {getGoalIcon(goal.type)}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{goal.title}</CardTitle>
                              <CardDescription>{goal.description}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(goal.status)}
                            {getPriorityBadge(goal.priority)}
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteGoal(goal.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-sm">
                            <span>Progression: {goal.current} / {goal.target} {goal.unit}</span>
                            <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>Échéance: {new Date(goal.deadline).toLocaleDateString('fr-FR')}</span>
                            <span>Catégorie: {goal.category === 'monthly' ? 'Mensuel' : goal.category === 'quarterly' ? 'Trimestriel' : 'Annuel'}</span>
                          </div>
                          {goal.status === 'active' && (
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                placeholder="Nouveau progrès"
                                className="flex-1"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    const value = parseInt((e.target as HTMLInputElement).value)
                                    if (value >= 0) {
                                      handleUpdateProgress(goal.id, value)
                                      ;(e.target as HTMLInputElement).value = ''
                                    }
                                  }
                                }}
                              />
                              <Button size="sm" variant="outline">
                                Mettre à jour
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* Progression */}
            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des objectifs</CardTitle>
                  <CardDescription>
                    Suivi de vos performances par rapport aux objectifs fixés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={goalProgress}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="target" fill="#e5e7eb" name="Objectif" />
                        <Bar dataKey="achieved" fill="#3b82f6" name="Réalisé" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Progression par objectif</CardTitle>
                    <CardDescription>
                      Pourcentage de réalisation de chaque objectif
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {goals.slice(0, 5).map((goal) => {
                        const percentage = (goal.current / goal.target) * 100
                        return (
                          <div key={goal.id} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{goal.title}</span>
                              <span>{percentage.toFixed(1)}%</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Répartition par type</CardTitle>
                    <CardDescription>
                      Distribution de vos objectifs par catégorie
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Ventes', value: goals.filter(g => g.type === 'sales').length },
                              { name: 'Annonces', value: goals.filter(g => g.type === 'listings').length },
                              { name: 'Commission', value: goals.filter(g => g.type === 'commission').length },
                              { name: 'Clients', value: goals.filter(g => g.type === 'clients').length },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {goals.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analyse */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Taux de réussite</CardTitle>
                    <CardDescription>
                      Pourcentage d'objectifs atteints par période
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { period: 'Q1', rate: 75 },
                          { period: 'Q2', rate: 85 },
                          { period: 'Q3', rate: 90 },
                          { period: 'Q4', rate: 80 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis unit="%" />
                          <Tooltip formatter={(value) => [`${value}%`, 'Taux de réussite']} />
                          <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommandations</CardTitle>
                    <CardDescription>
                      Conseils pour améliorer vos performances
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-900">Excellente progression</h4>
                          <p className="text-sm text-green-700 mt-1">
                            Vous êtes en bonne voie pour atteindre {Math.round(totalProgress)}% de vos objectifs.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                        <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Concentrez-vous sur les priorités</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Vous avez {goals.filter(g => g.priority === 'high').length} objectifs haute priorité à finaliser.
                          </p>
                        </div>
                      </div>
                      {overdueGoals > 0 && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-red-900">Objectifs en retard</h4>
                            <p className="text-sm text-red-700 mt-1">
                              {overdueGoals} objectif{overdueGoals > 1 ? 's' : ''} nécessite{overdueGoals > 1 ? 'nt' : ''} votre attention immédiate.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Historique des performances</CardTitle>
                  <CardDescription>
                    Évolution de vos résultats au fil du temps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { month: 'Jan', completed: 2, total: 3 },
                        { month: 'Fév', completed: 3, total: 4 },
                        { month: 'Mar', completed: 4, total: 5 },
                        { month: 'Avr', completed: 3, total: 4 },
                        { month: 'Mai', completed: 5, total: 6 },
                        { month: 'Juin', completed: 4, total: 5 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill="#e5e7eb" name="Total objectifs" />
                        <Bar dataKey="completed" fill="#10b981" name="Objectifs atteints" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RoleGuard>
  )
}