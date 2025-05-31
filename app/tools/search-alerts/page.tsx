'use client'

import { useState, useEffect } from 'react'
import { usePermissions } from '@/hooks/use-permissions'
import { AccessRestriction } from '@/components/access-restriction'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  Bell,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Mail,
  Smartphone,
  Clock,
  MapPin,
  DollarSign,
  Home,
  Calendar,
  Settings,
  ChevronLeft,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

interface SearchAlert {
  id: string
  name: string
  description: string
  criteria: {
    query?: string
    type?: string
    priceMin?: number
    priceMax?: number
    surfaceMin?: number
    surfaceMax?: number
    city?: string
    zipCode?: string
  }
  frequency: 'realtime' | 'daily' | 'weekly'
  channels: {
    email: boolean
    sms: boolean
    push: boolean
  }
  isActive: boolean
  createdAt: Date
  lastTriggered?: Date
  totalMatches: number
}

export default function SearchAlertsPage() {
  const { can } = usePermissions()
  const [alerts, setAlerts] = useState<SearchAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingAlert, setEditingAlert] = useState<SearchAlert | null>(null)

  // Formulaire pour nouvelle alerte
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    query: '',
    type: '',
    priceMin: '',
    priceMax: '',
    surfaceMin: '',
    surfaceMax: '',
    city: '',
    zipCode: '',
    frequency: 'daily' as const,
    channels: {
      email: true,
      sms: false,
      push: true
    }
  })

  const frequencies = [
    { value: 'realtime', label: 'Temps réel', icon: '⚡', description: 'Notification immédiate' },
    { value: 'daily', label: 'Quotidienne', icon: '📅', description: 'Résumé quotidien' },
    { value: 'weekly', label: 'Hebdomadaire', icon: '📊', description: 'Résumé hebdomadaire' }
  ]

  const propertyTypes = [
    { value: 'office', label: 'Bureaux' },
    { value: 'retail', label: 'Commerce' },
    { value: 'industrial', label: 'Industriel' },
    { value: 'apartment', label: 'Résidentiel' },
    { value: 'warehouse', label: 'Entrepôt' },
    { value: 'land', label: 'Terrain' }
  ]

  // Charger les alertes
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const response = await fetch('/api/search-alerts')
        if (response.ok) {
          const data = await response.json()
          setAlerts(data.map((alert: any) => ({
            ...alert,
            createdAt: new Date(alert.createdAt),
            lastTriggered: alert.lastTriggered ? new Date(alert.lastTriggered) : undefined
          })))
        }
      } catch (error) {
        console.error('Erreur lors du chargement des alertes:', error)
        toast.error('Erreur lors du chargement des alertes')
      } finally {
        setIsLoading(false)
      }
    }

    if (can('canSetAlerts')) {
      loadAlerts()
    }
  }, [can])

  // Filtrer les alertes
  const filteredAlerts = alerts.filter(alert => {
    const matchesQuery = alert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        alert.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && alert.isActive) ||
                         (statusFilter === 'inactive' && !alert.isActive)
    return matchesQuery && matchesStatus
  })

  // Créer ou modifier une alerte
  const handleSaveAlert = async () => {
    try {
      const alertData = {
        name: formData.name,
        description: formData.description,
        criteria: {
          query: formData.query || undefined,
          type: formData.type || undefined,
          priceMin: formData.priceMin ? parseInt(formData.priceMin) : undefined,
          priceMax: formData.priceMax ? parseInt(formData.priceMax) : undefined,
          surfaceMin: formData.surfaceMin ? parseInt(formData.surfaceMin) : undefined,
          surfaceMax: formData.surfaceMax ? parseInt(formData.surfaceMax) : undefined,
          city: formData.city || undefined,
          zipCode: formData.zipCode || undefined
        },
        frequency: formData.frequency,
        channels: formData.channels
      }

      const url = editingAlert ? `/api/search-alerts/${editingAlert.id}` : '/api/search-alerts'
      const method = editingAlert ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData)
      })

      if (response.ok) {
        const savedAlert = await response.json()
        
        if (editingAlert) {
          setAlerts(prev => prev.map(a => 
            a.id === editingAlert.id ? { ...savedAlert, createdAt: new Date(savedAlert.createdAt) } : a
          ))
          toast.success('Alerte modifiée avec succès')
        } else {
          setAlerts(prev => [...prev, { ...savedAlert, createdAt: new Date(savedAlert.createdAt) }])
          toast.success('Alerte créée avec succès')
        }

        setIsCreateDialogOpen(false)
        setEditingAlert(null)
        setFormData({
          name: '', description: '', query: '', type: '', priceMin: '', priceMax: '',
          surfaceMin: '', surfaceMax: '', city: '', zipCode: '', frequency: 'daily',
          channels: { email: true, sms: false, push: true }
        })
      } else {
        throw new Error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la sauvegarde de l\'alerte')
    }
  }

  // Activer/désactiver une alerte
  const handleToggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/search-alerts/${alertId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      })

      if (response.ok) {
        setAlerts(prev => prev.map(a => 
          a.id === alertId ? { ...a, isActive } : a
        ))
        toast.success(isActive ? 'Alerte activée' : 'Alerte désactivée')
      } else {
        throw new Error('Erreur lors de la modification')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la modification de l\'alerte')
    }
  }

  // Supprimer une alerte
  const handleDeleteAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/search-alerts/${alertId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setAlerts(prev => prev.filter(a => a.id !== alertId))
        toast.success('Alerte supprimée avec succès')
      } else {
        throw new Error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la suppression de l\'alerte')
    }
  }

  // Modifier une alerte
  const handleEditAlert = (alert: SearchAlert) => {
    setEditingAlert(alert)
    setFormData({
      name: alert.name,
      description: alert.description,
      query: alert.criteria.query || '',
      type: alert.criteria.type || '',
      priceMin: alert.criteria.priceMin?.toString() || '',
      priceMax: alert.criteria.priceMax?.toString() || '',
      surfaceMin: alert.criteria.surfaceMin?.toString() || '',
      surfaceMax: alert.criteria.surfaceMax?.toString() || '',
      city: alert.criteria.city || '',
      zipCode: alert.criteria.zipCode || '',
      frequency: alert.frequency,
      channels: alert.channels
    })
    setIsCreateDialogOpen(true)
  }

  // Vérifier si l'utilisateur a la permission d'utiliser cette fonctionnalité
  if (!can('canSetAlerts')) {
    return (
      <AccessRestriction
        action='canSetAlerts'
        requiredLevel='premium'
        showUpgradePrompt={true}
      >
        <div className='container mx-auto py-8 max-w-4xl'>
          <div className="text-center">
            <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Alertes de Recherche</h1>
            <p className="text-muted-foreground">
              Recevez des notifications automatiques pour les nouvelles propriétés correspondant à vos critères.
            </p>
          </div>
        </div>
      </AccessRestriction>
    )
  }

  const activeAlertsCount = alerts.filter(a => a.isActive).length
  const totalMatches = alerts.reduce((sum, alert) => sum + alert.totalMatches, 0)

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/tools">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Retour aux outils
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Bell className="mr-3 h-8 w-8 text-blue-600" />
          Alertes de Recherche
        </h1>
        <p className="text-muted-foreground">
          Configurez des alertes personnalisées et ne manquez jamais une opportunité immobilière.
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alertes actives</p>
                <p className="text-2xl font-bold">{activeAlertsCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total alertes</p>
                <p className="text-2xl font-bold">{alerts.length}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Propriétés détectées</p>
                <p className="text-2xl font-bold">{totalMatches}</p>
              </div>
              <Home className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contrôles */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Rechercher dans vos alertes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les alertes</SelectItem>
            <SelectItem value="active">Actives uniquement</SelectItem>
            <SelectItem value="inactive">Inactives uniquement</SelectItem>
          </SelectContent>
        </Select>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle alerte
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAlert ? 'Modifier l\'alerte' : 'Créer une nouvelle alerte'}
              </DialogTitle>
              <DialogDescription>
                Configurez vos critères pour recevoir des notifications automatiques.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'alerte *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Bureaux disponibles centre-ville"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de cette alerte..."
                  rows={2}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Critères de recherche</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="query">Mots-clés</Label>
                    <Input
                      id="query"
                      value={formData.query}
                      onChange={(e) => setFormData(prev => ({ ...prev, query: e.target.value }))}
                      placeholder="Ex: parking, terrasse..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de propriété</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priceMin">Prix minimum (€)</Label>
                    <Input
                      id="priceMin"
                      type="number"
                      value={formData.priceMin}
                      onChange={(e) => setFormData(prev => ({ ...prev, priceMin: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priceMax">Prix maximum (€)</Label>
                    <Input
                      id="priceMax"
                      type="number"
                      value={formData.priceMax}
                      onChange={(e) => setFormData(prev => ({ ...prev, priceMax: e.target.value }))}
                      placeholder="1000000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="surfaceMin">Surface minimum (m²)</Label>
                    <Input
                      id="surfaceMin"
                      type="number"
                      value={formData.surfaceMin}
                      onChange={(e) => setFormData(prev => ({ ...prev, surfaceMin: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="surfaceMax">Surface maximum (m²)</Label>
                    <Input
                      id="surfaceMax"
                      type="number"
                      value={formData.surfaceMax}
                      onChange={(e) => setFormData(prev => ({ ...prev, surfaceMax: e.target.value }))}
                      placeholder="1000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Ex: Paris, Lyon..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Code postal</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                      placeholder="Ex: 75001"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Paramètres de notification</h3>
                
                <div className="space-y-2">
                  <Label>Fréquence</Label>
                  <Select 
                    value={formData.frequency} 
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, frequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map(freq => (
                        <SelectItem key={freq.value} value={freq.value}>
                          <div className="flex items-center space-x-2">
                            <span>{freq.icon}</span>
                            <div>
                              <div>{freq.label}</div>
                              <div className="text-xs text-muted-foreground">{freq.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Canaux de notification</Label>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">Notifications par email</p>
                        </div>
                      </div>
                      <Switch
                        checked={formData.channels.email}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ 
                            ...prev, 
                            channels: { ...prev.channels, email: checked }
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-medium">SMS</p>
                          <p className="text-sm text-muted-foreground">Notifications par SMS</p>
                        </div>
                      </div>
                      <Switch
                        checked={formData.channels.sms}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ 
                            ...prev, 
                            channels: { ...prev.channels, sms: checked }
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="font-medium">Push</p>
                          <p className="text-sm text-muted-foreground">Notifications push</p>
                        </div>
                      </div>
                      <Switch
                        checked={formData.channels.push}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ 
                            ...prev, 
                            channels: { ...prev.channels, push: checked }
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreateDialogOpen(false)
                  setEditingAlert(null)
                  setFormData({
                    name: '', description: '', query: '', type: '', priceMin: '', priceMax: '',
                    surfaceMin: '', surfaceMax: '', city: '', zipCode: '', frequency: 'daily',
                    channels: { email: true, sms: false, push: true }
                  })
                }}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleSaveAlert} 
                disabled={!formData.name || (!formData.channels.email && !formData.channels.sms && !formData.channels.push)}
              >
                {editingAlert ? 'Modifier' : 'Créer l\'alerte'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Liste des alertes */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAlerts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery || statusFilter !== 'all' 
                ? 'Aucune alerte trouvée' 
                : 'Aucune alerte configurée'
              }
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Essayez de modifier vos filtres ou votre recherche.'
                : 'Commencez par créer votre première alerte de recherche.'
              }
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Créer ma première alerte
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredAlerts.map((alert) => (
            <Card key={alert.id} className={`group hover:shadow-md transition-all ${alert.isActive ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-gray-300'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-lg">{alert.name}</CardTitle>
                      <Badge variant={alert.isActive ? 'default' : 'secondary'}>
                        {alert.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {alert.description && (
                      <CardDescription className="line-clamp-2">
                        {alert.description}
                      </CardDescription>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => handleToggleAlert(alert.id, !alert.isActive)}
                      >
                        {alert.isActive ? (
                          <>
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Désactiver
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activer
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditAlert(alert)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Tester l'alerte
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Critères de recherche */}
                <div className="space-y-2 text-sm mb-4">
                  {alert.criteria.type && (
                    <div className="flex items-center text-muted-foreground">
                      <Home className="mr-2 h-3 w-3" />
                      {propertyTypes.find(t => t.value === alert.criteria.type)?.label || alert.criteria.type}
                    </div>
                  )}
                  
                  {(alert.criteria.priceMin || alert.criteria.priceMax) && (
                    <div className="flex items-center text-muted-foreground">
                      <DollarSign className="mr-2 h-3 w-3" />
                      {alert.criteria.priceMin && alert.criteria.priceMax 
                        ? `${alert.criteria.priceMin.toLocaleString()} € - ${alert.criteria.priceMax.toLocaleString()} €`
                        : alert.criteria.priceMin 
                          ? `À partir de ${alert.criteria.priceMin.toLocaleString()} €`
                          : `Jusqu'à ${alert.criteria.priceMax?.toLocaleString()} €`
                      }
                    </div>
                  )}
                  
                  {(alert.criteria.city || alert.criteria.zipCode) && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-2 h-3 w-3" />
                      {[alert.criteria.city, alert.criteria.zipCode].filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>

                {/* Paramètres de notification */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {frequencies.find(f => f.value === alert.frequency)?.label}
                  </div>
                  <div className="flex items-center space-x-1">
                    {alert.channels.email && <Mail className="h-3 w-3" />}
                    {alert.channels.sms && <Smartphone className="h-3 w-3" />}
                    {alert.channels.push && <Bell className="h-3 w-3" />}
                  </div>
                </div>

                <Separator className="my-3" />
                
                {/* Métadonnées */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      Créée le {format(alert.createdAt, 'dd/MM/yyyy', { locale: fr })}
                    </div>
                    {alert.lastTriggered && (
                      <div className="mt-1">
                        Dernière activation: {format(alert.lastTriggered, 'dd/MM/yyyy', { locale: fr })}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{alert.totalMatches}</div>
                    <div>propriétés détectées</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-4">
                  <Switch
                    checked={alert.isActive}
                    onCheckedChange={(checked) => handleToggleAlert(alert.id, checked)}
                  />
                  <Label className="text-sm cursor-pointer" onClick={() => handleToggleAlert(alert.id, !alert.isActive)}>
                    {alert.isActive ? 'Alerte active' : 'Alerte inactive'}
                  </Label>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
