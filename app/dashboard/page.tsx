"use client"

import { useState } from "react"
import { Building2, Plus, Edit, Trash2, Eye, TrendingUp, Users, DollarSign, RefreshCw } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUserProperties } from "@/hooks/use-user-properties"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const { properties, stats, loading, error, refetch } = useUserProperties()
  const { toast } = useToast()
  const [isSeeding, setIsSeeding] = useState(false)

  // Fonction pour peupler la base de données
  const handleSeedDatabase = async () => {
    try {
      setIsSeeding(true)
      const response = await fetch("/api/seed", { method: "POST" })
      const result = await response.json()

      if (result.success) {
        toast({
          title: "✅ Base de données peuplée !",
          description: `${result.data.propertiesCount} propriétés créées`,
        })
        refetch() // Recharger les données
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de peupler la base de données",
        variant: "destructive",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Chargement de votre dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur : {error}</p>
          <Button onClick={refetch}>Réessayer</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">LoopNet</span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/properties" className="text-gray-700 hover:text-blue-600">
                  Properties
                </Link>
                <Link href="/dashboard" className="text-blue-600 font-medium">
                  Dashboard
                </Link>
                <Link href="/market-data" className="text-gray-700 hover:text-blue-600">
                  Market Data
                </Link>
                <Link href="/professionals" className="text-gray-700 hover:text-blue-600">
                  Professionals
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Profile</Button>
              <Button>Sign Out</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Gérez vos biens immobiliers commerciaux</p>
          </div>
          <div className="flex gap-2">
            {/* Bouton pour peupler la base de données (dev uniquement) */}
            {process.env.NODE_ENV === "development" && (
              <Button variant="outline" onClick={handleSeedDatabase} disabled={isSeeding} className="mr-2">
                {isSeeding ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                {isSeeding ? "Peuplement..." : "Peupler DB"}
              </Button>
            )}
            <Link href="/list-property">
              <Button size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une propriété
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards avec vraies données */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Propriétés</p>
                  <p className="text-2xl font-bold">{stats?.total || 0}</p>
                  <p className="text-xs text-gray-500">
                    {stats?.active || 0} actives, {stats?.pending || 0} en attente
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Vues</p>
                  <p className="text-2xl font-bold">{stats?.totalViews || 0}</p>
                  <p className="text-xs text-gray-500">Toutes propriétés confondues</p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Demandes</p>
                  <p className="text-2xl font-bold">{stats?.totalInquiries || 0}</p>
                  <p className="text-xs text-gray-500">Nouvelles demandes</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Favoris</p>
                  <p className="text-2xl font-bold">{stats?.totalFavorites || 0}</p>
                  <p className="text-xs text-gray-500">Propriétés en favoris</p>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList>
            <TabsTrigger value="properties">Mes Propriétés</TabsTrigger>
            <TabsTrigger value="inquiries">Demandes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <CardTitle>Mes Propriétés ({properties.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {properties.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Aucune propriété trouvée</p>
                    <Link href="/list-property">
                      <Button>Ajouter votre première propriété</Button>
                    </Link>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Propriété</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Vues</TableHead>
                        <TableHead>Demandes</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {properties.map((property) => (
                        <TableRow key={property._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Image
                                src={property.images[0]?.url || "/placeholder.svg?height=60&width=80"}
                                alt={property.title}
                                width={60}
                                height={40}
                                className="rounded object-cover"
                              />
                              <div>
                                <div className="font-medium">{property.title}</div>
                                <div className="text-sm text-gray-600">{property.surface}m²</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{property.propertyType}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {property.price.toLocaleString("fr-FR")}€{property.transactionType === "rent" && "/mois"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                property.status === "active"
                                  ? "bg-green-600"
                                  : property.status === "pending"
                                    ? "bg-yellow-600"
                                    : "bg-gray-600"
                              }
                            >
                              {property.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{property.views}</TableCell>
                          <TableCell>{property.inquiries}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Autres onglets restent identiques */}
          <TabsContent value="inquiries">
            <Card>
              <CardHeader>
                <CardTitle>Demandes Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucune demande pour le moment</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vues des Propriétés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Graphiques à venir</p>
                      <p className="text-sm text-gray-500">Chart.js intégration</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tendances des Demandes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Analytics des demandes</p>
                      <p className="text-sm text-gray-500">Métriques interactives</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du Compte</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Paramètres à implémenter avec l'authentification</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
