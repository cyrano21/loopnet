import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, MapPin, Square, Eye, MessageSquare } from "lucide-react"

interface Property {
  _id: string
  title: string
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
}

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const primaryImage = property.images.find((img) => img.isPrimary) || property.images[0]
  const imageUrl = primaryImage?.url || "/placeholder.svg?height=250&width=400"

  const formatPrice = (price: number, transactionType: string) => {
    const formatted = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price)

    return transactionType === "rent" ? `${formatted}/mois` : formatted
  }

  const getTransactionBadge = (type: string) => {
    const badges = {
      sale: { label: "Vente", variant: "default" as const },
      rent: { label: "Location", variant: "secondary" as const },
      vacation: { label: "Vacances", variant: "outline" as const },
    }
    return badges[type] || badges.sale
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { label: "Disponible", variant: "default" as const, color: "bg-green-100 text-green-800" },
      pending: { label: "En attente", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
      sold: { label: "Vendu", variant: "outline" as const, color: "bg-red-100 text-red-800" },
      rented: { label: "Loué", variant: "outline" as const, color: "bg-blue-100 text-blue-800" },
    }
    return badges[status] || badges.active
  }

  const transactionBadge = getTransactionBadge(property.transactionType)
  const statusBadge = getStatusBadge(property.status)

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <Link href={`/property/${property._id}`}>
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={primaryImage?.alt || property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge variant={transactionBadge.variant}>{transactionBadge.label}</Badge>
          <Badge className={statusBadge.color}>{statusBadge.label}</Badge>
        </div>

        {/* Favorite button */}
        <button className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors">
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <CardContent className="p-4">
        <Link href={`/property/${property._id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
        </Link>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {property.address}, {property.city}
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-blue-600">
            {formatPrice(property.price, property.transactionType)}
          </div>
          <div className="flex items-center text-gray-600">
            <Square className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.surface} m²</span>
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-3">
          {property.pricePerSqm > 0 && <span>{property.pricePerSqm} €/m²</span>}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span>{property.views}</span>
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              <span>{property.favorites}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{property.inquiries}</span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {property.propertyType}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
