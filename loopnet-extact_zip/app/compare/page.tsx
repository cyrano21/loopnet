"use client"

import { useComparison } from "@/components/comparison-provider"
import { RoleGuard } from "@/components/role-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Square, X, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ComparePage() {
  const { comparisonList, removeFromComparison, clearComparison } = useComparison()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculatePricePerSqFt = (price: number, size: number) => {
    return Math.round(price / size)
  }

  if (comparisonList.length === 0) {
    return (
      <RoleGuard requiredRole="user">
        <div className="container mx-auto py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4">Comparaison de Propriétés</h1>
            <p className="text-gray-600 mb-6">Aucune propriété sélectionnée pour la comparaison</p>
            <Link href="/properties">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux propriétés
              </Button>
            </Link>
          </div>
        </div>
      </RoleGuard>
    )
  }

  return (
    <RoleGuard requiredRole="user">
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Comparaison de Propriétés</h1>
            <p className="text-gray-600">{comparisonList.length} propriété(s) en comparaison</p>
          </div>
          <div className="flex gap-2">
            <Link href="/properties">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <Button variant="destructive" onClick={clearComparison}>
              Effacer tout
            </Button>
          </div>
        </div>

        {/* Comparaison en grille */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {comparisonList.map((property) => (
            <Card key={property._id} className="relative">
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 z-10"
                onClick={() => removeFromComparison(property._id)}
              >
                <X className="h-4 w-4" />
              </Button>

              <CardHeader className="pb-2">
                <div className="relative h-48 w-full rounded-lg overflow-hidden">
                  <Image
                    src={property.images[0] || "/placeholder.svg?height=200&width=300&query=property"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-blue-600">{property.propertyType}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Titre et prix */}
                <div>
                  <CardTitle className="text-lg line-clamp-2 mb-2">{property.title}</CardTitle>
                  <div className="text-2xl font-bold text-blue-600">{formatPrice(property.price)}</div>
                  <div className="text-sm text-gray-600">
                    ${calculatePricePerSqFt(property.price, property.size)}/sq ft
                  </div>
                </div>

                {/* Localisation */}
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    <div>{property.location.address}</div>
                    <div>
                      {property.location.city}, {property.location.state}
                    </div>
                  </div>
                </div>

                {/* Caractéristiques */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Surface:</span>
                    <span className="font-medium flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      {property.size.toLocaleString()} sq ft
                    </span>
                  </div>

                  {property.bedrooms && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Chambres:</span>
                      <span className="font-medium flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {property.bedrooms}
                      </span>
                    </div>
                  )}

                  {property.bathrooms && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Salles de bain:</span>
                      <span className="font-medium flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {property.bathrooms}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-2">
                  <Link href={`/property/${property._id}`}>
                    <Button size="sm" className="w-full">
                      Voir Détails
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Résumé de comparaison */}
        <Card>
          <CardHeader>
            <CardTitle>Résumé de la Comparaison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Prix le plus bas:</span>
                <div className="font-semibold text-green-600">
                  {formatPrice(Math.min(...comparisonList.map((p) => p.price)))}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Prix le plus élevé:</span>
                <div className="font-semibold text-red-600">
                  {formatPrice(Math.max(...comparisonList.map((p) => p.price)))}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Surface moyenne:</span>
                <div className="font-semibold">
                  {Math.round(
                    comparisonList.reduce((acc, p) => acc + p.size, 0) / comparisonList.length,
                  ).toLocaleString()}{" "}
                  sq ft
                </div>
              </div>
              <div>
                <span className="text-gray-600">Prix moyen/sq ft:</span>
                <div className="font-semibold">
                  ${Math.round(comparisonList.reduce((acc, p) => acc + p.price / p.size, 0) / comparisonList.length)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}
