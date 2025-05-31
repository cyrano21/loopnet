'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  Save, 
  Star, 
  Trash2, 
  Search, 
  MoreVertical,
  Calendar,
  MapPin,
  Building2,
  DollarSign,
  SquareM,
  Tag
} from 'lucide-react'

interface SavedSearch {
  id: string
  name: string
  filters: any
  createdAt: string
  isFavorite: boolean
  description?: string
  resultCount?: number
}

interface SavedSearchesProps {
  currentFilters: any
  onLoadSearch: (filters: any) => void
  className?: string
}

export function SavedSearches({ currentFilters, onLoadSearch, className }: SavedSearchesProps) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [searchName, setSearchName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSaved, setShowSaved] = useState(false)

  // Charger les recherches sauvegardées depuis localStorage au démarrage
  useEffect(() => {
    const stored = localStorage.getItem('savedSearches')
    if (stored) {
      try {
        setSavedSearches(JSON.parse(stored))
      } catch (error) {
        console.error('Erreur lors du chargement des recherches sauvegardées:', error)
      }
    }
  }, [])

  // Sauvegarder dans localStorage quand la liste change
  useEffect(() => {
    localStorage.setItem('savedSearches', JSON.stringify(savedSearches))
  }, [savedSearches])

  const saveCurrentSearch = async () => {
    if (!searchName.trim()) return

    setIsLoading(true)
    
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 500))

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName.trim(),
      filters: { ...currentFilters },
      createdAt: new Date().toISOString(),
      isFavorite: false,
      description: generateSearchDescription(currentFilters),
      resultCount: Math.floor(Math.random() * 100) + 1 // Simulé pour la démo
    }

    setSavedSearches(prev => [newSearch, ...prev])
    setSearchName('')
    setIsLoading(false)
  }

  const deleteSearch = (id: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== id))
  }

  const toggleFavorite = (id: string) => {
    setSavedSearches(prev => 
      prev.map(search => 
        search.id === id ? { ...search, isFavorite: !search.isFavorite } : search
      )
    )
  }

  const loadSearch = (search: SavedSearch) => {
    onLoadSearch(search.filters)
    setShowSaved(false)
  }

  const generateSearchDescription = (filters: any): string => {
    const parts = []
    
    if (filters.propertyType) parts.push(`Type: ${filters.propertyType}`)
    if (filters.city) parts.push(`Ville: ${filters.city}`)
    if (filters.minPrice) parts.push(`Prix min: ${filters.minPrice}€`)
    if (filters.maxPrice) parts.push(`Prix max: ${filters.maxPrice}€`)
    if (filters.minSurface) parts.push(`Surface min: ${filters.minSurface}m²`)
    if (filters.buildingClass) parts.push(`Classe: ${filters.buildingClass}`)
    
    return parts.length > 0 ? parts.join(', ') : 'Recherche personnalisée'
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
      {/* Section de sauvegarde */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Save className="h-5 w-5 text-blue-600" />
            Sauvegarder cette recherche
          </CardTitle>
          <CardDescription>
            Sauvegardez vos critères de recherche pour les réutiliser plus tard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nom de la recherche (ex: Bureaux Paris Centre)"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="flex-1"
              maxLength={50}
            />
            <Button 
              onClick={saveCurrentSearch}
              disabled={!searchName.trim() || !hasActiveFilters() || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Sauvegarde...' : 'Sauver'}
            </Button>
          </div>
          
          {!hasActiveFilters() && (
            <p className="text-sm text-gray-500">
              Appliquez des filtres pour pouvoir sauvegarder votre recherche
            </p>
          )}

          {searchName.trim() && (
            <div className="text-sm text-gray-600">
              <p><strong>Aperçu:</strong> {generateSearchDescription(currentFilters)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section des recherches sauvegardées */}
      {savedSearches.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg mt-4">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="h-5 w-5 text-green-600" />
                Recherches sauvegardées
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSaved(!showSaved)}
              >
                {showSaved ? 'Masquer' : `Voir (${savedSearches.length})`}
              </Button>
            </div>
          </CardHeader>
          
          {showSaved && (
            <CardContent className="space-y-3">
              {savedSearches
                .sort((a, b) => {
                  // Mettre les favoris en premier
                  if (a.isFavorite && !b.isFavorite) return -1
                  if (!a.isFavorite && b.isFavorite) return 1
                  // Puis par date (plus récent en premier)
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                })
                .map((search) => (
                  <div
                    key={search.id}
                    className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg border hover:bg-gray-100/80 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {search.name}
                        </h4>
                        {search.isFavorite && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-2">
                        {search.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(search.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                        {search.resultCount && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {search.resultCount} résultats
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadSearch(search)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        Charger
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleFavorite(search.id)}>
                            <Star className={`h-4 w-4 mr-2 ${search.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
                            {search.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteSearch(search.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}
