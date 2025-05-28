"use client"

import { X, Scale, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

interface Property {
  _id: string
  title: string
  price: number
  images: string[]
}

interface ComparisonBarProps {
  properties: Property[]
  onRemove: (id: string) => void
  onCompare: () => void
  onClear: () => void
}

export function ComparisonBar({ properties, onRemove, onCompare, onClear }: ComparisonBarProps) {
  if (properties.length === 0) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">Comparaison</span>
              <Badge variant="secondary">{properties.length}/4</Badge>
            </div>

            <div className="flex gap-2 max-w-md overflow-x-auto">
              {properties.map((property) => (
                <div key={property._id} className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-blue-200">
                    <Image
                      src={property.images[0] || "/placeholder.svg?height=64&width=64"}
                      alt={property.title}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <button
                    onClick={() => onRemove(property._id)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="text-xs text-center mt-1 max-w-16 truncate">{formatPrice(property.price)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClear}>
              Effacer
            </Button>
            <Link href="/compare">
              <Button disabled={properties.length < 2} className="bg-blue-600 hover:bg-blue-700">
                <Eye className="h-4 w-4 mr-2" />
                Comparer ({properties.length})
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
