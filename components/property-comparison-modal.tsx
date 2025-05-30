'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Bed, Bath, Square, Calendar, Heart } from 'lucide-react'
import Image from 'next/image'
import { Property } from '@/types/property'
import { getBestImageUrl } from '@/lib/image-utils'

interface PropertyComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  properties: Property[]
  onRemove: (id: string) => void
}

export function PropertyComparisonModal ({
  isOpen,
  onClose,
  properties,
  onRemove
}: PropertyComparisonModalProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  const calculatePricePerSqFt = (price: number, surface?: number) => {
    if (!surface || surface === 0) return 'N/A'
    return (price / surface).toFixed(2)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-7xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            Comparaison de Propriétés ({properties.length})
          </DialogTitle>
        </DialogHeader>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {properties.map(property => (
            <div
              key={property._id}
              className='border rounded-lg overflow-hidden'
            >
              {/* Image */}
              <div className='relative h-48'>
                <Image
                  src={getBestImageUrl(property.images, property.propertyType)?.url || '/placeholder-property.jpg'}
                  alt={property.title}
                  fill
                  className='object-cover'
                />
                <Badge className='absolute top-2 left-2 bg-blue-600'>
                  {property.propertyType}
                </Badge>
                <Button
                  variant='destructive'
                  size='sm'
                  className='absolute top-2 right-2'
                  onClick={() => onRemove(property._id)}
                >
                  Retirer
                </Button>
              </div>

              {/* Contenu */}
              <div className='p-4 space-y-4'>
                {/* Titre et prix */}
                <div>
                  <h3 className='font-semibold text-lg line-clamp-2 mb-2'>
                    {property.title}
                  </h3>
                  <div className='text-2xl font-bold text-blue-600'>
                    {formatPrice(property.price)}
                  </div>
                  <div className='text-sm text-gray-600'>
                    ${calculatePricePerSqFt(property.price, property.surface)}
                    /sq ft
                  </div>
                </div>

                {/* Localisation */}
                <div className='flex items-start gap-2'>
                  <MapPin className='h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0' />
                  <div className='text-sm text-gray-600'>
                    <div>{property.address}</div>
                    <div>
                      {property.city}, {property.postalCode}
                    </div>
                  </div>
                </div>

                {/* Caractéristiques */}
                <div className='space-y-2'>
                  {property.surface && (
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-gray-600'>Surface:</span>
                      <span className='font-medium flex items-center'>
                        <Square className='h-4 w-4 mr-1' />
                        {property.surface.toLocaleString()} sq ft
                      </span>
                    </div>
                  )}

                  {property.bedrooms && (
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-gray-600'>Chambres:</span>
                      <span className='font-medium flex items-center'>
                        <Bed className='h-4 w-4 mr-1' />
                        {property.bedrooms}
                      </span>
                    </div>
                  )}

                  {property.bathrooms && (
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-gray-600'>Salles de bain:</span>
                      <span className='font-medium flex items-center'>
                        <Bath className='h-4 w-4 mr-1' />
                        {property.bathrooms}
                      </span>
                    </div>
                  )}

                  {property.yearBuilt && (
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-gray-600'>Année:</span>
                      <span className='font-medium flex items-center'>
                        <Calendar className='h-4 w-4 mr-1' />
                        {property.yearBuilt}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className='flex gap-2 pt-2'>
                  <Button size='sm' className='flex-1'>
                    Voir Détails
                  </Button>
                  <Button size='sm' variant='outline'>
                    <Heart className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé de comparaison */}
        <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
          <h4 className='font-semibold mb-3'>Résumé de la Comparaison</h4>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
            <div>
              <span className='text-gray-600'>Prix le plus bas:</span>
              <div className='font-semibold text-green-600'>
                {formatPrice(Math.min(...properties.map(p => p.price)))}
              </div>
            </div>
            <div>
              <span className='text-gray-600'>Prix le plus élevé:</span>
              <div className='font-semibold text-red-600'>
                {formatPrice(Math.max(...properties.map(p => p.price)))}
              </div>
            </div>
            {properties.some(p => p.surface) && (
              <div>
                <span className='text-gray-600'>Surface moyenne:</span>
                <div className='font-semibold'>
                  {Math.round(
                    properties
                      .filter(p => p.surface)
                      .reduce((acc, p) => acc + (p.surface || 0), 0) /
                      properties.filter(p => p.surface).length
                  ).toLocaleString()}{' '}
                  sq ft
                </div>
              </div>
            )}
            {properties.some(p => p.surface) && (
              <div>
                <span className='text-gray-600'>Prix moyen/sq ft:</span>
                <div className='font-semibold'>
                  $
                  {Math.round(
                    properties
                      .filter(p => p.surface)
                      .reduce(
                        (acc, p) => acc + (p.surface ? p.price / p.surface : 0),
                        0
                      ) / properties.filter(p => p.surface).length
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
