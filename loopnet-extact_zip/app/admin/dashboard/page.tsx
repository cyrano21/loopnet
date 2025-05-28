"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RoleSwitcher } from "@/components/role-switcher"
import {
  Users,
  Building,
  TrendingUp,
  DollarSign,
  Crown,
  Star,
  User,
  Eye,
  Settings,
  Database,
  BarChart3,
  FileText,
  Bell,
  CreditCard,
  Shield,
  Search,
  Upload,
  Globe,
  Heart,
  Activity,
} from "lucide-react"
import Link from "next/link"

// Configuration pour désactiver le prerendering
export const dynamic = "force-dynamic"
export const revalidate = 0

interface DashboardStats {
  users: {
    total: number
    admin: number
    agent: number
    premium: number
    simple: number
    guest: number
  }
  properties: {
    total: number
    active: number
    pending: number
  }
  revenue: {
    monthly: number
    yearly: number
  }
  activity: {
    newUsersThisMonth: number
    propertiesAddedThisMonth: number
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard-stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🚀 Dashboard Admin</h1>
        <div className="flex gap-4">
          <RoleSwitcher />
          <Link href="/admin">
            <Button variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Retour Admin
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users.total || 0}</div>
            <p className="text-xs text-muted-foreground">+{stats?.activity.newUsersThisMonth || 0} ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propriétés</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.properties.total || 0}</div>
            <p className="text-xs text-muted-foreground">+{stats?.activity.propertiesAddedThisMonth || 0} ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.revenue.monthly || 0}</div>
            <p className="text-xs text-muted-foreground">${stats?.revenue.yearly || 0} cette année</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Croissance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">vs mois dernier</p>
          </CardContent>
        </Card>
      </div>

      {/* Répartition des utilisateurs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>📊 Répartition des Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-red-500" />
                <span>Admins</span>
              </div>
              <span className="font-semibold">{stats?.users.admin || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <span>Agents</span>
              </div>
              <span className="font-semibold">{stats?.users.agent || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-purple-500" />
                <span>Premium</span>
              </div>
              <span className="font-semibold">{stats?.users.premium || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                <span>Simple</span>
              </div>
              <span className="font-semibold">{stats?.users.simple || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-gray-500" />
                <span>Invités</span>
              </div>
              <span className="font-semibold">{stats?.users.guest || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>⚡ Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/users">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />👥 Gérer les Utilisateurs
              </Button>
            </Link>
            <Link href="/properties">
              <Button className="w-full justify-start" variant="outline">
                <Building className="h-4 w-4 mr-2" />🏢 Gérer les Propriétés
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />📈 Analytics Avancées
              </Button>
            </Link>
            <Link href="/seed-data">
              <Button className="w-full justify-start" variant="outline">
                <Database className="h-4 w-4 mr-2" />🌱 Peupler la Base
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button className="w-full justify-start" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                ⚙️ Paramètres Système
              </Button>
            </Link>
            <Link href="/admin/activity">
              <Button className="w-full justify-start" variant="outline">
                <Activity className="h-4 w-4 mr-2" />📊 Monitoring Activités
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Sections de gestion détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gestion des Utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />👥 Gestion Utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/users">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Tous les Utilisateurs
              </Button>
            </Link>
            <Link href="/admin/users?filter=admin">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <Crown className="h-4 w-4 mr-2" />
                Gérer les Admins
              </Button>
            </Link>
            <Link href="/admin/users?filter=agent">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Gérer les Agents
              </Button>
            </Link>
            <Link href="/admin/users?filter=premium">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <Star className="h-4 w-4 mr-2" />
                Utilisateurs Premium
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Gestion du Contenu */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />🏢 Gestion Contenu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/properties">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <Building className="h-4 w-4 mr-2" />
                Toutes les Propriétés
              </Button>
            </Link>
            <Link href="/professionals">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Professionnels
              </Button>
            </Link>
            <Link href="/news">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Actualités
              </Button>
            </Link>
            <Link href="/admin/scraping">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Scraping Données
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Outils et Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />🔧 Outils & Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/seed-data">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <Database className="h-4 w-4 mr-2" />
                Peupler Base Données
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres Système
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics Détaillées
              </Button>
            </Link>
            <Link href="/notifications">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Section Stripe et Paiements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />💳 Gestion Stripe & Paiements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/pricing">
              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                Plans Tarifaires
              </Button>
            </Link>
            <Link href="/checkout">
              <Button className="w-full justify-start" variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                Page Checkout
              </Button>
            </Link>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => window.open("https://dashboard.stripe.com", "_blank")}
            >
              <Globe className="h-4 w-4 mr-2" />
              Dashboard Stripe
            </Button>
            <Link href="/admin/settings">
              <Button className="w-full justify-start" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Config Stripe
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Liens directs vers toutes les pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />🌐 Navigation Rapide - Toutes les Pages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <Link href="/admin/dashboard">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                /admin/dashboard
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <Users className="h-4 w-4 mr-2" />
                /admin/users
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                /admin/settings
              </Button>
            </Link>
            <Link href="/seed-data">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <Database className="h-4 w-4 mr-2" />
                /seed-data
              </Button>
            </Link>
            <Link href="/properties">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <Building className="h-4 w-4 mr-2" />
                /properties
              </Button>
            </Link>
            <Link href="/professionals">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <Users className="h-4 w-4 mr-2" />
                /professionals
              </Button>
            </Link>
            <Link href="/news">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                /news
              </Button>
            </Link>
            <Link href="/pricing">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <DollarSign className="h-4 w-4 mr-2" />
                /pricing
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                /dashboard
              </Button>
            </Link>
            <Link href="/favorites">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                /favorites
              </Button>
            </Link>
            <Link href="/list-property">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                /list-property
              </Button>
            </Link>
            <Link href="/market-data">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                /market-data
              </Button>
            </Link>
            <Link href="/admin/activity">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <Activity className="h-4 w-4 mr-2" />
                /admin/activity
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
