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
  BookmarkPlus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Plus,
  Filter,
  MapPin,
  DollarSign,
  Home,
  Calendar,
  Share,
  Play,
  ChevronLeft
} from 'lucide-react'
import Link from 'next/link'

interface SavedSearch {
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
  category: string
  createdAt: Date
  lastUsed?: Date
  resultsCount?: number
}

export default function SavedSearchesPage () {
  const { can } = usePermissions()
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null)

  // Formulaire pour nouvelle recherche
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
    category: 'personnel'
  })

  const categories = [
    { value: 'personnel', label: 'Personnel', color: 'bg-blue-100 text-blue-700' },
    { value: 'client', label: 'Client', color: 'bg-green-100 text-green-700' },
    { value: 'investissement', label: 'Investissement', color: 'bg-purple-100 text-purple-700' },
    { value: 'veille', label: 'Veille', color: 'bg-orange-100 text-orange-700' }
  ]

  const propertyTypes = [
    { value: 'office', label: 'Bureaux' },
    { value: 'retail', label: 'Commerce' },
    { value: 'industrial', label: 'Industriel' },
    { value: 'apartment', label: 'Résidentiel' },
    { value: 'warehouse', label: 'Entrepôt' },
    { value: 'land', label: 'Terrain' }
  ]

  // Charger les recherches sauvegardées
  useEffect(() => {
    const loadSavedSearches = async () => {
      try {
        const response = await fetch('/api/saved-searches')
        if (response.ok) {
          const data = await response.json()
          setSavedSearches(data.map((search: any) => ({
            ...search,
            createdAt: new Date(search.createdAt),
            lastUsed: search.lastUsed ? new Date(search.lastUsed) : undefined
          })))
        }
      } catch (error) {
        console.error('Erreur lors du chargement des recherches:', error)
        toast.error('Erreur lors du chargement des recherches sauvegardées')
      } finally {
        setIsLoading(false)
      }
    }

    if (can('canSaveSearches')) {
      loadSavedSearches()
    }
  }, [can])

  // Filtrer les recherches
  const filteredSearches = savedSearches.filter(search => {
    const matchesCategory = selectedCategory === 'all' || search.category === selectedCategory
    const matchesQuery = search.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        search.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesQuery
  })

  // Créer ou modifier une recherche
  const handleSaveSearch = async () => {
    try {
      const searchData = {
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
        category: formData.category
      }

      const url = editingSearch ? `/api/saved-searches/${editingSearch.id}` : '/api/saved-searches'
      const method = editingSearch ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchData)
      })

      if (response.ok) {
        const savedSearch = await response.json()
        
        if (editingSearch) {
          setSavedSearches(prev => prev.map(s => 
            s.id === editingSearch.id ? { ...savedSearch, createdAt: new Date(savedSearch.createdAt) } : s
          ))
          toast.success('Recherche modifiée avec succès')
        } else {
          setSavedSearches(prev => [...prev, { ...savedSearch, createdAt: new Date(savedSearch.createdAt) }])
          toast.success('Recherche sauvegardée avec succès')
        }

        setIsCreateDialogOpen(false)
        setEditingSearch(null)
        setFormData({
          name: '', description: '', query: '', type: '', priceMin: '', priceMax: '',
          surfaceMin: '', surfaceMax: '', city: '', zipCode: '', category: 'personnel'
        })
      } else {
        throw new Error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la sauvegarde de la recherche')
    }
  }

  // Supprimer une recherche
  const handleDeleteSearch = async (searchId: string) => {
    try {
      const response = await fetch(`/api/saved-searches/${searchId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSavedSearches(prev => prev.filter(s => s.id !== searchId))
        toast.success('Recherche supprimée avec succès')
      } else {
        throw new Error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la suppression de la recherche')
    }
  }

  // Exécuter une recherche
  const handleExecuteSearch = async (search: SavedSearch) => {
    try {
      // Marquer comme utilisée
      await fetch(`/api/saved-searches/${search.id}/use`, { method: 'POST' })
      
      // Construire l'URL de recherche
      const params = new URLSearchParams()
      if (search.criteria.query) params.append('q', search.criteria.query)
      if (search.criteria.type) params.append('type', search.criteria.type)
      if (search.criteria.priceMin) params.append('price_min', search.criteria.priceMin.toString())
      if (search.criteria.priceMax) params.append('price_max', search.criteria.priceMax.toString())
      if (search.criteria.surfaceMin) params.append('surface_min', search.criteria.surfaceMin.toString())
      if (search.criteria.surfaceMax) params.append('surface_max', search.criteria.surfaceMax.toString())
      if (search.criteria.city) params.append('city', search.criteria.city)
      if (search.criteria.zipCode) params.append('zip_code', search.criteria.zipCode)
      
      // Rediriger vers les résultats
      window.open(`/properties?${params.toString()}`, '_blank')
      
      // Mettre à jour la date de dernière utilisation
      setSavedSearches(prev => prev.map(s => 
        s.id === search.id ? { ...s, lastUsed: new Date() } : s
      ))
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de l\'exécution de la recherche')
    }
  }

  // Modifier une recherche
  const handleEditSearch = (search: SavedSearch) => {
    setEditingSearch(search)
    setFormData({
      name: search.name,
      description: search.description,
      query: search.criteria.query || '',
      type: search.criteria.type || '',
      priceMin: search.criteria.priceMin?.toString() || '',
      priceMax: search.criteria.priceMax?.toString() || '',
      surfaceMin: search.criteria.surfaceMin?.toString() || '',
      surfaceMax: search.criteria.surfaceMax?.toString() || '',
      city: search.criteria.city || '',
      zipCode: search.criteria.zipCode || '',
      category: search.category
    })
    setIsCreateDialogOpen(true)
  }

  // Vérifier si l'utilisateur a la permission d'utiliser cette fonctionnalité
  if (!can('canSaveSearches')) {
    return (
      <AccessRestriction
        action='canSaveSearches'
        requiredLevel='premium'
        showUpgradePrompt={true}
      >
        <div className='container mx-auto py-8 max-w-4xl'>
          <div className="text-center">
            <BookmarkPlus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Recherches Sauvegardées</h1>
            <p className="text-muted-foreground">
              Sauvegardez vos critères de recherche et retrouvez facilement vos recherches favorites.
            </p>
          </div>
        </div>
      </AccessRestriction>
    )
  }

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
          <BookmarkPlus className="mr-3 h-8 w-8 text-blue-600" />
          Recherches Sauvegardées
        </h1>
        <p className="text-muted-foreground">
          Gérez vos critères de recherche et accédez rapidement à vos recherches favorites.
        </p>
      </div>

      {/* Contrôles */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Rechercher dans vos recherches sauvegardées..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle recherche
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSearch ? 'Modifier la recherche' : 'Créer une nouvelle recherche'}
              </DialogTitle>
              <DialogDescription>
                Configurez vos critères de recherche pour les réutiliser facilement.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la recherche *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Bureaux centre-ville Paris"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de cette recherche..."
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
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreateDialogOpen(false)
                  setEditingSearch(null)
                  setFormData({
                    name: '', description: '', query: '', type: '', priceMin: '', priceMax: '',
                    surfaceMin: '', surfaceMax: '', city: '', zipCode: '', category: 'personnel'
                  })
                }}
              >
                Annuler
              </Button>
              <Button onClick={handleSaveSearch} disabled={!formData.name}>
                {editingSearch ? 'Modifier' : 'Sauvegarder'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Liste des recherches */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
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
      ) : filteredSearches.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Aucune recherche trouvée' 
                : 'Aucune recherche sauvegardée'
              }
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== 'all'
                ? 'Essayez de modifier vos filtres ou votre recherche.'
                : 'Commencez par créer votre première recherche sauvegardée.'
              }
            </p>
            {!searchQuery && selectedCategory === 'all' && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Créer ma première recherche
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSearches.map((search) => {
            const category = categories.find(c => c.value === search.category)
            return (
              <Card key={search.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{search.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={category?.color}>
                          {category?.label}
                        </Badge>
                        {search.resultsCount !== undefined && (
                          <Badge variant="outline">
                            {search.resultsCount} résultats
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleExecuteSearch(search)}>
                          <Play className="mr-2 h-4 w-4" />
                          Exécuter
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditSearch(search)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="mr-2 h-4 w-4" />
                          Partager
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteSearch(search.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {search.description && (
                    <CardDescription className="line-clamp-2">
                      {search.description}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Critères de recherche */}
                  <div className="space-y-2 text-sm">
                    {search.criteria.type && (
                      <div className="flex items-center text-muted-foreground">
                        <Home className="mr-2 h-3 w-3" />
                        {propertyTypes.find(t => t.value === search.criteria.type)?.label || search.criteria.type}
                      </div>
                    )}
                    
                    {(search.criteria.priceMin || search.criteria.priceMax) && (
                      <div className="flex items-center text-muted-foreground">
                        <DollarSign className="mr-2 h-3 w-3" />
                        {search.criteria.priceMin && search.criteria.priceMax 
                          ? `${search.criteria.priceMin.toLocaleString()} € - ${search.criteria.priceMax.toLocaleString()} €`
                          : search.criteria.priceMin 
                            ? `À partir de ${search.criteria.priceMin.toLocaleString()} €`
                            : `Jusqu'à ${search.criteria.priceMax?.toLocaleString()} €`
                        }
                      </div>
                    )}
                    
                    {(search.criteria.city || search.criteria.zipCode) && (
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-3 w-3" />
                        {[search.criteria.city, search.criteria.zipCode].filter(Boolean).join(', ')}
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-3" />
                  
                  {/* Métadonnées */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      Créée le {format(search.createdAt, 'dd/MM/yyyy', { locale: fr })}
                    </div>
                    {search.lastUsed && (
                      <div>
                        Utilisée le {format(search.lastUsed, 'dd/MM/yyyy', { locale: fr })}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full mt-3" 
                    onClick={() => handleExecuteSearch(search)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Exécuter la recherche
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
