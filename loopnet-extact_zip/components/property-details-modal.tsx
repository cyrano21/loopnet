"use client"

import { useState } from "react"
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
} from "lucide-react"
import Image from "next/image"

interface Property {
  _id: string
  title: string
  description?: string
  address: string
  city: string
  price: number
  surface: number
  propertyType: string
  transactionType: string
  images: Array<{
    url: string
    alt?: string
    isPrimary?: boolean
  }>
  views: number
  favorites: number
  inquiries: number
  pricePerSqm: number
  status: string
  yearBuilt?: number
  parking?: number
  amenities?: string[]
  contact?: {
    name: string
    phone: string
    email: string
    company: string
  }
}

interface PropertyDetailsModalProps {
  property: Property | null
  isOpen: boolean
  onClose: () => void
  onFavorite?: () => void
}

export function PropertyDetailsModal({ property, isOpen, onClose, onFavorite }: PropertyDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!property) return null

  const formatPrice = (price: number, transactionType: string) => {
    const formatted = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price)

    return transactionType === "rent" ? `${formatted}/mois` : formatted
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))
  }

  const getTransactionBadge = (type: string) => {
    const badges = {
      sale: { label: "Vente", variant: "default" as const },
      rent: { label: "Location", variant: "secondary" as const },
      vacation: { label: "Vacances", variant: "outline" as const },
    }
    return badges[type] || badges.sale
  }

  const transactionBadge = getTransactionBadge(property.transactionType)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold line-clamp-1">{property.title}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Gallery */}
          {property.images.length > 0 && (
            <div className="relative">
              <div className="relative h-64 md:h-80 overflow-hidden rounded-lg">
                <Image
                  src={property.images[currentImageIndex]?.url || "/placeholder.svg"}
                  alt={property.images[currentImageIndex]?.alt || property.title}
                  fill
                  className="object-cover"
                />

                {/* Navigation Arrows */}
                {property.images.length > 1 && (
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
                {property.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {property.images.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 ${
                        index === currentImageIndex ? "border-blue-500" : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={image.alt || `Image ${index + 1}`}
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
                <Badge variant={transactionBadge.variant}>{transactionBadge.label}</Badge>
                <Badge variant="outline">{property.propertyType}</Badge>
                <Badge className="bg-green-100 text-green-800">{property.status}</Badge>
              </div>

              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">
                  {formatPrice(property.price, property.transactionType)}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    {property.address}, {property.city}
                  </span>
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Square className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                  <div className="text-sm text-gray-600">Surface</div>
                  <div className="font-semibold">{property.surface} m²</div>
                </div>

                {property.yearBuilt && (
                  <div className="text-center">
                    <Calendar className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm text-gray-600">Année</div>
                    <div className="font-semibold">{property.yearBuilt}</div>
                  </div>
                )}

                {property.parking && (
                  <div className="text-center">
                    <Car className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm text-gray-600">Parking</div>
                    <div className="font-semibold">{property.parking} places</div>
                  </div>
                )}

                <div className="text-center">
                  <Building className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                  <div className="text-sm text-gray-600">Prix/m²</div>
                  <div className="font-semibold">{property.pricePerSqm} €</div>
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Équipements</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <Wifi className="h-3 w-3" />
                        {amenity}
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
              {property.contact && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Contact</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="font-medium">{property.contact.name}</div>
                      <div className="text-sm text-gray-600">{property.contact.company}</div>
                    </div>

                    <div className="space-y-2">
                      <Button variant="default" className="w-full" asChild>
                        <a href={`tel:${property.contact.phone}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          Appeler
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <a href={`mailto:${property.contact.email}`}>
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

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
