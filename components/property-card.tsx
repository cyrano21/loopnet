// components/property-card-clean.tsx
'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
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
  Star,
  Building2,
  Store,
  Factory,
  Landmark,
  Home,
  Users
} from 'lucide-react'
import { usePermissions } from '@/hooks/use-permissions'
import { useFavorites } from '@/hooks/use-favorites'
import { PricingModal } from './pricing-modals'
import { toast } from 'sonner'
import { getBestImageUrl } from '@/lib/image-utils'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

// Interface PropertyCardProps
interface PropertyCardProps {
  property: {
    _id: string
    title: string
    slug?: string
    price: number
    address: string
    city: string
    postalCode?: string
    country?: string
    images: {
      url: string
      publicId?: string
      alt?: string
      isPrimary?: boolean
    }[]
    propertyType: string
    transactionType: string
    surface: number
    bedrooms?: number
    bathrooms?: number
    description: string
    status: string
    views?: number
    contactInfo?: {
      name: string
      email: string
      phone: string
    }
    owner?: any
    isPremium?: boolean
    isFeatured?: boolean
    publishedAt?: string | Date
    tags?: string[]
  }
  onAddToComparison?: (property: any) => void
  isInComparison?: boolean
  className?: string
}

// Fonction de formatage de prix locale
const formatPriceInternal = (
  price: number,
  transactionType: string
): string => {
  const isRental =
    transactionType?.toLowerCase().includes('rent') ||
    transactionType?.toLowerCase().includes('lease')
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: isRental && price < 10000 ? 2 : 0
  })
  let formatted = formatter.format(price)
  if (isRental) {
    formatted += '/mo'
  }
  return formatted
}

// Icônes pour les types de propriété
const propertyTypeIcons: Record<string, React.ReactNode> = {
  Office: <Building2 className='w-3.5 h-3.5' />,
  Retail: <Store className='w-3.5 h-3.5' />,
  Commerce: <Landmark className='w-3.5 h-3.5' />,
  Industrial: <Factory className='w-3.5 h-3.5' />,
  Land: <Square className='w-3.5 h-3.5' />,
  Residential: <Home className='w-3.5 h-3.5' />,
  Coworking: <Users className='w-3.5 h-3.5' />,
  Restaurant: <Landmark className='w-3.5 h-3.5' />,
  Medical: <Heart className='w-3.5 h-3.5' />,
  Flex: <Zap className='w-3.5 h-3.5' />,
  Default: <Building2 className='w-3.5 h-3.5' />
}

export function PropertyCard ({
  property,
  onAddToComparison,
  isInComparison,
  className
}: PropertyCardProps) {
  const { can, requiresUpgrade, userRole } = usePermissions()
  const { addToFavorites, removeFromFavorites, favorites } = useFavorites()
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [pricingType, setPricingType] = useState<
    'simple' | 'premium' | 'agent'
  >('premium')
  const [isFavoritedState, setIsFavoritedState] = useState(false)

  // Mise à jour de l'état des favoris
  useEffect(() => {
    if (favorites && property?._id) {
      setIsFavoritedState(
        favorites.some(fav =>
          typeof fav === 'object' && fav !== null
            ? fav._id === property._id
            : fav === property._id
        )
      )
    }
  }, [favorites, property?._id])

  const priceDisplay = formatPriceInternal(
    property.price,
    property.transactionType
  )

  // Gestionnaires d'événements
  const handleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!can('canAddFavorites')) {
      const upgradePlan = requiresUpgrade('canAddFavorites')
      if (upgradePlan && typeof upgradePlan === 'string') {
        setPricingType(upgradePlan as 'simple' | 'premium' | 'agent')
        setShowPricingModal(true)
      } else {
        toast.info('Connexion ou mise à niveau requise pour les favoris.')
      }
      return
    }

    try {
      if (isFavoritedState) {
        await removeFromFavorites(property._id)
        toast.success('Retiré des favoris.')
      } else {
        await addToFavorites(property._id)
        toast.success('Ajouté aux favoris.')
      }
    } catch (error) {
      toast.error('Erreur de mise à jour des favoris.')
      console.error('Fav Error:', error)
    }
  }

  const handleCompare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!can('canCompareProperties')) {
      const upgrade = requiresUpgrade('canCompareProperties')
      if (upgrade && typeof upgrade === 'string') {
        setPricingType(upgrade as 'simple' | 'premium' | 'agent')
        setShowPricingModal(true)
      } else {
        toast.info('Mise à niveau requise pour comparer.')
      }
      return
    }
    onAddToComparison?.(property)
  }

  const handleContact = (type: 'phone' | 'email') => {
    const action = type === 'phone' ? 'canCallSellers' : 'canEmailSellers'
    if (!can(action)) {
      const upgradePlan = requiresUpgrade(action)
      if (upgradePlan && typeof upgradePlan === 'string') {
        setPricingType(upgradePlan as 'simple' | 'premium' | 'agent')
      } else {
        setPricingType('agent')
      }
      setShowPricingModal(true)
      return
    }

    if (type === 'phone' && property.contactInfo?.phone) {
      window.open(`tel:${property.contactInfo.phone}`)
    } else if (type === 'email' && property.contactInfo?.email) {
      window.open(
        `mailto:${property.contactInfo.email}?subject=Info: ${property.title}`
      )
    } else {
      toast.error(`Contact (${type}) non disponible.`)
    }
  }

  const handleViewDetailsClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (!can('canViewPropertyDetails')) {
      const upgradePlan = requiresUpgrade('canViewPropertyDetails')
      if (upgradePlan && typeof upgradePlan === 'string') {
        setPricingType(upgradePlan as 'simple' | 'premium' | 'agent')
        setShowPricingModal(true)
      } else {
        toast.info('Mise à niveau ou connexion requise.')
      }
      return
    }

    window.location.href = `/properties/${property.slug || property._id}`
  }

  const imageUrl =
    getBestImageUrl(property.images, property.propertyType) ||
    `https://via.placeholder.com/400x300/e0e0e0/757575?text=${encodeURIComponent(
      property.propertyType
    )}`
  const imageAlt =
    property.images?.find(img => img.isPrimary)?.alt ||
    property.images?.[0]?.alt ||
    property.title

  const canActuallyViewDetails = can('canViewPropertyDetails')
  const upgradeNeededForDetails = requiresUpgrade('canViewPropertyDetails')
  const showDetailsRestriction =
    !canActuallyViewDetails && !!upgradeNeededForDetails

  const propertyIcon =
    propertyTypeIcons[property.propertyType] || propertyTypeIcons['Default']
  const isNewListing =
    property.publishedAt &&
    new Date(property.publishedAt) >
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  return (
    <>
      <Card
        className={cn(
          'overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-2xl dark:hover:shadow-slate-700/50 flex flex-col h-full',
          'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-card text-card-foreground',
          className
        )}
      >
        <CardHeader className='p-0 relative'>
          <Link
            href={`/properties/${property.slug || property._id}`}
            passHref
            legacyBehavior
          >
            <a
              className='block aspect-[16/10] relative overflow-hidden rounded-t-xl group/image'
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                if (!canActuallyViewDetails) {
                  e.preventDefault()
                  handleViewDetailsClick()
                }
              }}
            >
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className='object-cover transition-transform duration-500 ease-in-out group-hover/image:scale-105'
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                quality={70}
                priority={false}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  ;(
                    e.target as HTMLImageElement
                  ).src = `https://via.placeholder.com/400x300/EEEEEE/CCCCCC?text=Image+Error`
                }}
              />

              {/* Effet de survol sur l'image */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 rounded-t-xl'></div>

              {/* Badges positionnés */}
              <div className='absolute top-3 left-3 z-10 flex flex-col gap-1.5'>
                {property.isPremium === true && (
                  <Badge
                    variant='default'
                    className='bg-amber-400 text-amber-900 border-amber-500 shadow-md text-xs px-2.5 py-1 font-semibold'
                  >
                    <Zap className='w-3.5 h-3.5 mr-1' /> Premium
                  </Badge>
                )}
                {property.isFeatured === true && (
                  <Badge
                    variant='destructive'
                    className='bg-red-500 text-white shadow-md text-xs px-2.5 py-1 font-semibold'
                  >
                    <Star className='w-3.5 h-3.5 mr-1 fill-current' /> Featured
                  </Badge>
                )}
                {isNewListing && (
                  <Badge className='bg-green-500 text-white shadow-md text-xs px-2.5 py-1 font-semibold'>
                    New
                  </Badge>
                )}
                {property.status && property.status.toLowerCase() !== 'active' && (
                  <Badge
                    variant='outline'
                    className='bg-slate-100/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 shadow-md text-xs px-2.5 py-1 font-medium capitalize backdrop-blur-sm'
                  >
                    {property.status}
                  </Badge>
                )}
              </div>

              {/* Bouton Favori avec Tooltip */}
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 backdrop-blur-sm shadow-md transition-all hover:scale-110 active:scale-95 focus-visible:ring-1 focus-visible:ring-blue-500'
                      onClick={handleFavorite}
                    >
                      <Heart
                        className={cn(
                          'w-5 h-5 transition-all',
                          isFavoritedState
                            ? 'fill-red-500 text-red-500'
                            : 'text-slate-600 dark:text-slate-300 group-hover/image:text-red-400'
                        )}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className='bg-slate-800 text-white border-slate-700 text-xs'>
                    <p>
                      {isFavoritedState
                        ? 'Retirer des favoris'
                        : 'Ajouter aux favoris'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </a>
          </Link>
        </CardHeader>

        <CardContent className='p-4 sm:p-5 flex-grow flex flex-col'>
          {/* Titre cliquable */}
          <div
            onClick={() => handleViewDetailsClick()}
            className='cursor-pointer mb-2 group/titleblock'
          >
            <CardTitle className='text-lg sm:text-xl group-hover/titleblock:text-blue-600 dark:group-hover/titleblock:text-blue-400 transition-colors line-clamp-2 leading-snug'>
              {property.title}
            </CardTitle>
          </div>

          <div className='flex items-center text-muted-foreground text-sm mb-3'>
            <MapPin className='h-4 w-4 mr-1.5 flex-shrink-0 text-slate-500 dark:text-slate-400' />
            <span
              className='truncate'
              title={`${property.address}, ${property.city}${
                property.postalCode ? ', ' + property.postalCode : ''
              }`}
            >
              {property.address}, {property.city}
            </span>
          </div>

          {/* Informations clés */}
          <div className='grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-slate-700 dark:text-slate-300 mb-4 border-t border-b border-slate-200 dark:border-slate-700 py-3 my-auto'>
            {' '}
            <div
              className='flex items-center gap-1.5 truncate'
              title={property.propertyType}
            >
              {propertyIcon &&
              typeof propertyIcon === 'object' &&
              'props' in propertyIcon ? (
                <div className='h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0'>
                  {propertyIcon}
                </div>
              ) : (
                <Building2 className='h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0' />
              )}
              <span className='truncate'>{property.propertyType}</span>
            </div>
            <div
              className='flex items-center gap-1.5 truncate'
              title={`${property.surface.toLocaleString()} m²`}
            >
              <Square className='h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0' />
              <span className='truncate'>
                {property.surface.toLocaleString()} m²
              </span>
            </div>
            {property.bedrooms ? (
              <div
                className='flex items-center gap-1.5 truncate'
                title={`${property.bedrooms} chambre(s)`}
              >
                <Bed className='h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0' />
                <span className='truncate'>{property.bedrooms} ch.</span>
              </div>
            ) : (
              <div className='min-h-[1.25rem]' />
            )}
            {property.bathrooms ? (
              <div
                className='flex items-center gap-1.5 truncate'
                title={`${property.bathrooms} salle(s) de bain`}
              >
                <Bath className='h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0' />
                <span className='truncate'>{property.bathrooms} sdb.</span>
              </div>
            ) : (
              <div className='min-h-[1.25rem]' />
            )}
          </div>

          {/* Description courte */}
          {!(can('canViewSellerInfo') && property.contactInfo) &&
            property.description && (
              <p className='text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-4 leading-relaxed flex-grow'>
                {property.description}
              </p>
            )}

          {/* Contact vendeur */}
          {can('canViewSellerInfo') && property.contactInfo ? (
            <div className='bg-slate-50 dark:bg-slate-700/60 p-3 rounded-md mb-1 mt-auto border border-slate-200 dark:border-slate-600 text-xs'>
              <h4 className='font-medium text-slate-600 dark:text-slate-300 mb-1.5'>
                Contact: {property.contactInfo.name}
              </h4>
              <div className='flex gap-2'>
                {property.contactInfo.phone && (
                  <Button
                    size='sm'
                    variant='outline'
                    className='text-xs dark:border-slate-500 dark:hover:bg-slate-600 dark:text-slate-200 hover:bg-slate-100 flex-1'
                    onClick={() => handleContact('phone')}
                  >
                    <Phone className='h-3 w-3 mr-1.5' /> Appeler
                  </Button>
                )}
                {property.contactInfo.email && (
                  <Button
                    size='sm'
                    variant='outline'
                    className='text-xs dark:border-slate-500 dark:hover:bg-slate-600 dark:text-slate-200 hover:bg-slate-100 flex-1'
                    onClick={() => handleContact('email')}
                  >
                    <Mail className='h-3 w-3 mr-1.5' /> Email
                  </Button>
                )}
              </div>
            </div>
          ) : !can('canViewSellerInfo') &&
            requiresUpgrade('canViewSellerInfo') ? (
            <div className='bg-amber-50 dark:bg-amber-900/30 p-2.5 rounded-md mb-1 mt-auto border border-amber-200 dark:border-amber-700 text-xs text-center'>
              <Button
                variant='link'
                className='p-0 h-auto text-amber-600 dark:text-amber-400 text-xs hover:underline font-medium'
                onClick={() => {
                  const plan = requiresUpgrade('canViewSellerInfo')
                  if (typeof plan === 'string')
                    setPricingType(plan as 'simple' | 'premium' | 'agent')
                  else setPricingType('agent')
                  setShowPricingModal(true)
                }}
              >
                <Lock className='h-3 w-3 mr-1.5' /> Voir contact (
                {requiresUpgrade('canViewSellerInfo') || 'Premium'})
              </Button>
            </div>
          ) : null}
        </CardContent>

        <CardFooter className='p-4 sm:p-5 pt-0 mt-auto'>
          <div className='w-full space-y-3 pt-4'>
            <div className='w-full flex items-center justify-between'>
              <div
                className='text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400'
                title={`Prix: ${priceDisplay}`}
              >
                {priceDisplay}
              </div>
              {showDetailsRestriction && (
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 px-2 py-1 h-auto rounded-md font-medium'
                        onClick={() => {
                          const plan = upgradeNeededForDetails
                          if (typeof plan === 'string')
                            setPricingType(
                              plan as 'simple' | 'premium' | 'agent'
                            )
                          else setPricingType('premium')
                          setShowPricingModal(true)
                        }}
                      >
                        <Zap className='h-3.5 w-3.5 mr-1' />{' '}
                        {upgradeNeededForDetails}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className='bg-slate-800 text-white border-slate-700 text-xs'>
                      <p>
                        Mise à niveau vers "{upgradeNeededForDetails}" requise.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            <div className='w-full flex gap-2 items-stretch'>
              <Button
                variant={canActuallyViewDetails ? 'default' : 'secondary'}
                size='sm'
                className='flex-1 transition-colors dark:text-slate-100 shadow-sm hover:shadow-md text-sm py-2.5 rounded-md font-medium'
                onClick={() => handleViewDetailsClick()}
              >
                <Eye className='h-4 w-4 mr-2' />
                {canActuallyViewDetails
                  ? 'Voir détails'
                  : upgradeNeededForDetails
                  ? `Upgrade (${upgradeNeededForDetails})`
                  : 'Accès Restreint'}
              </Button>

              {onAddToComparison && (
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={handleCompare}
                        disabled={
                          isInComparison ||
                          (!can('canCompareProperties') &&
                            !!requiresUpgrade('canCompareProperties'))
                        }
                        className={cn(
                          'w-10 h-9 p-0 flex items-center justify-center transition-all duration-200 dark:border-slate-500 dark:hover:bg-slate-600 shadow-sm hover:shadow-md rounded-md',
                          isInComparison
                            ? 'bg-blue-100 dark:bg-blue-700/50 border-blue-300 dark:border-blue-500 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-600'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        )}
                      >
                        <Scale className='h-4 w-4' />
                        {!can('canCompareProperties') &&
                          requiresUpgrade('canCompareProperties') && (
                            <Lock className='absolute bottom-0.5 right-0.5 h-2.5 w-2.5 text-amber-500' />
                          )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className='bg-slate-800 text-white border-slate-700 text-xs'>
                      <p>
                        {isInComparison
                          ? 'Retirer de la comparaison'
                          : !can('canCompareProperties') &&
                            requiresUpgrade('canCompareProperties')
                          ? `Upgrade (${requiresUpgrade(
                              'canCompareProperties'
                            )}) requis`
                          : 'Ajouter à la comparaison'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {userRole === 'guest' && !canActuallyViewDetails && (
              <div className='w-full text-center pt-1'>
                <Button
                  variant='link'
                  size='sm'
                  className='text-blue-600 dark:text-blue-400 text-xs px-1 h-auto py-1 whitespace-normal hover:underline focus:ring-0 font-medium'
                  onClick={() => {
                    setPricingType('simple')
                    setShowPricingModal(true)
                  }}
                >
                  Créer un compte gratuit pour plus de fonctionnalités
                </Button>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>{' '}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        userType={pricingType}
      />
    </>
  )
}
