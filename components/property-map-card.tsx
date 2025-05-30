'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Share2, Eye, MapPin, Bed, Bath, Square, Calendar } from 'lucide-react'
import { getBestImageUrl } from '@/lib/image-utils'
import { formatPrice } from '@/lib/utils'
import { usePermissions } from '@/hooks/use-permissions'
import { useFavorites } from '@/hooks/use-favorites'
import { useComparison } from '@/components/comparison-provider'

interface PropertyMapCardProps {
  property: any
  isSelected?: boolean
  onClick?: () => void
  compact?: boolean
}

export function PropertyMapCard({ property, isSelected = false, onClick, compact = false }: PropertyMapCardProps) {
  const [imageError, setImageError] = useState(false)
  const { can } = usePermissions()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const comparison = useComparison()

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isFavorite(property._id)) {
      removeFromFavorites(property._id)
    } else {
      addToFavorites(property)
    }
  }

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    comparison.addToComparison(property)
  }

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Découvrez cette propriété: ${property.title}`,
        url: `${window.location.origin}/properties/${property._id}`
      })
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/properties/${property._id}`)
    }
  }

  const imageResult = getBestImageUrl(property.images);
  const imageUrl = imageResult?.url || '/placeholder-property.jpg'
  const isInComparison = comparison.comparisonList.some((p: any) => p._id === property._id)
  const isFav = isFavorite(property._id)

  if (compact) {
    return (
      <div
        className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
          isSelected ? 'bg-blue-50 border-blue-200' : ''
        }`}
        onClick={onClick}
      >
        <div className='flex space-x-3'>
          <div className='w-12 h-12 relative flex-shrink-0'>
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              className='object-cover rounded'
              onError={() => setImageError(true)}
            />
          </div>
          <div className='flex-1 min-w-0'>
            <h4 className='font-medium text-xs truncate'>{property.title}</h4>
            <p className='text-xs text-gray-600 truncate'>
              {property.address}, {property.city}
            </p>
            <div className='flex items-center justify-between mt-1'>
              <span className='text-xs font-semibold text-blue-600'>
                {formatPrice(property.price)}
              </span>
              <Badge variant='outline' className='text-xs'>
                {property.surface} m²
              </Badge>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className='p-0'>
        {/* Image */}
        <div className='relative h-48 overflow-hidden rounded-t-lg'>
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className='object-cover transition-transform duration-200 group-hover:scale-105'
            onError={() => setImageError(true)}
          />
          
          {/* Badges sur l'image */}
          <div className='absolute top-3 left-3 flex flex-col space-y-2'>
            <Badge 
              variant={property.transactionType === 'sale' ? 'default' : 'secondary'}
              className='text-xs'
            >
              {property.transactionType === 'sale' ? 'Vente' : 'Location'}
            </Badge>
            {property.featured && (
              <Badge variant='destructive' className='text-xs'>
                Coup de cœur
              </Badge>
            )}
          </div>

          {/* Actions sur l'image */}
          <div className='absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity'>
            {can('canAddFavorites') && (
              <Button
                variant='secondary'
                size='sm'
                className='h-8 w-8 p-0 bg-white/90 hover:bg-white'
                onClick={handleFavoriteClick}
              >
                <Heart className={`h-4 w-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            )}
            <Button
              variant='secondary'
              size='sm'
              className='h-8 w-8 p-0 bg-white/90 hover:bg-white'
              onClick={handleShareClick}
            >
              <Share2 className='h-4 w-4' />
            </Button>
          </div>

          {/* Prix en overlay */}
          <div className='absolute bottom-3 left-3'>
            <div className='bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1'>
              <span className='text-lg font-bold text-blue-600'>
                {formatPrice(property.price)}
              </span>
              {property.surface && (
                <span className='text-sm text-gray-600 ml-2'>
                  {Math.round(property.price / property.surface)}€/m²
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className='p-4'>
          {/* Titre et localisation */}
          <div className='mb-3'>
            <h3 className='font-semibold text-lg mb-1 line-clamp-1'>
              {property.title}
            </h3>
            <div className='flex items-center text-gray-600 text-sm'>
              <MapPin className='h-4 w-4 mr-1' />
              <span className='line-clamp-1'>
                {property.address}, {property.city}
              </span>
            </div>
          </div>

          {/* Caractéristiques */}
          <div className='flex items-center space-x-4 text-sm text-gray-600 mb-3'>
            <div className='flex items-center'>
              <Square className='h-4 w-4 mr-1' />
              <span>{property.surface} m²</span>
            </div>
            {property.bedrooms && (
              <div className='flex items-center'>
                <Bed className='h-4 w-4 mr-1' />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className='flex items-center'>
                <Bath className='h-4 w-4 mr-1' />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.yearBuilt && (
              <div className='flex items-center'>
                <Calendar className='h-4 w-4 mr-1' />
                <span>{property.yearBuilt}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className='flex flex-wrap gap-1 mb-3'>
            <Badge variant='outline' className='text-xs'>
              {property.propertyType}
            </Badge>
            {property.source && (
              <Badge variant='outline' className='text-xs'>
                {property.source}
              </Badge>
            )}
          </div>

          {/* Description */}
          {property.description && (
            <p className='text-sm text-gray-600 line-clamp-2 mb-3'>
              {property.description}
            </p>
          )}

          {/* Actions */}
          <div className='flex items-center justify-between pt-3 border-t'>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleCompareClick}
                disabled={isInComparison}
                className='text-xs'
              >
                {isInComparison ? 'Ajouté' : 'Comparer'}
              </Button>
            </div>
            
            <div className='flex items-center space-x-2'>
              <Link href={`/properties/${property._id}`} onClick={(e) => e.stopPropagation()}>
                <Button size='sm' className='text-xs'>
                  <Eye className='h-3 w-3 mr-1' />
                  Voir détails
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}