"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Building2,
  Users,
  BarChart3,
  Settings,
  Shield,
  Activity,
  DollarSign,
  TrendingUp,
  Eye,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  Download,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Database,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const [searchTerm, setSearchTerm] = useState("")

  // Redirection si pas admin
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!session || session.user.role !== "admin") {
    router.push("/dashboard")
    return null
  }

  // Données simulées pour l'admin
  const adminStats = {
    totalUsers: 1247,
    totalProperties: 3892,
    totalRevenue: 2847392,
    activeAgents: 156,
    pendingApprovals: 23,
    monthlyGrowth: 12.5,
    systemHealth: 98.7,
    supportTickets: 8,
  }

  const recentUsers = [
    { id: 1, name: "Marie Dubois", email: "marie@example.com", role: "user", status: "active", joinDate: "2024-01-15" },
    {
      id: 2,
      name: "Pierre Martin",
      email: "pierre@example.com",
      role: "agent",
      status: "pending",
      joinDate: "2024-01-14",
    },
    {
      id: 3,
      name: "Sophie Laurent",
      email: "sophie@example.com",
      role: "user",
      status: "active",
      joinDate: "2024-01-13",
    },
  ]

  const recentProperties = [
    {
      id: 1,
      title: "Appartement Paris 16e",
      owner: "Marie Dubois",
      status: "pending",
      price: 850000,
      type: "Appartement",
    },
    { id: 2, title: "Villa Cannes", owner: "Pierre Martin", status: "active", price: 2500000, type: "Villa" },
    { id: 3, title: "Bureau Lyon", owner: "Sophie Laurent", status: "review", price: 450000, type: "Bureau" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header Admin */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-6 h-6 text-red-600" />
                <h1 className="text-3xl font-bold">Administration</h1>
                <Badge className="bg-red-100 text-red-800">ADMIN</Badge>
              </div>
              <p className="text-gray-600">Gestion complète de la plateforme LoopNet</p>
            </div>
            <div className="flex gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 derniers jours</SelectItem>
                  <SelectItem value="30d">30 derniers jours</SelectItem>
                  <SelectItem value="90d">90 derniers jours</SelectItem>
                  <SelectItem value="1y">1 an</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Navigation rapide vers les autres dashboards */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Accès aux Dashboards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Dashboard Utilisateur
                  </Button>
                </Link>
                <Link href="/agent-dashboard">
                  <Button variant="outline" className="w-full justify-start">
                    <Building2 className="w-4 h-4 mr-2" />
                    Dashboard Agent
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button variant="default" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Dashboard Admin (Actuel)
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Actions de peuplement de données */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Gestion des Données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  onClick={async () => {
                    try {
                      const response = await fetch("/api/seed", { method: "POST" })
                      if (response.ok) {
                        alert("Propriétés ajoutées avec succès !")
                      }
                    } catch (error) {
                      alert("Erreur lors du peuplement")
                    }
                  }}
                  className="w-full"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Seed Propriétés
                </Button>

                <Button
                  onClick={async () => {
                    try {
                      const response = await fetch("/api/seed-news", { method: "POST" })
                      if (response.ok) {
                        alert("Articles ajoutés avec succès !")
                      }
                    } catch (error) {
                      alert("Erreur lors du peuplement")
                    }
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Seed News
                </Button>

                <Button
                  onClick={async () => {
                    try {
                      const response = await fetch("/api/professionals", { method: "POST" })
                      if (response.ok) {
                        alert("Professionnels ajoutés avec succès !")
                      }
                    } catch (error) {
                      alert("Erreur lors du peuplement")
                    }
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Seed Professionnels
                </Button>

                <Button
                  onClick={async () => {
                    try {
                      await fetch("/api/seed", { method: "POST" })
                      await fetch("/api/seed-news", { method: "POST" })
                      await fetch("/api/professionals", { method: "POST" })
                      alert("Toutes les données ont été ajoutées !")
                    } catch (error) {
                      alert("Erreur lors du peuplement complet")
                    }
                  }}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Peupler Tout
                </Button>
                <Link href="/seed-data">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Database className="w-4 h-4 mr-2" />
                    Page Seed Data Complète
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Métriques globales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenus Totaux</p>
                    <p className="text-2xl font-bold">{adminStats.totalRevenue.toLocaleString("fr-FR")}€</p>
                    <p className="text-xs text-green-600">+{adminStats.monthlyGrowth}% ce mois</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                    <p className="text-2xl font-bold">{adminStats.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-blue-600">{adminStats.activeAgents} agents actifs</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Propriétés</p>
                    <p className="text-2xl font-bold">{adminStats.totalProperties.toLocaleString()}</p>
                    <p className="text-xs text-purple-600">Toutes catégories</p>
                  </div>
                  <Building2 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">En Attente</p>
                    <p className="text-2xl font-bold">{adminStats.pendingApprovals}</p>
                    <p className="text-xs text-orange-600">Approbations requises</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal avec onglets */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
              <TabsTrigger value="properties">Propriétés</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="system">Système</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
              <TabsTrigger value="ads">Publicités</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Activité système */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Activité Système
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <UserCheck className="w-5 h-5 text-green-600" />
                          <span>Nouvel utilisateur inscrit</span>
                        </div>
                        <span className="text-sm text-gray-500">Il y a 5 min</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-blue-600" />
                          <span>Propriété publiée</span>
                        </div>
                        <span className="text-sm text-gray-500">Il y a 12 min</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                          <span>Propriété en attente de validation</span>
                        </div>
                        <span className="text-sm text-gray-500">Il y a 25 min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Santé du système */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Santé du Système
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Performance globale</span>
                        <Badge className="bg-green-100 text-green-800">{adminStats.systemHealth}%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tickets de support</span>
                        <Badge className="bg-blue-100 text-blue-800">{adminStats.supportTickets} ouverts</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Temps de réponse API</span>
                        <Badge className="bg-green-100 text-green-800">142ms</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Disponibilité</span>
                        <Badge className="bg-green-100 text-green-800">99.9%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Gestion des Utilisateurs</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Rechercher un utilisateur..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-64"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Nouvel utilisateur
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date d'inscription</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-600">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                user.role === "admin"
                                  ? "bg-red-100 text-red-800"
                                  : user.role === "agent"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                user.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : user.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(user.joinDate).toLocaleDateString("fr-FR")}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Gestion des Propriétés</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Propriété</TableHead>
                        <TableHead>Propriétaire</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentProperties.map((property) => (
                        <TableRow key={property.id}>
                          <TableCell className="font-medium">{property.title}</TableCell>
                          <TableCell>{property.owner}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{property.type}</Badge>
                          </TableCell>
                          <TableCell>{property.price.toLocaleString("fr-FR")}€</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                property.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : property.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-orange-100 text-orange-800"
                              }
                            >
                              {property.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <UserCheck className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Globales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                        <p className="text-gray-600">Graphiques Chart.js</p>
                        <p className="text-sm text-gray-500">Analytics détaillées</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Métriques Temps Réel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Utilisateurs en ligne</span>
                        <Badge className="bg-green-100 text-green-800">247</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Nouvelles inscriptions (24h)</span>
                        <Badge className="bg-blue-100 text-blue-800">12</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Propriétés vues (24h)</span>
                        <Badge className="bg-purple-100 text-purple-800">1,847</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Revenus (24h)</span>
                        <Badge className="bg-green-100 text-green-800">8,450€</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monitoring Système</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Monitoring Avancé</h3>
                    <p className="text-gray-600">Surveillance des performances et logs système</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuration Plateforme</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Paramètres Globaux</h3>
                    <p className="text-gray-600">Configuration de la plateforme et des fonctionnalités</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ads" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Gestion des Publicités</CardTitle>
                  <div className="flex gap-2">
                    <Link href="/admin/advertisements">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Nouvelle Publicité
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Gestion des Publicités</h3>
                    <p className="text-gray-600 mb-4">Créez et gérez les bannières publicitaires</p>
                    <Link href="/admin/advertisements">
                      <Button>Accéder à la gestion</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
