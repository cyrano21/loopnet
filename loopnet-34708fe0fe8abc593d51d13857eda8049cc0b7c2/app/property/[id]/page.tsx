"use client"

import { useProperty } from "@/hooks/use-properties"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Bed, Bath, Square, Phone, Mail, Lock } from "lucide-react"
import { AccessRestriction } from "@/components/access-restriction"
import { PricingModal } from "@/components/pricing-modals"
import { useState } from "react"
import { usePermissions } from "@/hooks/use-permissions"
import { useEffect } from "react"
import { toast } from "sonner"

export default function PropertyDetailsPage() {
  const { id } = useParams()
  const { property, loading, error } = useProperty(id)
  const { can, requiresUpgrade } = usePermissions()
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [pricingType, setPricingType] = useState<"simple" | "premium" | "agent">("premium")

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Propriété non trouvée</h3>
          <p className="text-gray-600">La propriété demandée n'existe pas.</p>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleContact = (type: "phone" | "email") => {
    const action = type === "phone" ? "canCallSellers" : "canEmailSellers"

    if (!can(action)) {
      setPricingType("agent")
      setShowPricingModal(true)
      return
    }

    if (type === "phone") {
      window.open(`tel:${property.contactInfo?.phone}`)
    } else {
      window.open(`mailto:${property.contactInfo?.email}`)
    }
  }

  return (
    <>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Contenu principal */}
          <div className="lg:w-3/4">
            {/* Image principale */}
            <div className="relative w-full h-96 rounded-lg overflow-hidden mb-4">
              <Image
                src={property.images[0]?.url || "/placeholder.svg?height=400&width=600&query=property"}
                alt={property.title}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-2 left-2 bg-blue-600">{property.propertyType}</Badge>
            </div>

            {/* Description */}
            <Card className="mb-4">
              <CardContent>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-600">{property.description}</p>
              </CardContent>
            </Card>

            {/* Caractéristiques */}
            <Card className="mb-4">
              <CardContent>
                <h4 className="font-semibold mb-2">Caractéristiques</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    {property.address}, {property.city}
                  </div>
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1 text-gray-500" />
                    {property.surface} m²
                  </div>
                  {property.bedrooms && (
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1 text-gray-500" />
                      {property.bedrooms} chambres
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1 text-gray-500" />
                      {property.bathrooms} salles de bain
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Card>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-4">{formatPrice(property.price)}</div>

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

                <Button className="w-full">Contacter l'agent</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} userType={pricingType} />
    </>
  )
}
