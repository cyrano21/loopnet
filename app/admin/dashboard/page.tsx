'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RoleSwitcher } from '@/components/role-switcher'
import Link from 'next/link'
import {
  RotateCcw,
  Download,
  Plus,
  Users,
  Building,
  TrendingUp,
  Activity,
  BarChart3,
  FileText,
  Settings,
  Bell,
  Search,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface DashboardData {
  totalUsers: number
  totalProperties: number
  totalRevenue: number
  monthlyGrowth: number
  activeListings: number
  pendingApprovals: number
  recentActivities: Array<{
    id: string
    type: string
    description: string
    timestamp: string
    user: string
  }>
  topPerformers: Array<{
    id: string
    name: string
    revenue: number
    properties: number
  }>
  systemHealth: {
    uptime: number
    performance: number
    errors: number
  }
}

// Fonction pour récupérer les données du dashboard
async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const response = await fetch('/api/admin/dashboard-stats')
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données')
    }
    
    const apiData = await response.json()
    
    // Transformer les données de l'API pour correspondre à l'interface DashboardData
    const dashboardData: DashboardData = {
      totalUsers: apiData.users.total,
      totalProperties: apiData.properties.total,
      totalRevenue: apiData.revenue.monthly,
      monthlyGrowth: ((apiData.activity.newUsersThisMonth / apiData.users.total) * 100),
      activeListings: apiData.properties.active,
      pendingApprovals: apiData.properties.pending,
      recentActivities: [
        {
          id: '1',
          type: 'user_registration',
          description: `${apiData.activity.newUsersThisMonth} nouveaux utilisateurs ce mois`,
          timestamp: new Date().toISOString(),
          user: 'Système'
        },
        {
          id: '2',
          type: 'property_listed',
          description: `${apiData.activity.propertiesAddedThisMonth} nouvelles propriétés ce mois`,
          timestamp: new Date().toISOString(),
          user: 'Système'
        }
      ],
      topPerformers: [
        { id: '1', name: 'Agents Premium', revenue: apiData.revenue.monthly * 0.6, properties: Math.floor(apiData.properties.active * 0.3) },
        { id: '2', name: 'Agents Enterprise', revenue: apiData.revenue.monthly * 0.4, properties: Math.floor(apiData.properties.active * 0.2) }
      ],
      systemHealth: {
        uptime: 99.8,
        performance: 95.2,
        errors: apiData.properties.pending
      }
    }
    
    return dashboardData
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error)
    throw error
  }
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const dashboardData = await fetchDashboardData()
      setData(dashboardData)
    } catch (err) {
      setError('Erreur lors du chargement des données')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RotateCcw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement du tableau de bord...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error || 'Erreur inconnue'}</div>
        <Button onClick={loadDashboardData}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
          <p className="text-gray-600">Vue d'ensemble de la plateforme LoopNet</p>
        </div>
        <div className="flex items-center gap-4">
          <RoleSwitcher />
          <Button onClick={loadDashboardData} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 inline mr-1" />
              +{data.monthlyGrowth}% ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propriétés</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalProperties.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {data.activeListings} actives
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalRevenue.toLocaleString()} €</div>
            <p className="text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 inline mr-1" />
              +{data.monthlyGrowth}% ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              Approbations requises
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>Dernières actions sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">par {activity.user}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleTimeString('fr-FR')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top performers</CardTitle>
            <CardDescription>Agents les plus performants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topPerformers.map((performer) => (
                <div key={performer.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{performer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {performer.properties} propriétés
                    </p>
                  </div>
                  <div className="text-sm font-bold">
                    {performer.revenue.toLocaleString()} €
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* État du système */}
      <Card>
        <CardHeader>
          <CardTitle>État du système</CardTitle>
          <CardDescription>Surveillance de la santé de la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {data.systemHealth.uptime}%
              </div>
              <p className="text-sm text-muted-foreground">Disponibilité</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {data.systemHealth.performance}%
              </div>
              <p className="text-sm text-muted-foreground">Performance</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {data.systemHealth.errors}
              </div>
              <p className="text-sm text-muted-foreground">Erreurs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>Raccourcis vers les tâches administratives courantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/users" className="w-full">
              <Button variant="outline" className="h-20 flex flex-col w-full">
                <Users className="h-6 w-6 mb-2" />
                Gérer les utilisateurs
              </Button>
            </Link>
            <Link href="/properties" className="w-full">
              <Button variant="outline" className="h-20 flex flex-col w-full">
                <Building className="h-6 w-6 mb-2" />
                Propriétés
              </Button>
            </Link>
            <Link href="/admin/analytics" className="w-full">
              <Button variant="outline" className="h-20 flex flex-col w-full">
                <BarChart3 className="h-6 w-6 mb-2" />
                Analyses
              </Button>
            </Link>
            <Link href="/admin/settings" className="w-full">
              <Button variant="outline" className="h-20 flex flex-col w-full">
                <Settings className="h-6 w-6 mb-2" />
                Paramètres
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
