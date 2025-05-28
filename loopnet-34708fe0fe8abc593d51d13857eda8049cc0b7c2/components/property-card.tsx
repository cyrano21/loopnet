"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MapPin, Bed, Bath, Square, Heart, Scale, Phone, Mail, Eye, Lock } from "lucide-react"
import { usePermissions } from "@/hooks/use-permissions"
import { AccessRestriction } from "./access-restriction"
import { useState } from "react"
import { PricingModal } from "@/components/pricing-modals"
import { toast } from "sonner"
import { useFavorites } from "@/hooks/use-favorites"

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
  }
  onAddToComparison?: (property: any) => void
  isInComparison?: boolean
}

export function PropertyCard({ property, onAddToComparison, isInComparison }: PropertyCardProps) {
  const { can, requiresUpgrade, userRole } = usePermissions()
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [pricingType, setPricingType] = useState<"simple" | "premium" | "agent">("premium")
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getImageUrl = () => {
    if (Array.isArray(property.images)) {
      if (property.images.length > 0) {
        const firstImage = property.images[0]
        if (typeof firstImage === "string") {
          return firstImage
        } else if (firstImage && typeof firstImage === "object" && "url" in firstImage) {
          return firstImage.url
        }
      }
    }
    return "/placeholder.svg?height=200&width=300&query=property"
  }

  const getLocation = () => {
    if (property.location) {
      return `${property.location.city}, ${property.location.state}`
    }
    return property.city || "Location not specified"
  }

  const getSize = () => {
    return property.surface || property.size || 0
  }

  const handleFavorite = async () => {
    if (!can("canAddFavorites")) {
      const upgrade = requiresUpgrade("canAddFavorites")
      if (upgrade) {
        setPricingType(upgrade as any)
        setShowPricingModal(true)
      }
      return
    }

    try {
      if (isFavorite(property._id)) {
        await removeFromFavorites(property._id)
        toast.success("Retiré des favoris")
      } else {
        await addToFavorites(property._id)
        toast.success("Ajouté aux favoris")
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des favoris")
    }
  }

  const handleCompare = () => {
    if (!can("canCompareProperties")) {
      const upgrade = requiresUpgrade("canCompareProperties")
      if (upgrade) {
        setPricingType(upgrade as any)
        setShowPricingModal(true)
      }
      return
    }

    onAddToComparison?.(property)
  }

  const handleViewDetails = () => {
    if (!can("canViewPropertyDetails")) {
      const upgrade = requiresUpgrade("canViewPropertyDetails")
      if (upgrade) {
        setPricingType(upgrade as any)
        setShowPricingModal(true)
      }
      return
    }

    // Navigation vers les détails
    window.location.href = `/property/${property._id}`
  }

  const handleContact = (type: "phone" | "email") => {
    if (!property.contactInfo) {
      toast.error("Aucune information de contact disponible.")
      return
    }

    if (type === "phone") {
      window.location.href = `tel:${property.contactInfo.phone}`
    } else if (type === "email") {
      window.location.href = `mailto:${property.contactInfo.email}`
    }
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 w-full">
          <Image src={getImageUrl() || "/placeholder.svg"} alt={property.title} fill className="object-cover" />
          <Badge className="absolute top-2 left-2 bg-blue-600">{property.propertyType}</Badge>

          {/* Bouton Favoris */}
          <Button size="sm" variant="secondary" className="absolute top-2 right-2 p-2" onClick={handleFavorite}>
            <Heart className={`h-4 w-4 ${isFavorite(property._id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </Button>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{property.title}</h3>

          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{getLocation()}</span>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{property.description}</p>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            {property.bedrooms && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                {property.bedrooms}
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                {property.bathrooms}
              </div>
            )}
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              {getSize().toLocaleString()} sq ft
            </div>
          </div>

          {/* Informations vendeur - Restreintes */}
          <AccessRestriction
            action="canViewSellerInfo"
            showUpgradePrompt={false}
            fallback={
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <Lock className="h-4 w-4" />
                  <span className="text-sm">Informations vendeur disponibles pour les agents</span>
                </div>
              </div>
            }
          >
            {property.contactInfo && (
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <h4 className="font-semibold text-sm mb-2">Contact</h4>
                <p className="text-sm">{property.contactInfo.name}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => handleContact("phone")}>
                    <Phone className="h-3 w-3 mr-1" />
                    Appeler
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleContact("email")}>
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
            )}
          </AccessRestriction>
        </CardContent>

        <CardFooter className="p-4 pt-0 space-y-3">
          <div className="w-full flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">{formatPrice(property.price)}</div>

            {/* Badge de rôle requis */}
            {!can("canViewPropertyDetails") && (
              <Badge variant="outline" className="text-xs">
                {requiresUpgrade("canViewPropertyDetails")} requis
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="w-full flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={handleViewDetails}>
              <Eye className="h-4 w-4 mr-1" />
              {can("canViewPropertyDetails") ? "Voir détails" : "Créer compte"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCompare}
              disabled={isInComparison}
              className={isInComparison ? "bg-blue-100" : ""}
            >
              <Scale className="h-4 w-4" />
              {!can("canCompareProperties") && <Lock className="h-3 w-3 ml-1" />}
            </Button>
          </div>

          {/* Message d'upgrade */}
          {userRole === "guest" && (
            <div className="w-full text-center">
              <Button
                variant="link"
                size="sm"
                className="text-blue-600"
                onClick={() => {
                  setPricingType("simple")
                  setShowPricingModal(true)
                }}
              >
                Créer un compte gratuit pour plus de fonctionnalités
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} userType={pricingType} />
    </>
  )
}
