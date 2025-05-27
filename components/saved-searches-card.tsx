'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Search,
  Bell,
  BellOff,
  Trash2,
  Play,
  Edit,
  Plus,
  Clock,
  TrendingUp
} from 'lucide-react'
import { useSavedSearches } from '@/hooks/use-saved-searches'
import { usePermissions } from '@/hooks/use-permissions'
import { toast } from 'sonner'

export function SavedSearchesCard () {
  const {
    savedSearches,
    loading,
    saveSearch,
    deleteSearch,
    updateSearch,
    runSearch
  } = useSavedSearches()
  const { can, limit } = usePermissions()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newSearchName, setNewSearchName] = useState('')
  const [alertEnabled, setAlertEnabled] = useState(false)

  const maxSearches = limit('maxSavedSearches')

  if (!can('canSaveSearches')) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='text-center text-gray-500'>
            <Search className='h-12 w-12 mx-auto mb-4 text-gray-300' />
            <h3 className='text-lg font-semibold mb-2'>
              Recherches sauvegardées
            </h3>
            <p className='text-sm'>
              Disponible avec les plans Premium et Agent
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleSaveCurrentSearch = async () => {
    if (!newSearchName.trim()) {
      toast.error('Veuillez entrer un nom pour la recherche')
      return
    }

    try {
      // Récupérer les filtres actuels depuis l'URL ou le contexte
      const currentFilters = new URLSearchParams(window.location.search)
      const filters: Record<string, any> = {}

      for (const [key, value] of currentFilters.entries()) {
        filters[key] = value
      }

      await saveSearch(newSearchName, filters, alertEnabled)
      setNewSearchName('')
      setAlertEnabled(false)
      setIsDialogOpen(false)
      toast.success('Recherche sauvegardée avec succès')
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  const handleToggleAlert = async (
    searchId: string,
    currentAlertState: boolean
  ) => {
    try {
      await updateSearch(searchId, { alertEnabled: !currentAlertState })
      toast.success(
        !currentAlertState
          ? 'Alerte activée pour cette recherche'
          : 'Alerte désactivée pour cette recherche'
      )
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const handleRunSearch = async (
    searchId: string,
    filters: Record<string, any>
  ) => {
    try {
      await runSearch(searchId)

      // Construire l'URL avec les filtres
      const searchParams = new URLSearchParams(filters).toString()
      window.location.href = `/properties?${searchParams}`
    } catch (error) {
      toast.error("Erreur lors de l'exécution de la recherche")
    }
  }

  const handleDeleteSearch = async (searchId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette recherche ?')) {
      try {
        await deleteSearch(searchId)
        toast.success('Recherche supprimée')
      } catch (error) {
        toast.error('Erreur lors de la suppression')
      }
    }
  }

  const formatFilters = (filters: Record<string, any>) => {
    const filterDescriptions = []

    if (filters.propertyType)
      filterDescriptions.push(`Type: ${filters.propertyType}`)
    if (filters.city) filterDescriptions.push(`Ville: ${filters.city}`)
    if (filters.minPrice)
      filterDescriptions.push(`Prix min: ${filters.minPrice}`)
    if (filters.maxPrice)
      filterDescriptions.push(`Prix max: ${filters.maxPrice}`)
    if (filters.minSurface)
      filterDescriptions.push(`Surface min: ${filters.minSurface}m²`)

    return filterDescriptions.join(' • ')
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Search className='h-5 w-5' />
            Recherches sauvegardées
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size='sm'
                disabled={
                  maxSearches !== null && savedSearches.length >= maxSearches
                }
              >
                <Plus className='h-4 w-4 mr-2' />
                Sauvegarder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sauvegarder la recherche actuelle</DialogTitle>
              </DialogHeader>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='search-name'>Nom de la recherche</Label>
                  <Input
                    id='search-name'
                    value={newSearchName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSearchName(e.target.value)}
                    placeholder='Ex: Bureaux Downtown SF'
                  />
                </div>
                <div className='flex items-center space-x-2'>
                  <Switch
                    id='alert-enabled'
                    checked={alertEnabled}
                    onCheckedChange={setAlertEnabled}
                  />
                  <Label htmlFor='alert-enabled'>
                    Recevoir des alertes pour cette recherche
                  </Label>
                </div>
                <Button onClick={handleSaveCurrentSearch} className='w-full'>
                  Sauvegarder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {maxSearches !== null && (
          <p className='text-sm text-gray-600'>
            {savedSearches.length}/{maxSearches} recherches utilisées
          </p>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className='text-center py-4'>Chargement...</div>
        ) : savedSearches.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            <Search className='h-12 w-12 mx-auto mb-4 text-gray-300' />
            <p>Aucune recherche sauvegardée</p>
            <p className='text-sm'>
              Effectuez une recherche et sauvegardez-la pour un accès rapide
            </p>
          </div>
        ) : (
          <div className='space-y-3'>
            {savedSearches.map(search => (
              <div key={search.id} className='border rounded-lg p-4'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <h4 className='font-medium'>{search.name}</h4>
                      {search.alertEnabled && (
                        <Badge variant='secondary' className='text-xs'>
                          <Bell className='h-3 w-3 mr-1' />
                          Alerte
                        </Badge>
                      )}
                    </div>
                    <p className='text-sm text-gray-600 mb-2'>
                      {formatFilters(search.filters)}
                    </p>
                    <div className='flex items-center gap-4 text-xs text-gray-500'>
                      <span className='flex items-center gap-1'>
                        <Clock className='h-3 w-3' />
                        {new Date(search.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                      {search.resultsCount !== undefined && (
                        <span className='flex items-center gap-1'>
                          <TrendingUp className='h-3 w-3' />
                          {search.resultsCount} résultats
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='flex items-center gap-1 ml-4'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleRunSearch(search.id, search.filters)}
                    >
                      <Play className='h-3 w-3' />
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() =>
                        handleToggleAlert(search.id, search.alertEnabled)
                      }
                    >
                      {search.alertEnabled ? (
                        <BellOff className='h-3 w-3' />
                      ) : (
                        <Bell className='h-3 w-3' />
                      )}
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleDeleteSearch(search.id)}
                    >
                      <Trash2 className='h-3 w-3' />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
