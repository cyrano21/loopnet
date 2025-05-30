'use client'

import { useState, useEffect } from 'react'
import { SearchBar } from '@/components/ui/SearchBar'
import { CustomPagination } from '@/components/custom-pagination'
import { useProperties } from '@/hooks/use-properties'
import { usePermissions } from '@/hooks/use-permissions'
import { PropertyFilters } from '@/components/property-filters'
import { useComparison } from '@/components/comparison-provider'
import { UsageLimit } from '@/components/usage-limit'
import { AccessRestriction } from '@/components/access-restriction'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Grid, List, Map, SlidersHorizontal, MapPin, Maximize2, Minimize2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getBestImageUrl } from '@/lib/image-utils'
import { formatPrice } from '@/lib/utils'

// Composant de carte simple (à remplacer par une vraie carte comme Mapbox ou Google Maps)
const MapComponent = ({ properties, onPropertySelect, selectedProperty }: {
  properties: any[]
  onPropertySelect: (property: any) => void
  selectedProperty: any
}) => {
  return (
    <div className='relative w-full h-full bg-gray-100 rounded-lg overflow-hidden'>
      {/* Placeholder pour la carte */}
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='text-center'>
          <MapPin className='h-12 w-12 mx-auto text-gray-400 mb-2' />
          <p className='text-gray-600'>Carte interactive</p>
          <p className='text-sm text-gray-500'>{properties.length} propriétés</p>
        </div>
      </div>
      
      {/* Marqueurs simulés */}
      <div className='absolute inset-0'>
        {properties.slice(0, 10).map((property, index) => (
          <div
            key={property._id}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
              selectedProperty?._id === property._id ? 'z-20' : 'z-10'
            }`}
            style={{
              left: `${20 + (index % 5) * 15}%`,
              top: `${20 + Math.floor(index / 5) * 20}%`
            }}
            onClick={() => onPropertySelect(property)}
          >
            <div className={`px-2 py-1 rounded-full text-xs font-medium shadow-lg ${
              selectedProperty?._id === property._id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-900 border'
            }`}>
              {formatPrice(property.price)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MapViewPage() {
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

  const [showFilters, setShowFilters] = useState(false)
  const [viewedProperties, setViewedProperties] = useState(0)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [isMapFullscreen, setIsMapFullscreen] = useState(false)
  
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

  const handlePropertySelect = (property: any) => {
    setSelectedProperty(property)
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
    <div className='min-h-screen bg-gray-50'>
      {/* Breadcrumb */}
      <div className='bg-white border-b'>
        <div className='container mx-auto py-4'>
          <nav className='flex items-center space-x-2 text-sm text-gray-600'>
            <Link href='/' className='hover:text-blue-600'>Accueil</Link>
            <span>/</span>
            <Link href='/properties' className='hover:text-blue-600'>Propriétés</Link>
            <span>/</span>
            <span className='text-gray-900'>Vue Carte</span>
          </nav>
          <h1 className='text-2xl font-bold mt-2'>Propriétés Commerciales - Vue Carte</h1>
          <p className='text-gray-600 mt-1'>
            {limitedProperties.length} propriétés trouvées
            {maxViewLimit && ` (${viewedProperties}/${maxViewLimit} vues)`}
          </p>
        </div>
      </div>

      <div className={`${isMapFullscreen ? 'fixed inset-0 z-50 bg-white' : 'container mx-auto py-6'}`}>
        <div className={`flex flex-col ${isMapFullscreen ? 'h-full' : 'lg:flex-row gap-6'}`}>
          {/* Sidebar avec filtres */}
          {!isMapFullscreen && (
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
          )}

          {/* Contenu principal */}
          <div className={`${isMapFullscreen ? 'flex-1 flex flex-col' : 'lg:w-3/4'}`}>
            {/* Barre de recherche et contrôles */}
            <div className={`bg-white shadow-sm p-6 mb-6 ${isMapFullscreen ? 'rounded-none' : 'rounded-lg'}`}>
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
                  {!isMapFullscreen && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setShowFilters(true)}
                      className='lg:hidden'
                    >
                      <SlidersHorizontal className='h-4 w-4 mr-2' />
                      Filtres
                    </Button>
                  )}
                  
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
                  {/* Bouton plein écran */}
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setIsMapFullscreen(!isMapFullscreen)}
                  >
                    {isMapFullscreen ? (
                      <Minimize2 className='h-4 w-4' />
                    ) : (
                      <Maximize2 className='h-4 w-4' />
                    )}
                  </Button>

                  {/* Liens vers autres vues */}
                  <div className='flex items-center space-x-1 border rounded-lg p-1'>
                    <Link href='/properties/grid-view'>
                      <Button variant='ghost' size='sm'>
                        <Grid className='h-4 w-4' />
                      </Button>
                    </Link>
                    <Link href='/properties/list-view'>
                      <Button variant='ghost' size='sm'>
                        <List className='h-4 w-4' />
                      </Button>
                    </Link>
                    <Button variant='default' size='sm'>
                      <Map className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerte pour les utilisateurs non connectés */}
            {userRole === 'guest' && !isMapFullscreen && (
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

            {/* Contenu carte */}
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
                {/* Vue carte avec liste */}
                <div className={`flex ${isMapFullscreen ? 'flex-1' : 'h-[600px]'} gap-4`}>
                  {/* Carte */}
                  <div className={`${isMapFullscreen ? 'flex-1' : 'flex-1'} relative`}>
                    <MapComponent
                      properties={limitedProperties}
                      onPropertySelect={handlePropertySelect}
                      selectedProperty={selectedProperty}
                    />
                  </div>

                  {/* Liste des propriétés */}
                  <div className={`${isMapFullscreen ? 'w-96' : 'w-80'} bg-white rounded-lg shadow-sm overflow-hidden`}>
                    <div className='p-4 border-b'>
                      <h3 className='font-semibold'>Propriétés ({limitedProperties.length})</h3>
                    </div>
                    <div className='overflow-y-auto h-full'>
                      {limitedProperties.map(property => (
                        <div
                          key={property._id}
                          className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedProperty?._id === property._id ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                          onClick={() => handlePropertySelect(property)}
                        >
                          <div className='flex space-x-3'>
                            <div className='w-16 h-16 relative flex-shrink-0'>
                              <Image
                                src={getBestImageUrl(property.images)?.url || '/placeholder-property.jpg'}
                                alt={property.title}
                                fill
                                className='object-cover rounded'
                              />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <h4 className='font-medium text-sm truncate'>{property.title}</h4>
                              <p className='text-xs text-gray-600 truncate'>
                                {property.address}, {property.city}
                              </p>
                              <div className='flex items-center justify-between mt-1'>
                                <span className='text-sm font-semibold text-blue-600'>
                                  {formatPrice(property.price)}
                                </span>
                                <Badge variant='outline' className='text-xs'>
                                  {property.surface} m²
                                </Badge>
                              </div>
                              <div className='flex items-center space-x-2 mt-1'>
                                <Badge variant='secondary' className='text-xs'>
                                  {property.propertyType}
                                </Badge>
                                <Badge variant='outline' className='text-xs'>
                                  {property.transactionType === 'sale' ? 'Vente' : 'Location'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Détails de la propriété sélectionnée */}
                {selectedProperty && (
                  <div className='mt-6 bg-white rounded-lg shadow-sm p-6'>
                    <div className='flex items-start justify-between mb-4'>
                      <div>
                        <h3 className='text-xl font-semibold'>{selectedProperty.title}</h3>
                        <p className='text-gray-600'>{selectedProperty.address}, {selectedProperty.city}</p>
                      </div>
                      <div className='text-right'>
                        <div className='text-2xl font-bold text-blue-600'>
                          {formatPrice(selectedProperty.price)}
                        </div>
                        <div className='text-sm text-gray-600'>
                          {selectedProperty.surface && `${Math.round(selectedProperty.price / selectedProperty.surface)}€/m²`}
                        </div>
                      </div>
                    </div>
                    
                    <p className='text-gray-600 mb-4 line-clamp-3'>
                      {selectedProperty.description}
                    </p>
                    
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-4 text-sm text-gray-600'>
                        <span>{selectedProperty.surface} m²</span>
                        {selectedProperty.bedrooms && <span>{selectedProperty.bedrooms} ch.</span>}
                        {selectedProperty.bathrooms && <span>{selectedProperty.bathrooms} sdb</span>}
                      </div>
                      
                      <div className='flex items-center space-x-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => comparison.addToComparison(selectedProperty)}
                          disabled={comparison.comparisonList.some((p: any) => p._id === selectedProperty._id)}
                        >
                          Comparer
                        </Button>
                        <Link href={`/properties/${selectedProperty._id}`}>
                          <Button size='sm'>
                            Voir détails
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Message de limite atteinte */}
                {isAtViewLimit && (
                  <AccessRestriction action='maxPropertiesView'>
                    <div className='bg-white rounded-lg shadow-sm p-8 text-center mt-6'>
                      <p className='text-gray-600'>
                        Vous avez atteint votre limite de visualisation de propriétés.
                      </p>
                    </div>
                  </AccessRestriction>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}