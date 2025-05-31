'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { SearchBar } from '@/components/ui/SearchBar'
import { CustomPagination } from '@/components/custom-pagination'
import { PropertyCard } from '@/components/property-card'
import { useProperties } from '@/hooks/use-properties'
import { usePermissions } from '@/hooks/use-permissions'
import { PropertyFilters } from '@/components/property-filters'
import { useComparison } from '@/components/comparison-provider'
import { UsageLimit } from '@/components/usage-limit'
import { AccessRestriction } from '@/components/access-restriction'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { SavedSearches } from '@/components/property/SavedSearches'
import { SearchAnalytics } from '@/components/property/SearchAnalytics'
import { SearchAlerts } from '@/components/property/SearchAlerts'
import { GridSizeSelector } from '@/components/property/GridSizeSelector'
import { 
  Grid3X3, 
  List, 
  Map, 
  SlidersHorizontal, 
  ArrowLeft, 
  LayoutGrid, 
  LayoutList,
  Search,
  Filter,
  Eye,
  Building2,
  Star,
  TrendingUp,
  Calendar,
  Car,
  Heart,
  Share2,
  X
} from 'lucide-react'

type GridSize = '1' | '2' | '3' | '4' | '5'
type SortBy = 'newest' | 'oldest' | 'price-low' | 'price-high' | 'size-large' | 'size-small' | 'trending' | 'featured'

export default function GridViewPage() {
  const searchParams = useSearchParams()
  const [gridSize, setGridSize] = useState<GridSize>('3')
  const [sortBy, setSortBy] = useState<SortBy>('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewedProperties, setViewedProperties] = useState(0)
  
  const [filters, setFilters] = useState({
    transactionType: searchParams.get('transactionType') || '',
    propertyType: searchParams.get('propertyType') || '',
    source: '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined as number | undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined as number | undefined,
    minSurface: undefined as number | undefined,
    maxSurface: undefined as number | undefined,
    rooms: undefined as number | undefined,
    sort: 'newest' as SortBy,
    q: searchParams.get('q') || '',
    agent: '',
    page: 1,
    // Nouveaux filtres avancés
    availability: '',
    buildingClass: '',
    parking: undefined as number | undefined,
    yearBuilt: {
      min: undefined as number | undefined,
      max: undefined as number | undefined
    },
    features: [] as string[],
    neighborhood: '',
    pricePerSqft: {
      min: undefined as number | undefined,
      max: undefined as number | undefined
    },
    distance: undefined as number | undefined,
    lastUpdated: '',
    verified: false,
    featured: false
  })

  // Données pour les filtres rapides
  const quickFilters = [
    { label: 'Nouveautés', key: 'lastUpdated', value: 'today', icon: Calendar },
    { label: 'En vedette', key: 'featured', value: true, icon: Star },
    { label: 'Vérifiées', key: 'verified', value: true, icon: Eye },
    { label: 'Classe A', key: 'buildingClass', value: 'A', icon: Building2 },
    { label: 'Avec parking', key: 'parking', value: 1, icon: Car },
    { label: 'Tendances', key: 'sort', value: 'trending', icon: TrendingUp }
  ]

  // Initialiser les filtres depuis les paramètres URL
  useEffect(() => {
    const agentParam = searchParams.get('agent')
    if (agentParam) {
      setFilters(prev => ({ ...prev, agent: agentParam }))
    }
  }, [searchParams])
  
  const { properties, loading, error, pagination } = useProperties(filters)
  const { can, limit, userRole } = usePermissions()
  const comparison = useComparison()

  const maxViewLimit = limit('maxPropertiesView')

  // Limiter les propriétés affichées selon les permissions
  const limitedProperties = maxViewLimit
    ? properties.slice(0, Math.max(0, maxViewLimit - viewedProperties))
    : properties

  const handleFilterChange = (key: string, value: any) => {
    let processedValue = value
    if (['minPrice', 'maxPrice', 'minSurface', 'maxSurface', 'rooms', 'parking'].includes(key)) {
      processedValue = value === '' || value === null || value === undefined ? undefined : Number(value)
    }
    
    // Handle nested objects
    if (key.includes('.')) {
      const [parent, child] = key.split('.')
      setFilters(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: processedValue
        },
        page: 1
      }))
    } else if (key === 'features') {
      setFilters(prev => ({
        ...prev,
        features: prev.features.includes(value)
          ? prev.features.filter(f => f !== value)
          : [...prev.features, value],
        page: 1
      }))
    } else {
      setFilters(prev => ({ ...prev, [key]: processedValue, page: 1 }))
    }
  }

  const handleQuickFilter = (key: string, value: any) => {
    if (key === 'sort') {
      setSortBy(value)
      setFilters(prev => ({ ...prev, sort: value, page: 1 }))
    } else {
      handleFilterChange(key, value)
    }
  }

  const clearFilters = () => {
    setFilters({
      transactionType: '',
      propertyType: '',
      source: '',
      city: '',
      minPrice: undefined,
      maxPrice: undefined,
      minSurface: undefined,
      maxSurface: undefined,
      rooms: undefined,
      sort: 'newest',
      q: '',
      agent: '',
      page: 1,
      availability: '',
      buildingClass: '',
      parking: undefined,
      yearBuilt: { min: undefined, max: undefined },
      features: [],
      neighborhood: '',
      pricePerSqft: { min: undefined, max: undefined },
      distance: undefined,
      lastUpdated: '',
      verified: false,
      featured: false
    })
    setSearchQuery('')
    setSortBy('newest')
    setGridSize('3')
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
    setViewedProperties(prev => prev + properties.length)
  }

  const getGridClasses = (size: GridSize): string => {
    switch (size) {
      case '1': return 'grid-cols-1'
      case '2': return 'grid-cols-1 md:grid-cols-2'
      case '3': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case '4': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      case '5': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  useEffect(() => {
    if (!loading && properties.length > 0) {
      setViewedProperties(prev => prev + properties.length)
    }
  }, [loading, properties])

  const isAtViewLimit = maxViewLimit && viewedProperties >= maxViewLimit

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20'>
        <div className='container mx-auto py-8'>
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20'>
        <div className='container mx-auto py-8'>
          <div className='text-red-600 text-center p-4'>
            Erreur lors du chargement des propriétés: {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20'>
      {/* Header moderne avec gradient */}
      <div className='bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white'>
        <div className='container mx-auto py-8'>
          <nav className='flex items-center space-x-2 text-sm text-blue-100 mb-4'>
            <Link href='/' className='hover:text-white transition-colors'>Accueil</Link>
            <span>/</span>
            <Link href='/properties' className='hover:text-white transition-colors'>Propriétés</Link>
            <span>/</span>
            <span className='text-white'>Vue Grille</span>
          </nav>
          
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold mb-2'>Propriétés Commerciales - Vue Grille</h1>
              <p className='text-blue-100'>
                {limitedProperties.length} propriétés trouvées
                {maxViewLimit && ` (${viewedProperties}/${maxViewLimit} vues)`}
              </p>
            </div>
            
            <div className='flex items-center space-x-3'>
              <Button variant='outline' className='border-white/20 bg-white/10 hover:bg-white/20 text-white'>
                <Search className='h-4 w-4 mr-2' />
                Recherche avancée
              </Button>
              <Link href='/properties'>
                <Button variant='outline' className='border-white/20 bg-white/10 hover:bg-white/20 text-white'>
                  <ArrowLeft className='h-4 w-4 mr-2' />
                  Retour
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto py-6'>
        {/* Filtres rapides */}
        <div className='mb-6'>
          <div className='flex flex-wrap gap-2'>
            {quickFilters.map((filter) => {
              const Icon = filter.icon
              const isActive = filter.key === 'sort' ? sortBy === filter.value : filters[filter.key as keyof typeof filters] === filter.value
              
              return (
                <Button
                  key={filter.label}
                  variant={isActive ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => handleQuickFilter(filter.key, filter.value)}
                  className={`${isActive ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'} transition-all duration-200`}
                >
                  <Icon className='h-4 w-4 mr-2' />
                  {filter.label}
                </Button>
              )
            })}
            
            <Button
              variant='outline'
              size='sm'
              onClick={clearFilters}
              className='hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200'
            >
              <X className='h-4 w-4 mr-2' />
              Effacer filtres
            </Button>
          </div>
        </div>

        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Sidebar avec filtres */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className='bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='font-semibold text-gray-900 flex items-center'>
                  <Filter className='h-4 w-4 mr-2 text-blue-600' />
                  Filtres
                </h3>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowFilters(false)}
                  className='lg:hidden'
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
              
              <AccessRestriction
                action='canUseAdvancedSearch'
                fallback={
                  <div className='text-sm text-gray-500 p-4 border rounded-lg bg-gray-50'>
                    <SlidersHorizontal className='h-4 w-4 mb-2 text-gray-400' />
                    Filtres basiques seulement
                  </div>
                }
              >
                <PropertyFilters 
                  onFilterChange={handleFilterChange} 
                />
              </AccessRestriction>

              {/* Composants de recherche avancée */}
              <div className="mt-6 space-y-4">
                <SavedSearches
                  currentFilters={filters}
                  onLoadSearch={(loadedFilters) => {
                    setFilters(loadedFilters)
                    // Synchroniser les autres états
                    if (loadedFilters.sort) setSortBy(loadedFilters.sort)
                  }}
                />
                
                <SearchAnalytics
                  filters={filters}
                  resultCount={limitedProperties.length}
                />
                
                <SearchAlerts
                  currentFilters={filters}
                />
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className='lg:w-3/4'>
            {/* Barre de recherche et contrôles */}
            <div className='bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-6'>
              <SearchBar
                onSearch={searchFilters => {
                  handleFilterChange('q', searchFilters.query)
                  handleFilterChange('city', searchFilters.location)
                  handleFilterChange('propertyType', searchFilters.propertyType)
                  handleFilterChange('minPrice', searchFilters.minPrice)
                  handleFilterChange('maxPrice', searchFilters.maxPrice)
                }}
              />
              
              {/* Barre d'outils avancée */}
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 pt-6 border-t border-gray-200 gap-4'>
                <div className='flex items-center space-x-3'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setShowFilters(true)}
                    className='lg:hidden'
                  >
                    <SlidersHorizontal className='h-4 w-4 mr-2' />
                    Filtres
                  </Button>
                  
                  {/* Taille de grille */}
                  <GridSizeSelector
                    value={gridSize}
                    onChange={setGridSize}
                  />

                  {/* Tri */}
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm font-medium text-gray-700'>Trier par:</span>
                    <Select value={sortBy} onValueChange={(value: SortBy) => {
                      setSortBy(value)
                      handleFilterChange('sort', value)
                    }}>
                      <SelectTrigger className='w-40'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='newest'>Plus récent</SelectItem>
                        <SelectItem value='oldest'>Plus ancien</SelectItem>
                        <SelectItem value='price-low'>Prix croissant</SelectItem>
                        <SelectItem value='price-high'>Prix décroissant</SelectItem>
                        <SelectItem value='size-large'>Surface décroissante</SelectItem>
                        <SelectItem value='size-small'>Surface croissante</SelectItem>
                        <SelectItem value='trending'>Tendance</SelectItem>
                        <SelectItem value='featured'>En vedette</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='flex items-center space-x-2'>
                  {/* Limite de vues */}
                  {maxViewLimit && (
                    <UsageLimit
                      limitType='maxPropertiesView'
                      currentUsage={viewedProperties}
                      label='Propriétés vues'
                    />
                  )}

                  {/* Liens vers autres vues */}
                  <div className='flex items-center space-x-1 bg-gray-100 rounded-lg p-1'>
                    <Button variant='default' size='sm' className='bg-blue-600 hover:bg-blue-700'>
                      <LayoutGrid className='h-4 w-4' />
                    </Button>
                    <Link href='/properties/list-view'>
                      <Button variant='ghost' size='sm' className='hover:bg-white'>
                        <LayoutList className='h-4 w-4' />
                      </Button>
                    </Link>
                    <Link href='/properties/map-view'>
                      <Button variant='ghost' size='sm' className='hover:bg-white'>
                        <Map className='h-4 w-4' />
                      </Button>
                    </Link>
                    <Link href='/properties'>
                      <Button variant='ghost' size='sm' className='hover:bg-white'>
                        <Grid3X3 className='h-4 w-4' />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerte pour les utilisateurs non connectés */}
            {userRole === 'guest' && (
              <div className="mb-6 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 p-2 mr-4">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">Débloquez plus de fonctionnalités</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Créez un compte gratuit pour voir plus de propriétés et accéder à plus de fonctionnalités.
                    </p>
                  </div>
                  <Button className="ml-auto bg-blue-600 hover:bg-blue-700">
                    S'inscrire
                  </Button>
                </div>
              </div>
            )}

            {/* Résultats */}
            {limitedProperties.length === 0 && !isAtViewLimit ? (
              <div className='bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-12 text-center'>
                <div className='mb-4'>
                  <Search className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                </div>
                <h3 className='text-xl font-semibold mb-2 text-gray-900'>
                  Aucune propriété trouvée
                </h3>
                <p className='text-gray-600 mb-6'>
                  Essayez de modifier vos critères de recherche pour voir plus de résultats
                </p>
                <Button onClick={clearFilters} variant='outline'>
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <>
                {/* Grille des propriétés avec animation */}
                <div className={`grid ${getGridClasses(gridSize)} gap-4 md:gap-6 mb-8`}>
                  {limitedProperties.map((property, index) => (
                    <div 
                      key={property._id} 
                      className="animate-fadeIn opacity-0"
                      onAnimationEnd={(e) => e.currentTarget.classList.remove('opacity-0')}
                    >
                      <PropertyCard
                        property={property}
                        onAddToComparison={comparison.addToComparison}
                        isInComparison={comparison.comparisonList.some(
                          (p: any) => p._id === property._id
                        )}
                      />
                    </div>
                  ))}
                </div>

                {/* Message de limite atteinte */}
                {isAtViewLimit && (
                  <AccessRestriction action='maxPropertiesView'>
                    <div className='bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8 text-center'>
                      <div className='mb-4'>
                        <Eye className='h-12 w-12 text-amber-500 mx-auto' />
                      </div>
                      <h3 className='text-xl font-semibold mb-2 text-gray-900'>
                        Limite de visualisation atteinte
                      </h3>
                      <p className='text-gray-600 mb-6'>
                        Vous avez atteint votre limite de visualisation de propriétés. 
                        Mettez à niveau votre compte pour voir plus de propriétés.
                      </p>
                      <Button className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'>
                        Mettre à niveau
                      </Button>
                    </div>
                  </AccessRestriction>
                )}

                {/* Pagination moderne */}
                {pagination && pagination.totalPages > 1 && !isAtViewLimit && (
                  <div className='flex justify-center'>
                    <div className='bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4'>
                      <CustomPagination
                        currentPage={filters.page}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}