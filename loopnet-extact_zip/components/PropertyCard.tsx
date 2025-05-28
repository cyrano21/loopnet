"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MapPin, Bed, Bath, Square } from "lucide-react"

interface PropertyCardProps {
  property: {
    _id: string
    title: string
    price: number
    location: {
      address: string
      city: string
      state: string
    }
    images: string[]
    propertyType: string
    size: number
    bedrooms?: number
    bathrooms?: number
    description: string
  }
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/property/${property._id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={property.images[0] || "/placeholder.svg?height=200&width=300"}
            alt={property.title}
            fill
            className="object-cover"
          />
          <Badge className="absolute top-2 left-2 bg-blue-600">{property.propertyType}</Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{property.title}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {property.location.city}, {property.location.state}
            </span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{property.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
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
              {property.size.toLocaleString()} sq ft
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="text-2xl font-bold text-blue-600">{formatPrice(property.price)}</div>
        </CardFooter>
      </Link>
    </Card>
  )
}
