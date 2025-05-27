"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { SearchBar } from "@/components/ui/SearchBar"
import { PropertyCard } from "@/components/property-card"
import { useProperties } from "@/hooks/use-properties"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SearchPage() {
  const params = useParams()
  const query = params.query as string
  const decodedQuery = decodeURIComponent(query)

  const [filters, setFilters] = useState({
    q: decodedQuery,
    page: 1,
    transactionType: "",
    propertyType: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    minSurface: "",
    maxSurface: "",
    rooms: "",
    sort: "newest",
  })

  const { properties, loading, error, pagination } = useProperties(filters)

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-600 text-center p-4">Erreur lors de la recherche: {error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/properties">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux propriétés
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Résultats pour "{decodedQuery}"</h1>
        <p className="text-gray-600">
          {properties.length} propriété{properties.length > 1 ? "s" : ""} trouvée{properties.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar onFilterChange={handleFilterChange} initialQuery={decodedQuery} />
      </div>

      {/* Results */}
      {properties.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Aucune propriété trouvée</h3>
          <p className="text-gray-600 mb-6">
            Essayez de modifier vos critères de recherche ou explorez toutes nos propriétés
          </p>
          <Link href="/properties">
            <Button>Voir toutes les propriétés</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}
