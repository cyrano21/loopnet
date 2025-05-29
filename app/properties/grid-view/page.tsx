'use client'

import { useState, useEffect } from 'react'
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
import { Grid, List, Map, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'

export default function GridViewPage() {
  const [filters, setFilters] = useState({
    transactionType: '',
    propertyType: '',
    source: '',
    city: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    minSurface: undefined as number | undefined,
    maxSurface: undefined as number | undefined,
    rooms: undefined as number | undefined,
    sort: 'newest',
    q: '',
    page: 1
  })

  const [viewMode, setViewMode] = useState<'grid-2' | 'grid-3' | 'grid-4'>('grid-3')
  const [showFilters, setShowFilters] = useState(false)
  const [viewedProperties, setViewedProperties] = useState(0)
  
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
    if (['minPrice', 'maxPrice', 'minSurface', 'maxSurface', 'rooms'].includes(key)) {
      processedValue = value === '' || value === null || value === undefined ? undefined : Number(value)
    }
    setFilters(prev => ({ ...prev, [key]: processedValue, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  useEffect(() => {
    if (properties.length > 0) {
      setViewedProperties(prev => prev + properties.length)
    }
  }, [properties])

  const getGridCols = () => {
    switch (viewMode) {
      case 'grid-2': return 'grid-cols-1 md:grid-cols-2'
      case 'grid-3': return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
      case 'grid-4': return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
      default: return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
    }
  }

  if (loading) {
    return (
      <div className='container mx-auto py-8'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto py-8'>
        <div className='text-red-600 text-center p-4'>
          Erreur lors du chargement des propriétés: {error}
        </div>
      </div>
    )
  }

  const isAtViewLimit = maxViewLimit && viewedProperties >= maxViewLimit

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Breadcrumb */}
      <div className='bg-white border-b'>
        <div className='container mx-auto py-4'>
          <nav className='flex items-center space-x-2 text-sm text-gray-600'>
            <Link href='/' className='hover:text-blue-600'>Accueil</Link>
            <span>/</span>
            <Link href='/properties' className='hover:text-blue-600'>Propriétés</Link>
            <span>/</span>
            <span className='text-gray-900'>Vue Grille</span>
          </nav>
          <h1 className='text-2xl font-bold mt-2'>Propriétés Commerciales - Vue Grille</h1>
          <p className='text-gray-600 mt-1'>
            {limitedProperties.length} propriétés trouvées
            {maxViewLimit && ` (${viewedProperties}/${maxViewLimit} vues)`}
          </p>
        </div>
      </div>

      <div className='container mx-auto py-6'>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Sidebar avec filtres */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='font-semibold'>Filtres</h3>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowFilters(false)}
                  className='lg:hidden'
                >
                  ×
                </Button>
              </div>
              <AccessRestriction
                action='canUseAdvancedSearch'
                fallback={
                  <div className='text-sm text-gray-500 p-4 border rounded'>
                    Filtres basiques seulement
                  </div>
                }
              >
                <PropertyFilters onFilterChange={handleFilterChange} />
              </AccessRestriction>
            </div>
          </div>

          {/* Contenu principal */}
          <div className='lg:w-3/4'>
            {/* Barre de recherche et contrôles */}
            <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
              <SearchBar
                onSearch={searchFilters => {
                  handleFilterChange('q', searchFilters.query)
                  handleFilterChange('city', searchFilters.location)
                  handleFilterChange('propertyType', searchFilters.propertyType)
                  handleFilterChange('minPrice', searchFilters.minPrice)
                  handleFilterChange('maxPrice', searchFilters.maxPrice)
                }}
              />
              
              {/* Contrôles de vue */}
              <div className='flex items-center justify-between mt-4 pt-4 border-t'>
                <div className='flex items-center space-x-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setShowFilters(true)}
                    className='lg:hidden'
                  >
                    <SlidersHorizontal className='h-4 w-4 mr-2' />
                    Filtres
                  </Button>
                  
                  {/* Limite de vues */}
                  {maxViewLimit && (
                    <UsageLimit
                      limitType='maxPropertiesView'
                      currentUsage={viewedProperties}
                      label='Propriétés vues'
                    />
                  )}
                </div>

                <div className='flex items-center space-x-2'>
                  {/* Sélecteur de vue */}
                  <div className='flex items-center space-x-1 border rounded-lg p-1'>
                    <Button
                      variant={viewMode === 'grid-2' ? 'default' : 'ghost'}
                      size='sm'
                      onClick={() => setViewMode('grid-2')}
                    >
                      <Grid className='h-4 w-4' />
                      2
                    </Button>
                    <Button
                      variant={viewMode === 'grid-3' ? 'default' : 'ghost'}
                      size='sm'
                      onClick={() => setViewMode('grid-3')}
                    >
                      <Grid className='h-4 w-4' />
                      3
                    </Button>
                    <Button
                      variant={viewMode === 'grid-4' ? 'default' : 'ghost'}
                      size='sm'
                      onClick={() => setViewMode('grid-4')}
                    >
                      <Grid className='h-4 w-4' />
                      4
                    </Button>
                  </div>

                  {/* Liens vers autres vues */}
                  <div className='flex items-center space-x-1 border rounded-lg p-1'>
                    <Button variant='default' size='sm'>
                      <Grid className='h-4 w-4' />
                    </Button>
                    <Link href='/properties/list-view'>
                      <Button variant='ghost' size='sm'>
                        <List className='h-4 w-4' />
                      </Button>
                    </Link>
                    <Link href='/properties/map-view'>
                      <Button variant='ghost' size='sm'>
                        <Map className='h-4 w-4' />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerte pour les utilisateurs non connectés */}
            {userRole === 'guest' && (
              <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-800">
                    Créez un compte gratuit pour voir plus de propriétés et accéder à plus de fonctionnalités.
                  </p>
                </div>
              </div>
            )}

            {/* Résultats */}
            {limitedProperties.length === 0 && !isAtViewLimit ? (
              <div className='bg-white rounded-lg shadow-sm p-12 text-center'>
                <h3 className='text-xl font-semibold mb-2'>
                  Aucune propriété trouvée
                </h3>
                <p className='text-gray-600'>
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            ) : (
              <>
                {/* Grille des propriétés */}
                <div className={`grid ${getGridCols()} gap-4 md:gap-6 mb-8`}>
                  {limitedProperties.map(property => (
                    <PropertyCard
                      key={property._id}
                      property={property}
                      onAddToComparison={comparison.addToComparison}
                      isInComparison={comparison.comparisonList.some(
                        (p: any) => p._id === property._id
                      )}
                    />
                  ))}
                </div>

                {/* Message de limite atteinte */}
                {isAtViewLimit && (
                  <AccessRestriction action='maxPropertiesView'>
                    <div className='bg-white rounded-lg shadow-sm p-8 text-center'>
                      <p className='text-gray-600'>
                        Vous avez atteint votre limite de visualisation de propriétés.
                      </p>
                    </div>
                  </AccessRestriction>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && !isAtViewLimit && (
                  <div className='flex justify-center'>
                    <CustomPagination
                      currentPage={filters.page}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
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