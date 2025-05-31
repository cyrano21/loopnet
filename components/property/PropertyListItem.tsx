'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  MapPin, 
  Square, 
  Users, 
  Car, 
  Building2, 
  Heart, 
  Share2,
  Eye,
  Calendar,
  Star
} from 'lucide-react'
import { Property } from '@/types/property'
import { getPropertyImageUrl, getPropertyIcon } from '@/lib/property-image-utils'

interface PropertyListItemProps {
  property: Property
  onFavorite?: (id: string) => void
  onShare?: (property: Property) => void
  onAddToComparison?: (property: Property) => void
  isFavorite?: boolean
  isInComparison?: boolean
}

export function PropertyListItem({ 
  property, 
  onFavorite, 
  onShare, 
  onAddToComparison,
  isFavorite = false,
  isInComparison = false
}: PropertyListItemProps) {const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">          {/* Image */}
          <div className="md:w-1/3 relative">
            <Link href={`/property/${property._id}`}>
              <div className="relative h-48 md:h-full min-h-[200px]"><Image
                  src={getPropertyImageUrl(property)}
                  alt={property.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  {/* Badges sur l'image */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  {property.isFeatured && (
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Vedette
                    </Badge>
                  )}
                  {property.isPremium && (
                    <Badge className="bg-green-500 text-white">Premium</Badge>
                  )}
                  <Badge variant="secondary" className="bg-white/90 text-gray-800">
                    {property.propertyType}
                  </Badge>
                </div>

                {/* Actions sur l'image */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 hover:bg-white border-none shadow-md"                    onClick={(e) => {
                      e.preventDefault()
                      onFavorite?.(property._id)
                    }}
                  >
                    <Heart 
                      className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 hover:bg-white border-none shadow-md"
                    onClick={(e) => {
                      e.preventDefault()
                      onShare?.(property)
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Link>
          </div>

          {/* Contenu */}
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start mb-4">              <div className="flex-1">
                <Link href={`/property/${property._id}`}>
                  <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                    {property.title}
                  </h3>
                </Link>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">{property.address}, {property.city}</span>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {property.description}
                </p>
              </div>
              
              <div className="text-right ml-4">                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatPrice(property.price)}
                </div>
                {property.transactionType === 'rent' && (
                  <div className="text-sm text-gray-500">/mois</div>
                )}
                {property.surface && (
                  <div className="text-sm text-gray-500">
                    {Math.round(property.price / property.surface)}€/m²
                  </div>
                )}
              </div>
            </div>

            {/* Caractéristiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center text-gray-600">
                <Square className="h-4 w-4 mr-2 text-blue-500" />
                <div>
                  <div className="text-sm font-medium">{property.surface}m²</div>
                  <div className="text-xs">Surface</div>
                </div>
              </div>
              
              {property.rooms && (
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2 text-green-500" />
                  <div>
                    <div className="text-sm font-medium">{property.rooms}</div>
                    <div className="text-xs">Pièces</div>
                  </div>
                </div>
              )}
              
              {property.bedrooms && (
                <div className="flex items-center text-gray-600">
                  <Building2 className="h-4 w-4 mr-2 text-purple-500" />
                  <div>
                    <div className="text-sm font-medium">{property.bedrooms}</div>
                    <div className="text-xs">Chambres</div>
                  </div>
                </div>
              )}
              
              {property.parking && (
                <div className="flex items-center text-gray-600">
                  <Car className="h-4 w-4 mr-2 text-orange-500" />
                  <div>
                    <div className="text-sm font-medium">{property.parking}</div>
                    <div className="text-xs">Parking</div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer avec statistiques et actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {property.views || 0}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(property.createdAt || Date.now()).toLocaleDateString('fr-FR')}
                </div>              </div>
              
              <div className="flex items-center space-x-2">
                {onAddToComparison && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onAddToComparison(property)}
                    disabled={isInComparison}
                    className="text-sm"
                  >
                    {isInComparison ? 'Ajouté' : 'Comparer'}
                  </Button>
                )}
                <Link href={`/property/${property._id}`}>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Voir détails
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
