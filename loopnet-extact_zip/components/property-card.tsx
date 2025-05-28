'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Scale,
  Phone,
  Mail,
  Eye,
  Lock,
  Zap,
  Star
} from 'lucide-react'
import { usePermissions } from '@/hooks/use-permissions'
import { AccessRestriction } from './access-restriction'
import { useState } from 'react'
import { PricingModal } from '@/components/pricing-modals'
import { toast } from 'sonner'
import { useFavorites } from '@/hooks/use-favorites'
import { useAuth } from '@/hooks/use-auth'

// Type pour les plans de pricing
type PlanType = 'simple' | 'premium' | 'agent'

interface PropertyCardProps {
  property: {
    _id: string
    title: string
    price: number
    location?: {
      address: string
      city: string
      state: string
    }
    address?: string
    city?: string
    images: string[] | { url: string; alt?: string; isPrimary?: boolean }[]
    propertyType: string
    size?: number
    surface?: number
    bedrooms?: number
    bathrooms?: number
    description: string
    contactInfo?: {
      name: string
      email: string
      phone: string
    }
    isPremium?: boolean
    isFeatured?: boolean
    slug?: string
  }
  onAddToComparison?: (property: any) => void
  isInComparison?: boolean
}

export function PropertyCard ({
  property,
  onAddToComparison,
  isInComparison
}: PropertyCardProps) {
  // Corriger la déstructuration selon la vraie structure de usePermissions
  const { can, limit, userRole, isAdmin } = usePermissions()
  const { isAuthenticated, user } = useAuth()
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [pricingType, setPricingType] = useState<PlanType>('premium')
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()

  const isPremiumProperty = property.isPremium === true

  // Déclarer les variables d'image et de type de propriété
  const getImageUrl = (): string | undefined => {
    if (
      !property.images ||
      !Array.isArray(property.images) ||
      property.images.length === 0
    ) {
      return undefined
    }

    // Si l'image est une chaîne, on la renvoie directement
    if (typeof property.images[0] === 'string') {
      return property.images[0]
    }

    // Si c'est un objet avec une propriété url
    if (
      property.images[0] &&
      typeof property.images[0] === 'object' &&
      'url' in property.images[0]
    ) {
      return property.images[0].url
    }

    return undefined
  }

  const imageUrl = getImageUrl()
  const propertyType = property.propertyType?.toLowerCase() || 'default'

  // Utiliser can directement depuis usePermissions
  const canViewThisPropertyDetails = can('canViewPropertyDetails')
  const canViewSellerInfo = can('canViewSellerInfo')
  const canAddThisToFavorites = can('canAddFavorites')
  const canCompareThisProperty = can('canCompareProperties')

  // Pour les upgrades, utiliser limit pour vérifier si une limite est atteinte
  const viewLimit = limit('maxPropertiesView')
  const favoriteLimit = limit('maxFavorites')
  const compareLimit = limit('maxComparisons')

  // Logique simplifiée pour déterminer si un upgrade est nécessaire
  const needsUpgradeForDetails = !canViewThisPropertyDetails
  const needsUpgradeForFavorites = !canAddThisToFavorites
  const needsUpgradeForCompare = !canCompareThisProperty
  const needsUpgradeForSellerInfo = !canViewSellerInfo

  // Afficher une restriction si la propriété est premium ET l'utilisateur n'a pas la permission
  const showDetailsRestriction =
    (isPremiumProperty && !canViewThisPropertyDetails) || needsUpgradeForDetails
  const showSellerInfoRestriction =
    (isPremiumProperty && !canViewSellerInfo) || needsUpgradeForSellerInfo

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price)
  }

  /**
   * Get the most appropriate image URL for the property
   * (Déplacé plus haut dans le code pour résoudre les problèmes de portée)
   */

  const getLocation = () => {
    if (property.location) {
      return `${property.location.address || ''}, ${property.location.city}, ${
        property.location.state || ''
      }`
        .replace(/^,|,$/g, '')
        .trim()
    }
    return `${property.address || ''}, ${property.city || 'Lieu non spécifié'}`
      .replace(/^,|,$/g, '')
      .trim()
  }

  const getSize = () => property.surface || property.size || 0

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour gérer les favoris.')
      return
    }
    if (!canAddThisToFavorites) {
      setPricingType('premium')
      setShowPricingModal(true)
      return
    }

    try {
      if (isFavorite(property._id)) {
        await removeFromFavorites(property._id)
        toast.success('Retiré des favoris')
      } else {
        await addToFavorites(property._id)
        toast.success('Ajouté aux favoris')
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des favoris')
    }
  }

  const handleCompare = () => {
    if (!isAuthenticated && userRole !== 'guest') {
      toast.error('Veuillez vous connecter pour comparer les propriétés.')
      return
    }
    if (!canCompareThisProperty) {
      setPricingType('premium')
      setShowPricingModal(true)
      return
    }
    onAddToComparison?.(property)
  }

  const handleViewDetails = () => {
    if (showDetailsRestriction) {
      if (needsUpgradeForDetails) {
        setPricingType('premium')
        setShowPricingModal(true)
      } else if (!isAuthenticated) {
        toast.info('Veuillez vous connecter pour voir les détails.')
      } else {
        toast.error(
          "Vous n'avez pas la permission de voir les détails de cette propriété."
        )
      }
      return
    }
    // Navigation vers les détails
    window.location.href = `/properties/${property.slug || property._id}`
  }

  const handleContact = (type: 'phone' | 'email') => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour contacter le vendeur.')
      return
    }
    if (!canViewSellerInfo) {
      setPricingType('agent')
      setShowPricingModal(true)
      return
    }

    if (!property.contactInfo) {
      toast.error('Aucune information de contact disponible.')
      return
    }

    if (type === 'phone' && property.contactInfo.phone) {
      window.location.href = `tel:${property.contactInfo.phone}`
    } else if (type === 'email' && property.contactInfo.email) {
      window.location.href = `mailto:${property.contactInfo.email}?subject=Demande d'information pour la propriété: ${property.title}`
    } else {
      toast.error(`Information de contact (${type}) non disponible.`)
    }
  }

  return (
    <>
      <Card className='overflow-hidden hover:shadow-lg transition-shadow group'>
        <div className='relative h-48 w-full overflow-hidden rounded-t-lg'>
          <ImageWithFallback
            src={imageUrl}
            alt={property.title || 'Image de la propriété'}
            fallbackType='property'
            fallbackSubType={propertyType}
            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
            width={400}
            height={300}
            priority
          />
          {isPremiumProperty && (
            <Badge className='absolute top-2 left-2 bg-amber-500'>
              <Zap className='h-3 w-3 mr-1' /> Premium
            </Badge>
          )}
          {property.isFeatured && (
            <Badge className='absolute top-2 right-12 bg-blue-600'>
              <Star className='h-3 w-3 mr-1' /> En Vedette
            </Badge>
          )}

          {/* Bouton Favoris */}
          <Button
            size='sm'
            variant='secondary'
            className='absolute top-2 right-2 p-2'
            onClick={handleFavorite}
            aria-label={
              isFavorite(property._id)
                ? 'Retirer des favoris'
                : 'Ajouter aux favoris'
            }
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite(property._id)
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-400'
              }`}
            />
          </Button>
        </div>

        <CardContent className='p-4'>
          <h3 className='font-semibold text-lg mb-2 line-clamp-2'>
            {property.title}
          </h3>

          <div className='flex items-center text-gray-600 mb-2'>
            <MapPin className='h-4 w-4 mr-1' />
            <span className='text-sm'>{getLocation()}</span>
          </div>

          <p className='text-gray-600 text-sm line-clamp-2 mb-3'>
            {property.description}
          </p>

          <div className='flex items-center gap-4 text-sm text-gray-600 mb-4'>
            {property.bedrooms && (
              <div className='flex items-center'>
                <Bed className='h-4 w-4 mr-1' />
                {property.bedrooms}
              </div>
            )}
            {property.bathrooms && (
              <div className='flex items-center'>
                <Bath className='h-4 w-4 mr-1' />
                {property.bathrooms}
              </div>
            )}
            <div className='flex items-center'>
              <Square className='h-4 w-4 mr-1' />
              {getSize().toLocaleString()} sq ft
            </div>
          </div>

          {/* Informations vendeur - Restreintes */}
          {isAuthenticated &&
          canViewSellerInfo &&
          !showSellerInfoRestriction &&
          property.contactInfo ? (
            <div className='bg-blue-50 p-3 rounded-lg mb-4'>
              <h4 className='font-semibold text-sm mb-2'>Contact</h4>
              <p className='text-sm'>{property.contactInfo.name}</p>
              <div className='flex gap-2 mt-2'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => handleContact('phone')}
                >
                  <Phone className='h-3 w-3 mr-1' />
                  Appeler
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => handleContact('email')}
                >
                  <Mail className='h-3 w-3 mr-1' />
                  Email
                </Button>
              </div>
            </div>
          ) : showSellerInfoRestriction ? (
            <div className='bg-gray-50 p-3 rounded-lg mb-4'>
              <div className='flex items-center gap-2 text-gray-500'>
                <Lock className='h-4 w-4' />
                <span className='text-sm'>
                  {needsUpgradeForSellerInfo
                    ? 'Mettre à niveau pour voir le contact'
                    : 'Informations vendeur disponibles pour les agents'}
                </span>
              </div>
            </div>
          ) : null}
        </CardContent>

        <CardFooter className='p-4 pt-0 space-y-3'>
          <div className='w-full flex items-center justify-between'>
            <div className='text-2xl font-bold text-blue-600'>
              {formatPrice(property.price)}
            </div>

            {/* Badge de rôle requis */}
            {needsUpgradeForDetails && (
              <Badge variant='outline' className='text-xs'>
                <Zap className='h-3 w-3 mr-1' /> Premium requis
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className='w-full flex gap-2'>
            <Button
              variant={showDetailsRestriction ? 'secondary' : 'default'}
              size='sm'
              className='flex-1'
              onClick={handleViewDetails}
            >
              <Eye className='h-4 w-4 mr-1' />
              {showDetailsRestriction
                ? needsUpgradeForDetails
                  ? 'Mettre à niveau'
                  : 'Accès restreint'
                : 'Voir détails'}
            </Button>

            <Button
              variant='outline'
              size='sm'
              onClick={handleCompare}
              disabled={isInComparison}
              className={`min-w-[100px] ${isInComparison ? 'bg-blue-100' : ''}`}
            >
              <Scale className='h-4 w-4 mr-1' />
              {isInComparison ? 'Comparé' : 'Comparer'}
              {needsUpgradeForCompare && <Lock className='h-3 w-3 ml-1' />}
            </Button>
          </div>

          {/* Message d'upgrade */}
          {userRole === 'guest' && (
            <div className='w-full text-center'>
              <Button
                variant='link'
                size='sm'
                className='text-blue-600'
                onClick={() => {
                  setPricingType('simple')
                  setShowPricingModal(true)
                }}
              >
                Créer un compte gratuit pour plus de fonctionnalités
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        userType={pricingType}
      />
    </>
  )
}
