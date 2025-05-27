'use client'

import { useState, useEffect } from 'react'
import { SearchBar } from '@/components/ui/SearchBar'
import { Pagination } from '@/components/ui/Pagination'
import { PropertyCard } from '@/components/property-card'
import { useProperties } from '@/hooks/use-properties'
import { usePermissions } from '@/hooks/use-permissions'
import { Sidebar } from '@/components/ui/sidebar'
import { useComparison } from '@/components/comparison-provider'
import { UsageLimit } from '@/components/usage-limit'
import { AccessRestriction } from '@/components/access-restriction'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

export default function PropertiesPage () {
  const [filters, setFilters] = useState({
    transactionType: '',
    propertyType: '',
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
            {limitedProperties.length} propriétés affichées
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
        <Alert className='mb-6'>
          <Info className='h-4 w-4' />
          <AlertDescription>
            Créez un compte gratuit pour voir plus de propriétés et accéder à
            plus de fonctionnalités.
          </AlertDescription>
        </Alert>
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
            <Sidebar onFilterChange={handleFilterChange} />
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
              {/* Grille des propriétés */}
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8'>
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
                  <Pagination
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
