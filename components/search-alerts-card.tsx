'use client'

import { useState, type ChangeEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Bell,
  Plus,
  Edit,
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useSearchAlerts } from '@/hooks/use-search-alerts'
import { usePermissions } from '@/hooks/use-permissions'
import { toast } from 'sonner'

export function SearchAlertsCard () {
  const {
    alerts,
    loading,
    createAlert,
    updateAlert,
    deleteAlert,
    toggleAlert
  } = useSearchAlerts()
  const { can, limit } = usePermissions()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newAlertName, setNewAlertName] = useState('')
  const [alertFrequency, setAlertFrequency] = useState<
    'immediate' | 'daily' | 'weekly'
  >('daily')
  const [alertEnabled, setAlertEnabled] = useState(true)

  const maxAlerts = limit('maxAlerts')

  if (!can('canSetAlerts')) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Bell className='h-5 w-5 text-gray-400' />
            Alertes de Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-6'>
            <AlertCircle className='h-12 w-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-600 mb-4'>
              Les alertes de recherche sont disponibles avec un compte Premium
              ou Agent.
            </p>
            <Button variant='outline' size='sm'>
              Découvrir les plans
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleCreateAlert = async () => {
    if (!newAlertName.trim()) {
      toast.error("Veuillez entrer un nom pour l'alerte")
      return
    }

    if (maxAlerts && alerts.length >= maxAlerts) {
      toast.error(`Vous ne pouvez créer que ${maxAlerts} alertes maximum`)
      return
    }

    try {
      await createAlert({
        name: newAlertName,
        filters: {}, // Les filtres seraient récupérés depuis un formulaire
        frequency: alertFrequency,
        enabled: alertEnabled
      })
      setNewAlertName('')
      setIsDialogOpen(false)
    } catch (error) {
      // L'erreur est déjà gérée dans le hook
    }
  }

  const getFrequencyBadgeColor = (frequency: string) => {
    switch (frequency) {
      case 'immediate':
        return 'bg-red-100 text-red-800'
      case 'daily':
        return 'bg-blue-100 text-blue-800'
      case 'weekly':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'immediate':
        return 'Immédiat'
      case 'daily':
        return 'Quotidien'
      case 'weekly':
        return 'Hebdomadaire'
      default:
        return frequency
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Bell className='h-5 w-5 text-blue-600' />
            Alertes de Recherche
            {alerts.length > 0 && (
              <Badge variant='secondary' className='ml-2'>
                {alerts.length}
                {maxAlerts && ` / ${maxAlerts}`}
              </Badge>
            )}
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size='sm'
                disabled={maxAlerts ? alerts.length >= maxAlerts : false}
              >
                <Plus className='h-4 w-4 mr-1' />
                Nouvelle Alerte
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer une nouvelle alerte</DialogTitle>
              </DialogHeader>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='alert-name'>Nom de l'alerte</Label>
                  <Input
                    id='alert-name'
                    value={newAlertName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAlertName(e.target.value)}
                    placeholder='Ex: Nouveaux bureaux à Paris'
                  />
                </div>
                <div>
                  <Label htmlFor='frequency'>Fréquence</Label>
                  <Select
                    value={alertFrequency}
                    onValueChange={(value: any) => setAlertFrequency(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='immediate'>Immédiat</SelectItem>
                      <SelectItem value='daily'>Quotidien</SelectItem>
                      <SelectItem value='weekly'>Hebdomadaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex items-center space-x-2'>
                  <Switch
                    id='alert-enabled'
                    checked={alertEnabled}
                    onCheckedChange={setAlertEnabled}
                  />
                  <Label htmlFor='alert-enabled'>Activer l'alerte</Label>
                </div>
                <div className='flex gap-2'>
                  <Button onClick={handleCreateAlert} className='flex-1'>
                    Créer l'alerte
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className='text-center py-4'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
          </div>
        ) : alerts.length === 0 ? (
          <div className='text-center py-6'>
            <Bell className='h-12 w-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-600 mb-4'>Aucune alerte configurée</p>
            <p className='text-sm text-gray-500'>
              Créez des alertes pour être notifié des nouvelles propriétés
              correspondant à vos critères.
            </p>
          </div>
        ) : (
          <div className='space-y-3'>
            {alerts.map(alert => (
              <div
                key={alert.id}
                className='border rounded-lg p-4 hover:bg-gray-50 transition-colors'
              >
                <div className='flex items-center justify-between mb-2'>
                  <h4 className='font-medium'>{alert.name}</h4>
                  <div className='flex items-center gap-2'>
                    <Switch
                      checked={alert.enabled}
                      onCheckedChange={() => toggleAlert(alert.id)}
                    />
                    <Button
                      variant='ghost'

                      onClick={() => deleteAlert(alert.id)}
                      className='text-red-600 hover:text-red-700'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>

                <div className='flex items-center gap-2 mb-2'>
                  <Badge className={getFrequencyBadgeColor(alert.frequency)}>
                    <Clock className='h-3 w-3 mr-1' />
                    {getFrequencyLabel(alert.frequency)}
                  </Badge>
                  {alert.enabled ? (
                    <Badge className='bg-green-100 text-green-800'>
                      <CheckCircle className='h-3 w-3 mr-1' />
                      Actif
                    </Badge>
                  ) : (
                    <Badge variant='secondary'>Inactif</Badge>
                  )}
                  {alert.newResultsCount && alert.newResultsCount > 0 && (
                    <Badge className='bg-red-100 text-red-800'>
                      {alert.newResultsCount} nouveaux
                    </Badge>
                  )}
                </div>

                <div className='text-sm text-gray-600'>
                  <p>
                    Créée le{' '}
                    {new Date(alert.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                  {alert.lastTriggered && (
                    <p>
                      Dernière exécution:{' '}
                      {new Date(alert.lastTriggered).toLocaleDateString(
                        'fr-FR'
                      )}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
