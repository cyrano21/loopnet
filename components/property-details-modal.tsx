"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  X,
  MapPin,
  Square,
  Calendar,
  Building,
  Car,
  Wifi,
  Phone,
  Mail,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react"
import Image from "next/image"
import { Property, PropertyImage } from "@/types/property"

interface PropertyDetailsModalProps {
  property: Property | null
  isOpen: boolean
  onClose: () => void
  onFavorite?: () => void
}

export function PropertyDetailsModal({ property, isOpen, onClose, onFavorite }: PropertyDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [property])

  if (!property) return null

  const formatPrice = (price: number, transactionType?: string) => {
    const formatted = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price)

    return transactionType === "rent" ? `${formatted}/mois` : formatted
  }

  const getImageUrl = (image: PropertyImage) => image?.url || '/placeholder-property.jpg'
    
  const getImageAlt = (image: PropertyImage, index: number) => {
    return image?.alt || `Image ${index + 1} - ${property?.title || 'Bien immobilier'}`
  }

  const currentImage = property.images[currentImageIndex]
  const hasMultipleImages = property.images.length > 1

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
    )
  }

  type TransactionType = 'sale' | 'rent' | 'vacation' | string
  type BadgeVariant = 'default' | 'secondary' | 'outline'
  
  const getTransactionBadge = (type: TransactionType) => {
    const badges: Record<TransactionType, { label: string; variant: BadgeVariant }> = {
      sale: { label: "Vente", variant: "default" },
      rent: { label: "Location", variant: "secondary" },
      vacation: { label: "Location vacances", variant: "outline" },
      // Valeur par défaut si le type n'est pas reconnu
      default: { label: "À vendre", variant: "default" }
    }
    return badges[type as keyof typeof badges] || badges.default
  }

  const transactionType = property.transactionType || 'sale'
  const transactionBadge = getTransactionBadge(transactionType)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <div className="flex justify-between items-start">
          <div>
            <DialogTitle className="text-2xl font-bold">{property.title}</DialogTitle>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {[property.address, property.city].filter(Boolean).join(', ') || property.title}
              </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogHeader>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Image Gallery */}
          {property.images.length > 0 && (
            <div className="relative">
              <div className="relative h-64 md:h-80 overflow-hidden rounded-lg">
                <Image
                  src={getImageUrl(property.images[currentImageIndex])}
                  alt={getImageAlt(property.images[currentImageIndex], currentImageIndex)}
                  fill
                  className="object-cover"
                />

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Image Counter */}
                {hasMultipleImages && (
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {hasMultipleImages && (
                <div className="flex gap-2 mt-2 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      title={`Afficher l'image ${index + 1}`}
                      aria-label={`Afficher l'image ${index + 1}`}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 ${
                        index === currentImageIndex ? "border-blue-500" : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={getImageUrl(image)}
                        alt={getImageAlt(image, index)}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Property Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={transactionBadge.variant as 'default' | 'secondary' | 'outline'}>{transactionBadge.label}</Badge>
                <Badge variant="outline">{property.propertyType}</Badge>
                <Badge className="bg-green-100 text-green-800">
                  {property.status === 'active' ? 'Disponible' : 
                   property.status === 'sold' ? 'Vendu' : 
                   property.status === 'rented' ? 'Loué' : 
                   property.status === 'pending' ? 'En attente' : 
                   property.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">
                  {formatPrice(property.price, property.transactionType)}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    {[property.address, property.city].filter(Boolean).join(', ') || property.title}
                  </span>
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-sm font-medium">{property.price / property.surface} €/m²</div>
                  <div className="text-xs text-gray-500">Prix au m²</div>
                </div>

                {property.yearBuilt && (
                  <div className="text-center">
                    <Calendar className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm text-gray-600">Année</div>
                    <div className="font-semibold">{property.yearBuilt}</div>
                  </div>
                )}

                {property.parking && property.parking !== '0' && (
                  <div className="text-center">
                    <Car className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm text-gray-600">Parking</div>
                    <div className="font-semibold">{property.parking} places</div>
                  </div>
                )}

                <div className="text-center">
                  <Building className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                  <div className="text-sm text-gray-600">Surface</div>
                  <div className="font-semibold">{property.surface} m²</div>
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>
              )}

              {/* Features */}
              {property.features.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Équipements</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact & Actions */}
            <div className="space-y-4">
              {/* Actions */}
              <div className="space-y-2">
                <Button onClick={onFavorite} variant="outline" className="w-full">
                  <Heart className="h-4 w-4 mr-2" />
                  Ajouter aux favoris
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>

              <Separator />

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Contact</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{property.contactInfo.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <a href={`mailto:${property.contactInfo.email}`} className="text-blue-600 hover:underline">
                      {property.contactInfo.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <a href={`tel:${property.contactInfo.phone}`} className="text-blue-600 hover:underline">
                      {property.contactInfo.phone}
                    </a>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Stats */}
              <div className="space-y-2">
                <h3 className="font-semibold">Statistiques</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vues:</span>
                    <span>{property.views}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Favoris:</span>
                    <span>{property.favorites}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Demandes:</span>
                    <span>{property.inquiries}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
