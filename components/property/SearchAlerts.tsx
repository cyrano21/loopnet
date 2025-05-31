'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Clock, 
  Settings, 
  Plus,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react'

interface SearchAlert {
  id: string
  name: string
  filters: any
  frequency: 'instant' | 'daily' | 'weekly'
  email: boolean
  sms: boolean
  active: boolean
  createdAt: string
  lastTriggered?: string
  matchCount: number
}

interface SearchAlertsProps {
  currentFilters: any
  className?: string
}

export function SearchAlerts({ currentFilters, className }: SearchAlertsProps) {
  const [alerts, setAlerts] = useState<SearchAlert[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAlert, setNewAlert] = useState({
    name: '',
    frequency: 'daily' as const,
    email: true,
    sms: false,
    emailAddress: '',
    phoneNumber: ''
  })
  const [isCreating, setIsCreating] = useState(false)

  const createAlert = async () => {
    if (!newAlert.name.trim()) return

    setIsCreating(true)
    
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1000))

    const alert: SearchAlert = {
      id: Date.now().toString(),
      name: newAlert.name.trim(),
      filters: { ...currentFilters },
      frequency: newAlert.frequency,
      email: newAlert.email,
      sms: newAlert.sms,
      active: true,
      createdAt: new Date().toISOString(),
      matchCount: Math.floor(Math.random() * 10) + 1
    }

    setAlerts(prev => [alert, ...prev])
    
    // Reset form
    setNewAlert({
      name: '',
      frequency: 'daily',
      email: true,
      sms: false,
      emailAddress: '',
      phoneNumber: ''
    })
    
    setShowCreateForm(false)
    setIsCreating(false)
  }

  const toggleAlert = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, active: !alert.active } : alert
      )
    )
  }

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'instant': return 'Instantané'
      case 'daily': return 'Quotidien'
      case 'weekly': return 'Hebdomadaire'
      default: return frequency
    }
  }

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'instant': return <Bell className="h-4 w-4" />
      case 'daily': return <Calendar className="h-4 w-4" />
      case 'weekly': return <Clock className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const hasActiveFilters = () => {
    return Object.entries(currentFilters).some(([key, value]) => {
      if (key === 'page' || key === 'sort') return false
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v !== undefined && v !== '')
      }
      return value !== undefined && value !== '' && value !== false
    })
  }

  return (
    <div className={className}>
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-green-600" />
                Alertes de recherche
              </CardTitle>
              <CardDescription>
                Recevez des notifications quand de nouvelles propriétés correspondent à vos critères
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              disabled={!hasActiveFilters()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer une alerte
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!hasActiveFilters() && (
            <div className="p-4 bg-yellow-50/80 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">
                  Appliquez des filtres de recherche pour créer une alerte
                </p>
              </div>
            </div>
          )}

          {/* Formulaire de création d'alerte */}
          {showCreateForm && hasActiveFilters() && (
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Nouvelle alerte de recherche</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Nom de l'alerte
                  </label>
                  <Input
                    placeholder="Ex: Bureaux Paris 15ème"
                    value={newAlert.name}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, name: e.target.value }))}
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Fréquence des notifications
                  </label>
                  <Select 
                    value={newAlert.frequency} 
                    onValueChange={(value: any) => setNewAlert(prev => ({ ...prev, frequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">Instantané (dès qu'une propriété correspond)</SelectItem>
                      <SelectItem value="daily">Quotidien (résumé quotidien)</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire (résumé hebdomadaire)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    Méthodes de notification
                  </label>
                  
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-gray-600">Recevoir les alertes par email</p>
                      </div>
                    </div>
                    <Switch
                      checked={newAlert.email}
                      onCheckedChange={(checked) => setNewAlert(prev => ({ ...prev, email: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">SMS</p>
                        <p className="text-sm text-gray-600">Recevoir les alertes par SMS</p>
                      </div>
                    </div>
                    <Switch
                      checked={newAlert.sms}
                      onCheckedChange={(checked) => setNewAlert(prev => ({ ...prev, sms: checked }))}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={createAlert}
                    disabled={!newAlert.name.trim() || isCreating}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isCreating ? 'Création...' : 'Créer l\'alerte'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste des alertes existantes */}
          {alerts.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Mes alertes actives ({alerts.length})</h4>
              
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border transition-all ${
                    alert.active 
                      ? 'bg-white border-green-200 shadow-sm' 
                      : 'bg-gray-50/80 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className={`font-medium truncate ${
                          alert.active ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {alert.name}
                        </h5>
                        {alert.active ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-gray-600">
                            Désactivée
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          {getFrequencyIcon(alert.frequency)}
                          {getFrequencyLabel(alert.frequency)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bell className="h-3 w-3" />
                          {alert.matchCount} correspondances
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {alert.email && (
                          <Badge variant="outline" className="text-xs">
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Badge>
                        )}
                        {alert.sms && (
                          <Badge variant="outline" className="text-xs">
                            <Smartphone className="h-3 w-3 mr-1" />
                            SMS
                          </Badge>
                        )}
                        <span>
                          Créé le {new Date(alert.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      {alert.lastTriggered && (
                        <p className="text-xs text-green-600 mt-1">
                          Dernière alerte: {new Date(alert.lastTriggered).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Switch
                        checked={alert.active}
                        onCheckedChange={() => toggleAlert(alert.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAlert(alert.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {alerts.length === 0 && hasActiveFilters() && !showCreateForm && (
            <div className="text-center py-6 text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Aucune alerte configurée</p>
              <p className="text-xs">Créez votre première alerte pour ne manquer aucune opportunité</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
