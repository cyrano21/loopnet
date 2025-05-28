'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Square,
  Eye,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLayout } from '@/components/page-layout'
import { useFavorites } from '@/hooks/use-favorites'
import { useToast } from '@/hooks/use-toast'
import { FreemiumListingGuard } from '@/components/freemium-listing-guard'

interface Property {
  _id: string
  title: string
  description: string
  price: number
  surface: number
  propertyType: string
  transactionType: string
  location: {
    address: string
    city: string
    state: string
    zipCode: string
    coordinates: [number, number]
  }
  images: Array<{
    url: string
    alt?: string
    isPrimary?: boolean
  }>
  features: {
    bedrooms?: number
    bathrooms?: number
    parking?: number
    yearBuilt?: number
    lotSize?: number
  }
  amenities: string[]
  status: string
  views: number
  favorites: number
  inquiries: number
  pricePerSqm: number
  agent: {
    name: string
    phone: string
    email: string
    company: string
    image?: string
  }
  createdAt: string
  updatedAt: string
}

export default function PropertyDetailPage () {
  const params = useParams()
  const { toast } = useToast()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string)
    }
  }, [params.id])

  const fetchProperty = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/properties/${id}`)
      if (!response.ok) {
        throw new Error('Property not found')
      }
      const data = await response.json()
      setProperty(data.property)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteToggle = async () => {
    if (!property) return

    try {
      if (isFavorite(property._id)) {
        await removeFromFavorites(property._id)
        toast({
          title: 'Supprimé des favoris',
          description: 'La propriété a été supprimée de vos favoris.'
        })
      } else {
        await addToFavorites(property._id)
        toast({
          title: 'Ajouté aux favoris',
          description: 'La propriété a été ajoutée à vos favoris.'
        })
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive'
      })
    }
  }

  const formatPrice = (price: number, transactionType: string) => {
    const formatted = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price)
    return transactionType === 'rent' ? `${formatted}/mois` : formatted
  }

  if (loading) {
    return (
      <PageLayout>
        <div className='flex justify-center items-center min-h-[400px]'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        </div>
      </PageLayout>
    )
  }

  if (error || !property) {
    return (
      <PageLayout>
        <div className='text-center py-12'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Propriété non trouvée
          </h1>
          <p className='text-gray-600 mb-6'>
            {error || "Cette propriété n'existe pas ou a été supprimée."}
          </p>
          <Link href='/properties'>
            <Button>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Retour aux propriétés
            </Button>
          </Link>
        </div>
      </PageLayout>
    )
  }

  const primaryImage =
    property.images.find(img => img.isPrimary) || property.images[0]

  return (
    <PageLayout showBackButton={true}>
      <div className='max-w-7xl mx-auto px-4 py-6'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              {property.title}
            </h1>
            <div className='flex items-center text-gray-600'>
              <MapPin className='w-4 h-4 mr-1' />
              <span>
                {property.location.address}, {property.location.city}
              </span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' onClick={handleFavoriteToggle}>
              <Heart
                className={`w-4 h-4 mr-2 ${
                  isFavorite(property._id) ? 'fill-red-500 text-red-500' : ''
                }`}
              />
              {isFavorite(property._id) ? 'Favoris' : 'Ajouter'}
            </Button>
            <Button variant='outline'>
              <Share2 className='w-4 h-4 mr-2' />
              Partager
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Images et détails principaux */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Images */}
            <div className='relative'>
              <div className='aspect-video rounded-lg overflow-hidden'>
                <Image
                  src={
                    property.images[currentImageIndex]?.url ||
                    '/placeholder.svg'
                  }
                  alt={
                    property.images[currentImageIndex]?.alt || property.title
                  }
                  fill
                  className='object-cover'
                />
              </div>
              {property.images.length > 1 && (
                <div className='flex gap-2 mt-4 overflow-x-auto'>
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Voir l'image ${index + 1} de ${
                        property.title
                      }`}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
                        index === currentImageIndex
                          ? 'ring-2 ring-blue-500'
                          : ''
                      }`}
                    >
                      <Image
                        src={image.url || '/placeholder.svg'}
                        alt={image.alt || `Image ${index + 1}`}
                        fill
                        className='object-cover'
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-700 leading-relaxed'>
                  {property.description}
                </p>
              </CardContent>
            </Card>

            {/* Caractéristiques */}
            <Card>
              <CardHeader>
                <CardTitle>Caractéristiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  <div className='text-center'>
                    <Square className='w-6 h-6 mx-auto mb-2 text-blue-600' />
                    <div className='font-semibold'>{property.surface} m²</div>
                    <div className='text-sm text-gray-600'>Surface</div>
                  </div>
                  {property.features.bedrooms && (
                    <div className='text-center'>
                      <div className='font-semibold'>
                        {property.features.bedrooms}
                      </div>
                      <div className='text-sm text-gray-600'>Chambres</div>
                    </div>
                  )}
                  {property.features.bathrooms && (
                    <div className='text-center'>
                      <div className='font-semibold'>
                        {property.features.bathrooms}
                      </div>
                      <div className='text-sm text-gray-600'>
                        Salles de bain
                      </div>
                    </div>
                  )}
                  {property.features.parking && (
                    <div className='text-center'>
                      <div className='font-semibold'>
                        {property.features.parking}
                      </div>
                      <div className='text-sm text-gray-600'>Parking</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Équipements */}
            {property.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Équipements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    {property.amenities.map((amenity, index) => (
                      <Badge key={index} variant='outline'>
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Prix et informations */}
            <Card>
              <CardContent className='p-6'>
                <div className='text-3xl font-bold text-blue-600 mb-4'>
                  {formatPrice(property.price, property.transactionType)}
                </div>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Prix au m²:</span>
                    <span className='font-medium'>
                      {property.pricePerSqm} €/m²
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Type:</span>
                    <span className='font-medium'>{property.propertyType}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Transaction:</span>
                    <span className='font-medium'>
                      {property.transactionType === 'sale'
                        ? 'Vente'
                        : 'Location'}
                    </span>
                  </div>
                  {property.features.yearBuilt && (
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Année:</span>
                      <span className='font-medium'>
                        {property.features.yearBuilt}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Agent */}
            <Card>
              <CardHeader>
                <CardTitle>Agent immobilier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center gap-3 mb-4'>
                  {property.agent.image && (
                    <Image
                      src={property.agent.image || '/placeholder.svg'}
                      alt={property.agent.name}
                      width={48}
                      height={48}
                      className='rounded-full'
                    />
                  )}
                  <div>
                    <div className='font-semibold'>{property.agent.name}</div>
                    <div className='text-sm text-gray-600'>
                      {property.agent.company}
                    </div>
                  </div>
                </div>
                <FreemiumListingGuard action='contact'>
                  <div className='space-y-2'>
                    <Button className='w-full' size='sm'>
                      <Phone className='w-4 h-4 mr-2' />
                      Appeler
                    </Button>
                    <Button variant='outline' className='w-full' size='sm'>
                      <Mail className='w-4 h-4 mr-2' />
                      Email
                    </Button>
                    <Button variant='outline' className='w-full' size='sm'>
                      <MessageSquare className='w-4 h-4 mr-2' />
                      Message
                    </Button>
                  </div>
                </FreemiumListingGuard>
              </CardContent>
            </Card>

            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <Eye className='w-4 h-4 mr-2 text-gray-400' />
                      <span className='text-sm'>Vues</span>
                    </div>
                    <span className='font-medium'>{property.views}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <Heart className='w-4 h-4 mr-2 text-gray-400' />
                      <span className='text-sm'>Favoris</span>
                    </div>
                    <span className='font-medium'>{property.favorites}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <MessageSquare className='w-4 h-4 mr-2 text-gray-400' />
                      <span className='text-sm'>Demandes</span>
                    </div>
                    <span className='font-medium'>{property.inquiries}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
