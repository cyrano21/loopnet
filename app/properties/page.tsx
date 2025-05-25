"use client"

import PropertyCard from "@/components/PropertyCard"
import Pagination from "@/components/ui/Pagination"
import SearchBar from "@/components/ui/SearchBar"
import Sidebar from "@/components/ui/Sidebar"
import { useProperties } from "@/hooks/use-properties"
import { useState } from "react"

const PropertiesPage = () => {
  const [filters, setFilters] = useState({
    transactionType: "",
    propertyType: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    minSurface: "",
    maxSurface: "",
    rooms: "",
    sort: "newest",
    q: "",
    page: 1,
  })

  const { properties, loading, error, pagination, refetch } = useProperties(filters)

  // Gérer les changements de filtres
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  if (error) return <div className="text-red-600 p-4">Erreur: {error}</div>

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Nos propriétés</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <Sidebar onFilterChange={handleFilterChange} />

        <div className="flex-1">
          <SearchBar onFilterChange={handleFilterChange} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {pagination && (
            <Pagination currentPage={filters.page} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
          )}
        </div>
      </div>
    </div>
  )
}

export default PropertiesPage
