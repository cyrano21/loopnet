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
  MessageSquare,
  Calendar,
  DollarSign,
  Building,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLayout } from '@/components/page-layout'
import { useFavorites } from '@/hooks/use-favorites'
import { useToast } from '@/hooks/use-toast'

interface MockProperty {
  id: string
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
    floors?: number
    tenants?: number
  }
  agent: {
    name: string
    phone: string
    email: string
    company: string
    image?: string
  }
  listingDate: string
  views: number
  status: 'available' | 'pending' | 'sold'
}

// Données mockées pour les propriétés de démonstration
const mockProperties: Record<string, MockProperty> = {
  '1': {
    id: '1',
    title: 'Immeuble de Bureaux Premium - Centre-ville',
    description: `Magnifique immeuble de bureaux de classe A situé au cœur du centre-ville. Cette propriété exceptionnelle offre des espaces de travail modernes avec des finitions haut de gamme, des vues panoramiques sur la ville et un accès privilégié aux transports en commun.

    L'immeuble dispose d'un lobby élégant avec réception, de plusieurs salles de conférence équipées des dernières technologies, d'un parking souterrain sécurisé et d'un système de sécurité 24h/24.

    Idéal pour des entreprises cherchant un siège social prestigieux ou des investisseurs souhaitant acquérir un actif de premier plan dans un secteur en forte demande.`,
    price: 2850000,
    surface: 1250,
    propertyType: 'Bureau',
    transactionType: 'Vente',
    location: {
      address: '123 Rue de la République',
      city: 'Lyon',
      state: 'Rhône-Alpes',
      zipCode: '69001',
      coordinates: [4.8357, 45.7640]
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
        alt: 'Façade de l\'immeuble de bureaux',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
        alt: 'Open space moderne'
      },
      {
        url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
        alt: 'Salle de conférence équipée'
      },
      {
        url: 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=800&h=600&fit=crop',
        alt: 'Lobby d\'accueil'
      }
    ],
    features: {
      yearBuilt: 2018,
      floors: 8,
      parking: 25,
      tenants: 12
    },
    agent: {
      name: 'Marie Dubois',
      phone: '+33 6 12 34 56 78',
      email: 'marie.dubois@loopnet.fr',
      company: 'LoopNet Immobilier Commercial',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    listingDate: '2024-03-15',
    views: 2847,
    status: 'available'
  },
  '2': {
    id: '2',
    title: 'Entrepôt Logistique Moderne - Zone Industrielle',
    description: `Entrepôt logistique de dernière génération situé dans une zone industrielle stratégique avec accès direct aux principales autoroutes. Cette installation moderne offre des espaces de stockage optimisés et des bureaux administratifs.

    Équipements inclus : quais de chargement multiples, système de sprinklers, éclairage LED haute efficacité, bureaux climatisés, parking poids lourds sécurisé.

    Parfait pour des activités de distribution, e-commerce, ou stockage industriel.`,
    price: 1850000,
    surface: 3500,
    propertyType: 'Industriel',
    transactionType: 'Vente',
    location: {
      address: '456 Zone Industrielle Nord',
      city: 'Villeneuve d\'Ascq',
      state: 'Hauts-de-France',
      zipCode: '59650',
      coordinates: [3.1569, 50.6292]
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop',
        alt: 'Entrepôt moderne',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&h=600&fit=crop',
        alt: 'Zone de stockage'
      },
      {
        url: 'https://images.unsplash.com/photo-1558618666-fbd062c526cd?w=800&h=600&fit=crop',
        alt: 'Quais de chargement'
      }
    ],
    features: {
      yearBuilt: 2020,
      parking: 40,
      lotSize: 8000
    },
    agent: {
      name: 'Pierre Martin',
      phone: '+33 6 87 65 43 21',
      email: 'pierre.martin@loopnet.fr',
      company: 'LoopNet Immobilier Commercial'
    },
    listingDate: '2024-02-28',
    views: 1523,
    status: 'available'
  },
  '3': {
    id: '3',
    title: 'Centre Commercial - Emplacement Premium',
    description: `Centre commercial de 2500m² situé dans une zone commerciale très fréquentée. Actuellement occupé par plusieurs enseignes nationales avec des baux fermes.

    Le centre bénéficie d'un emplacement exceptionnel avec une forte visibilité, un parking de 150 places et un flux piétonnier important.

    Investissement rentable avec des locataires de qualité et des revenus stables.`,
    price: 4200000,
    surface: 2500,
    propertyType: 'Commerce',
    transactionType: 'Vente',
    location: {
      address: '789 Avenue des Commerces',
      city: 'Marseille',
      state: 'Provence-Alpes-Côte d\'Azur',
      zipCode: '13008',
      coordinates: [5.3698, 43.2965]
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop',
        alt: 'Centre commercial',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
        alt: 'Galerie commerciale'
      },
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
        alt: 'Magasin type'
      }
    ],
    features: {
      yearBuilt: 2015,
      parking: 150,
      tenants: 8
    },
    agent: {
      name: 'Sophie Laurent',
      phone: '+33 6 98 76 54 32',
      email: 'sophie.laurent@loopnet.fr',
      company: 'LoopNet Immobilier Commercial',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    listingDate: '2024-01-20',
    views: 3421,
    status: 'pending'
  }
}

export default function MockPropertyPage() {
  const params = useParams()
  const propertyId = params?.id as string
  const [property, setProperty] = useState<MockProperty | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { toast } = useToast()

  useEffect(() => {
    // Simuler un chargement
    setTimeout(() => {
      const foundProperty = mockProperties[propertyId]
      setProperty(foundProperty || null)
      setLoading(false)
    }, 500)
  }, [propertyId])

  const handleFavoriteToggle = () => {
    if (!property) return

    if (isFavorite(property.id)) {
      removeFromFavorites(property.id)
      toast({
        title: 'Retiré des favoris',
        description: 'La propriété a été retirée de vos favoris'
      })
    } else {
      addToFavorites({
        id: property.id,
        title: property.title,
        price: property.price,
        surface: property.surface,
        location: property.location,
        image: property.images[0]?.url
      })
      toast({
        title: 'Ajouté aux favoris',
        description: 'La propriété a été ajoutée à vos favoris'
      })
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: 'Lien copié',
      description: 'Le lien de la propriété a été copié dans le presse-papiers'
    })
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (!property) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">Propriété non trouvée</h2>
              <p className="text-gray-600 mb-4">
                La propriété demandée n&apos;existe pas ou a été supprimée.
              </p>
              <Link href="/properties">
                <Button>Retour aux propriétés</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/properties">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <Badge variant="secondary">DÉMONSTRATION</Badge>
          <Badge 
            variant={property.status === 'available' ? 'default' : 
                    property.status === 'pending' ? 'secondary' : 'destructive'}
          >
            {property.status === 'available' ? 'Disponible' :
             property.status === 'pending' ? 'En cours' : 'Vendu'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images et informations principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galerie d'images */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={property.images[currentImageIndex]?.url || '/placeholder-property.jpg'}
                    alt={property.images[currentImageIndex]?.alt || property.title}
                    width={800}
                    height={500}
                    className="w-full h-[500px] object-cover rounded-t-lg"
                  />
                  
                  {/* Navigation des images */}
                  {property.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {property.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleFavoriteToggle}
                      className={isFavorite(property.id) ? 'text-red-500' : ''}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite(property.id) ? 'fill-current' : ''}`} />
                    </Button>
                    <Button size="sm" variant="secondary" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Miniatures */}
                {property.images.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 border-2 rounded-lg overflow-hidden ${
                          currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt={image.alt || `Image ${index + 1}`}
                          width={80}
                          height={60}
                          className="w-20 h-15 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Titre et description */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                    <div className="flex items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{property.location.address}, {property.location.city}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Square className="h-4 w-4" />
                        <span>{property.surface.toLocaleString()} m²</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{property.views} vues</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {property.price.toLocaleString()} €
                    </div>
                    <div className="text-gray-600">
                      {Math.round(property.price / property.surface).toLocaleString()} €/m²
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {property.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Caractéristiques */}
            <Card>
              <CardHeader>
                <CardTitle>Caractéristiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Type</div>
                      <div className="text-gray-600">{property.propertyType}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Square className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Surface</div>
                      <div className="text-gray-600">{property.surface.toLocaleString()} m²</div>
                    </div>
                  </div>
                  {property.features.yearBuilt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">Année</div>
                        <div className="text-gray-600">{property.features.yearBuilt}</div>
                      </div>
                    </div>
                  )}
                  {property.features.parking && (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 text-gray-500">🅿️</div>
                      <div>
                        <div className="font-medium">Parking</div>
                        <div className="text-gray-600">{property.features.parking} places</div>
                      </div>
                    </div>
                  )}
                  {property.features.floors && (
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">Étages</div>
                        <div className="text-gray-600">{property.features.floors}</div>
                      </div>
                    </div>
                  )}
                  {property.features.tenants && (
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">Locataires</div>
                        <div className="text-gray-600">{property.features.tenants}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar avec contact agent */}
          <div className="space-y-6">
            {/* Contact Agent */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Agent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  {property.agent.image ? (
                    <Image
                      src={property.agent.image}
                      alt={property.agent.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{property.agent.name}</div>
                    <div className="text-sm text-gray-600">{property.agent.company}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Envoyer un email
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>

                <div className="text-xs text-gray-500 pt-2 border-t">
                  <div>📞 {property.agent.phone}</div>
                  <div>✉️ {property.agent.email}</div>
                </div>
              </CardContent>
            </Card>

            {/* Informations supplémentaires */}
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date d&apos;annonce</span>
                  <span>{new Date(property.listingDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Référence</span>
                  <span>MOCK-{property.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type de transaction</span>
                  <span>{property.transactionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut</span>
                  <Badge variant="outline">
                    {property.status === 'available' ? 'Disponible' :
                     property.status === 'pending' ? 'En cours' : 'Vendu'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" size="sm">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Demander une estimation
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Programmer une visite
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager cette annonce
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
