"use client"

import { useState } from "react"
import { Plus, Search, MoreVertical, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useUserProperties } from "@/hooks/use-user-properties"
import Image from "next/image"
import Link from "next/link"

export default function MyPropertiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const { properties, loading, error } = useUserProperties()

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || property.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      pending: "secondary",
      sold: "destructive",
      rented: "outline",
    }
    return variants[status as keyof typeof variants] || "default"
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(price)
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
        <div className="text-red-600 text-center p-4">Erreur lors du chargement: {error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mes Propriétés</h1>
          <p className="text-gray-600 mt-2">Gérez vos annonces immobilières</p>
        </div>
        <Link href="/list-property">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Annonce
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher une propriété..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            onClick={() => setFilterStatus("all")}
            size="sm"
          >
            Toutes
          </Button>
          <Button
            variant={filterStatus === "active" ? "default" : "outline"}
            onClick={() => setFilterStatus("active")}
            size="sm"
          >
            Actives
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "outline"}
            onClick={() => setFilterStatus("pending")}
            size="sm"
          >
            En attente
          </Button>
        </div>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Aucune propriété trouvée</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== "all"
              ? "Essayez de modifier vos critères de recherche"
              : "Commencez par ajouter votre première propriété"}
          </p>
          <Link href="/list-property">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une propriété
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={property.images[0]?.url || "/placeholder.svg?height=200&width=300"}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant={getStatusBadge(property.status)}>
                    {property.status === "active" && "Actif"}
                    {property.status === "pending" && "En attente"}
                    {property.status === "sold" && "Vendu"}
                    {property.status === "rented" && "Loué"}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/property/${property._id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          Voir
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/list-property?edit=${property._id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{property.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{property.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-blue-600">{formatPrice(property.price)}</div>
                  <div className="text-sm text-gray-500">{property.surface} m²</div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>{property.views || 0} vues</span>
                    <span>{property.favorites || 0} favoris</span>
                  </div>
                  <span>{new Date(property.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
