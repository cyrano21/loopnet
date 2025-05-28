"use client"

import { RoleGuard } from "@/components/role-guard"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Users, Building, DollarSign, Eye, Download, Calendar } from "lucide-react"

function AnalyticsContent() {
  const [dateRange, setDateRange] = useState("30d")
  const [propertyType, setPropertyType] = useState("all")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">📊 Analytics Premium</h1>
              <p className="text-gray-600">Analyses avancées et insights de marché</p>
            </div>
            <div className="flex gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
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
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vues Totales</p>
                    <p className="text-2xl font-bold">45,231</p>
                    <p className="text-xs text-green-600">+12.5% vs mois dernier</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taux de Conversion</p>
                    <p className="text-2xl font-bold">3.2%</p>
                    <p className="text-xs text-green-600">+0.8% vs mois dernier</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Valeur Moyenne</p>
                    <p className="text-2xl font-bold">€2.1M</p>
                    <p className="text-xs text-orange-600">-5.2% vs mois dernier</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Temps sur Site</p>
                    <p className="text-2xl font-bold">4m 32s</p>
                    <p className="text-xs text-green-600">+18.3% vs mois dernier</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="properties">Propriétés</TabsTrigger>
              <TabsTrigger value="market">Marché</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
              <TabsTrigger value="reports">Rapports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Évolution du Trafic</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                        <p className="text-gray-600">Graphique Chart.js</p>
                        <p className="text-sm text-gray-500">Données en temps réel</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Propriétés</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">{i}</span>
                          </div>
                          <div>
                            <p className="font-medium">Bureau Centre-ville #{i}</p>
                            <p className="text-sm text-gray-600">1,247 vues</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">€2.5M</p>
                          <p className="text-xs text-green-600">+12%</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="properties" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance des Propriétés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analytics Propriétés</h3>
                    <p className="text-gray-600">Analyses détaillées par propriété</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="market" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analyse de Marché</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Tendances du Marché</h3>
                    <p className="text-gray-600">Insights et prédictions</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comportement Utilisateurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analytics Utilisateurs</h3>
                    <p className="text-gray-600">Parcours et engagement</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rapports Personnalisés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Génération de Rapports</h3>
                    <p className="text-gray-600">Exports PDF et Excel</p>
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

export default function AnalyticsPage() {
  return (
    <RoleGuard allowedRoles={["admin", "agent", "premium"]} redirectTo="/pricing?upgrade=premium">
      <AnalyticsContent />
    </RoleGuard>
  )
}
