"use client"

import { useState, useEffect } from "react"
import { SearchBar } from "@/components/ui/SearchBar"
import { Pagination } from "@/components/ui/Pagination"
import { PropertyCard } from "@/components/property-card"
import { useProperties } from "@/hooks/use-properties"
import { usePermissions } from "@/hooks/use-permissions"
import { useComparison } from "@/components/comparison-provider"
import { UsageLimit } from "@/components/usage-limit"
import { AccessRestriction } from "@/components/access-restriction"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Shield } from "lucide-react"

export default function PropertiesPage() {
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

  const [viewedProperties, setViewedProperties] = useState(0)
  const { properties, loading, error, pagination } = useProperties(filters)
  const { can, limit, userRole, isAdmin } = usePermissions()
  const comparison = useComparison()

  const maxViewLimit = limit("maxPropertiesView")

  // Pour les admins, pas de limitation
  const limitedProperties =
    isAdmin || !maxViewLimit ? properties : properties.slice(0, Math.max(0, maxViewLimit - viewedProperties))

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  useEffect(() => {
    if (properties.length > 0 && !isAdmin) {
      setViewedProperties((prev) => prev + properties.length)
    }
  }, [properties, isAdmin])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-red-600 text-center p-4">Erreur lors du chargement des propriétés: {error}</div>
      </div>
    )
  }

  const isAtViewLimit = !isAdmin && maxViewLimit && viewedProperties >= maxViewLimit

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Propriétés Commerciales</h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-gray-600">
              {limitedProperties.length} propriétés affichées
              {!isAdmin && maxViewLimit && ` (${viewedProperties}/${maxViewLimit} vues)`}
            </p>
            {isAdmin && (
              <div className="flex items-center gap-1 text-red-600">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">ADMIN - Accès illimité</span>
              </div>
            )}
          </div>

          {/* Limite de vues - seulement pour non-admins */}
          {!isAdmin && maxViewLimit && (
            <UsageLimit limitType="maxPropertiesView" currentUsage={viewedProperties} label="Propriétés vues" />
          )}
        </div>
      </div>

      {/* Alerte pour les utilisateurs non connectés */}
      {userRole === "guest" && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Créez un compte gratuit pour voir plus de propriétés et accéder à plus de fonctionnalités.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar avec filtres */}
        <div className="lg:w-1/4">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-4">Filtres</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type de transaction</label>
                <select
                  className="w-full p-2 border rounded"
                  onChange={(e) => handleFilterChange("transactionType", e.target.value)}
                >
                  <option value="">Tous</option>
                  <option value="sale">Vente</option>
                  <option value="rent">Location</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type de propriété</label>
                <select
                  className="w-full p-2 border rounded"
                  onChange={(e) => handleFilterChange("propertyType", e.target.value)}
                >
                  <option value="">Tous</option>
                  <option value="apartment">Appartement</option>
                  <option value="house">Maison</option>
                  <option value="office">Bureau</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="lg:w-3/4">
          {/* Barre de recherche */}
          <div className="mb-6">
            <SearchBar onFilterChange={handleFilterChange} />
          </div>

          {/* Résultats */}
          {limitedProperties.length === 0 && !isAtViewLimit ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Aucune propriété trouvée</h3>
              <p className="text-gray-600">
                {properties.length === 0
                  ? "La base de données est vide. Utilisez le bouton de peuplement dans l'admin."
                  : "Essayez de modifier vos critères de recherche"}
              </p>
            </div>
          ) : (
            <>
              {/* Grille des propriétés */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {limitedProperties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    onAddToComparison={comparison.addToComparison}
                    isInComparison={comparison.comparisonList.some((p) => p._id === property._id)}
                  />
                ))}
              </div>

              {/* Message de limite atteinte - seulement pour non-admins */}
              {!isAdmin && isAtViewLimit && <AccessRestriction action="maxPropertiesView" />}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (isAdmin || !isAtViewLimit) && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={filters.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
