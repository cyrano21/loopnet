"use client"

import { useState } from "react"
import { useUserProperties } from "@/hooks/use-user-properties"

const MyPropertiesPage = () => {
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  // TODO: Récupérer l'ID utilisateur depuis l'authentification
  const userId = "507f1f77bcf86cd799439011" // Mock pour le moment

  const { properties, stats, loading, error, pagination, refetch } = useUserProperties(
    userId,
    statusFilter,
    currentPage,
  )

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Mes propriétés</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Actives</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">En attente</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">{stats.totalViews}</div>
            <div className="text-sm text-gray-600">Vues totales</div>
          </div>
        </div>
      )}

      {/* Filters and Sorting (To be implemented) */}
      <div className="mb-4">
        {/* Filter by Status */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setCurrentPage(1) // Reset page on filter change
          }}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        >
          <option value="all">Tous les status</option>
          <option value="active">Actif</option>
          <option value="pending">En attente</option>
          <option value="draft">Brouillon</option>
          <option value="rejected">Rejeté</option>
        </select>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p>Erreur: {error.message}</p>}

      {properties && properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
            <div key={property._id} className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold">{property.title}</h2>
              <p className="text-gray-600">{property.address}</p>
              {/* Add more property details here */}
            </div>
          ))}
        </div>
      ) : (
        <p>Aucune propriété trouvée.</p>
      )}

      {pagination && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 disabled:opacity-50"
          >
            Précédent
          </button>
          <span>
            Page {currentPage} sur {pagination.totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
            disabled={currentPage === pagination.totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md ml-2 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  )
}

export default MyPropertiesPage
