'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useProperties } from '@/hooks/use-properties'
import { useAuth } from '@/hooks/use-auth'
import { PropertyCard } from '@/components/property-card'
import { CustomPagination } from '@/components/custom-pagination'
import { RoleGuard } from '@/components/role-guard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  SlidersHorizontal,
  Grid3X3,
  List,
  ArrowUpDown,
  Loader2
} from 'lucide-react'

export default function AgentPropertiesPage() {
  const { user, isAgent } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  
  // Filtres pour les propriétés de l'agent
  const [filters, setFilters] = useState({
    agent: user?.id || '',
    q: '',
    status: '',
    sort: 'newest',
    page: 1,
    limit: 12
  })

  // Mettre à jour les filtres lorsque l'utilisateur change
  useEffect(() => {
    if (user?.id) {
      setFilters(prev => ({ ...prev, agent: user.id }))
    }
  }, [user?.id])

  // Mettre à jour les filtres lorsque les paramètres de recherche changent
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
    if (key === 'page') {
      setCurrentPage(value)
    }
  }

  // Appliquer la recherche
  const handleSearch = () => {
    handleFilterChange('q', searchQuery)
  }

  // Appliquer le filtre de statut
  const handleStatusChange = (value: string) => {
    setStatus(value)
    handleFilterChange('status', value === 'all' ? '' : value)
  }

  // Appliquer le tri
  const handleSortChange = (value: string) => {
    setSortBy(value)
    handleFilterChange('sort', value)
  }

  // Récupérer les propriétés de l'agent
  const { properties, loading, error, pagination } = useProperties(filters)

  return (
    <RoleGuard allowedRoles={['agent']} message="Vous devez être un agent pour accéder à cette page.">
      <div className="w-full px-4 py-8">
        <div className="flex flex-col space-y-8">
          {/* En-tête */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Mes propriétés</h1>
              <p className="text-gray-500 mt-1">
                Gérez vos annonces immobilières et suivez leurs performances
              </p>
            </div>
            <Button asChild>
              <a href="/agent-dashboard/properties/new">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une propriété
              </a>
            </Button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total des annonces
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pagination?.total || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Annonces actives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {properties.filter(p => p.status === 'active').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Vues totales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {properties.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Demandes reçues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {properties.reduce((sum, p) => sum + (p.inquiries || 0), 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres et recherche */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Input
                placeholder="Rechercher dans mes propriétés..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actives</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="draft">Brouillons</SelectItem>
                  <SelectItem value="sold">Vendues</SelectItem>
                  <SelectItem value="rented">Louées</SelectItem>
                  <SelectItem value="expired">Expirées</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Plus récentes</SelectItem>
                  <SelectItem value="oldest">Plus anciennes</SelectItem>
                  <SelectItem value="price_asc">Prix croissant</SelectItem>
                  <SelectItem value="price_desc">Prix décroissant</SelectItem>
                  <SelectItem value="views">Plus vues</SelectItem>
                  <SelectItem value="inquiries">Plus de demandes</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Liste des propriétés */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Chargement des propriétés...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Une erreur est survenue lors du chargement des propriétés.</p>
              <Button variant="outline" className="mt-4" onClick={() => handleFilterChange('page', 1)}>
                Réessayer
              </Button>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <Building2 className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Aucune propriété trouvée</h3>
              <p className="mt-2 text-gray-500">
                Vous n'avez pas encore ajouté de propriétés ou aucune ne correspond à vos filtres.
              </p>
              <Button className="mt-4" asChild>
                <a href="/agent-dashboard/properties/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une propriété
                </a>
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : 
              "flex flex-col space-y-4"
            }>
              {properties.map((property) => (
                <PropertyCard 
                  key={property._id} 
                  property={property} 
                  className={viewMode === 'list' ? 'flex-row h-auto' : ''}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.total > 0 && (
            <div className="flex justify-center mt-8">
              <CustomPagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(page) => handleFilterChange('page', page)}
              />
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  )
}