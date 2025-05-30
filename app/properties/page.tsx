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
import { Grid3X3, List, Map, Filter } from 'lucide-react'

export default function PropertiesPage () {
  const searchParams = useSearchParams()
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
    agent: '',
    page: 1
  })

  // Initialiser les filtres depuis les paramètres URL
  useEffect(() => {
    const agentParam = searchParams.get('agent')
    if (agentParam) {
      setFilters(prev => ({ ...prev, agent: agentParam }))
    }
  }, [searchParams])

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
    // Convert string values to numbers for numeric filters
    let processedValue = value
    if (
      ['minPrice', 'maxPrice', 'minSurface', 'maxSurface', 'rooms'].includes(
        key
      )
    ) {
      processedValue =
        value === '' || value === null || value === undefined
          ? undefined
          : Number(value)
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
    <div className='container mx-auto py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold mb-2'>Propriétés Commerciales</h1>
        <div className='flex items-center justify-between'>
          <p className='text-gray-600'>
            {limitedProperties.length} propriétés affichées - Vue par défaut
            {maxViewLimit && ` (${viewedProperties}/${maxViewLimit} vues)`}
          </p>

          {/* Limite de vues */}
          {maxViewLimit && (
            <UsageLimit
              limitType='maxPropertiesView'
              currentUsage={viewedProperties}
              label='Propriétés vues'
            />
          )}
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
              Créez un compte gratuit pour voir plus de propriétés et accéder à
              plus de fonctionnalités.
            </p>
          </div>
        </div>
      )}

      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Sidebar avec filtres */}
        <div className='lg:w-1/4'>
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

        {/* Contenu principal */}
        <div className='lg:w-3/4'>
          {/* Barre de recherche */}
          <div className='mb-6'>
            <SearchBar
              onSearch={searchFilters => {
                handleFilterChange('q', searchFilters.query)
                handleFilterChange('city', searchFilters.location)
                handleFilterChange('propertyType', searchFilters.propertyType)
                handleFilterChange('minPrice', searchFilters.minPrice)
                handleFilterChange('maxPrice', searchFilters.maxPrice)
              }}
            />
          </div>

          {/* Barre d'outils avec sélecteur de vue */}
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border'>
            <div className='flex items-center gap-2'>
              <Filter className='h-4 w-4 text-gray-500' />
              <span className='text-sm text-gray-600 dark:text-gray-300'>
                {properties.length} propriété{properties.length > 1 ? 's' : ''} trouvée{properties.length > 1 ? 's' : ''}
              </span>
            </div>
            
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600 dark:text-gray-300 mr-2'>Affichage:</span>
              <div className='flex rounded-lg border overflow-hidden'>
                <Button
                  variant='default'
                  size='sm'
                  className='rounded-none border-r'
                  asChild
                >
                  <Link href='/properties/grid-view' className='flex items-center gap-2'>
                    <Grid3X3 className='h-4 w-4' />
                    Grille
                  </Link>
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='rounded-none border-r'
                  asChild
                >
                  <Link href='/properties/list-view' className='flex items-center gap-2'>
                    <List className='h-4 w-4' />
                    Liste
                  </Link>
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='rounded-none'
                  asChild
                >
                  <Link href='/properties/map-view' className='flex items-center gap-2'>
                    <Map className='h-4 w-4' />
                    Carte
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Résultats */}
          {limitedProperties.length === 0 && !isAtViewLimit ? (
            <div className='text-center py-12'>
              <h3 className='text-xl font-semibold mb-2'>
                Aucune propriété trouvée
              </h3>
              <p className='text-gray-600'>
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          ) : (
            <>
              {/* Grille des propriétés - Vue par défaut */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8'>
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
                  <div className='text-center py-8'>
                    <p className='text-gray-600'>
                      Vous avez atteint votre limite de visualisation de
                      propriétés.
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
  )
}
