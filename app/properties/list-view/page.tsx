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
import { Grid, List, Map, SlidersHorizontal, MapPin, Bed, Bath, Square, Heart, Eye, Phone, Mail } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getBestImageUrl } from '@/lib/image-utils'
import { formatPrice } from '@/lib/utils'

export default function ListViewPage() {
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
            <span className='text-gray-900'>Vue Liste</span>
          </nav>
          <h1 className='text-2xl font-bold mt-2'>Propriétés Commerciales - Vue Liste</h1>
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
                  {/* Liens vers autres vues */}
                  <div className='flex items-center space-x-1 border rounded-lg p-1'>
                    <Link href='/properties/grid-view'>
                      <Button variant='ghost' size='sm'>
                        <Grid className='h-4 w-4' />
                      </Button>
                    </Link>
                    <Button variant='default' size='sm'>
                      <List className='h-4 w-4' />
                    </Button>
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
                {/* Liste des propriétés */}
                <div className='space-y-4 mb-8'>
                  {limitedProperties.map(property => (
                    <Card key={property._id} className='overflow-hidden hover:shadow-md transition-shadow'>
                      <CardContent className='p-0'>
                        <div className='flex flex-col md:flex-row'>
                          {/* Image */}
                          <div className='md:w-1/3 relative h-48 md:h-auto'>
                            <Image
                              src={getBestImageUrl(property.images) || '/placeholder-property.jpg'}
                              alt={property.title}
                              fill
                              className='object-cover'
                            />
                            <div className='absolute top-2 left-2'>
                              <Badge variant='secondary' className='bg-white/90'>
                                {property.transactionType === 'sale' ? 'Vente' : 'Location'}
                              </Badge>
                            </div>
                            <div className='absolute top-2 right-2'>
                              <Button variant='ghost' size='sm' className='bg-white/90 hover:bg-white'>
                                <Heart className='h-4 w-4' />
                              </Button>
                            </div>
                          </div>

                          {/* Contenu */}
                          <div className='md:w-2/3 p-6'>
                            <div className='flex justify-between items-start mb-2'>
                              <div>
                                <Link href={`/properties/${property._id}`}>
                                  <h3 className='text-lg font-semibold hover:text-blue-600 transition-colors'>
                                    {property.title}
                                  </h3>
                                </Link>
                                <div className='flex items-center text-gray-600 text-sm mt-1'>
                                  <MapPin className='h-4 w-4 mr-1' />
                                  {property.address}, {property.city}
                                </div>
                              </div>
                              <div className='text-right'>
                                <div className='text-2xl font-bold text-blue-600'>
                                  {formatPrice(property.price)}
                                </div>
                                <div className='text-sm text-gray-600'>
                                  {property.surface && `${Math.round(property.price / property.surface)}€/m²`}
                                </div>
                              </div>
                            </div>

                            <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
                              {property.description}
                            </p>

                            {/* Métadonnées */}
                            <div className='flex items-center space-x-4 mb-4 text-sm text-gray-600'>
                              <div className='flex items-center'>
                                <Square className='h-4 w-4 mr-1' />
                                {property.surface} m²
                              </div>
                              {property.bedrooms && (
                                <div className='flex items-center'>
                                  <Bed className='h-4 w-4 mr-1' />
                                  {property.bedrooms} ch.
                                </div>
                              )}
                              {property.bathrooms && (
                                <div className='flex items-center'>
                                  <Bath className='h-4 w-4 mr-1' />
                                  {property.bathrooms} sdb
                                </div>
                              )}
                              {property.views && (
                                <div className='flex items-center'>
                                  <Eye className='h-4 w-4 mr-1' />
                                  {property.views} vues
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center space-x-2'>
                                <Badge variant='outline'>
                                  {property.propertyType}
                                </Badge>
                                <Badge variant='outline' className='text-green-600 border-green-600'>
                                  {property.status}
                                </Badge>
                              </div>
                              
                              <div className='flex items-center space-x-2'>
                                {property.contactInfo && (
                                  <>
                                    {property.contactInfo.phone && (
                                      <Button variant='outline' size='sm'>
                                        <Phone className='h-4 w-4 mr-1' />
                                        Appeler
                                      </Button>
                                    )}
                                    {property.contactInfo.email && (
                                      <Button variant='outline' size='sm'>
                                        <Mail className='h-4 w-4 mr-1' />
                                        Email
                                      </Button>
                                    )}
                                  </>
                                )}
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => comparison.addToComparison(property)}
                                  disabled={comparison.comparisonList.some((p: any) => p._id === property._id)}
                                >
                                  Comparer
                                </Button>
                                <Link href={`/properties/${property._id}`}>
                                  <Button size='sm'>
                                    Voir détails
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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