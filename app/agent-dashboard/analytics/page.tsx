'use client'

import { useState } from 'react'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { 
  Download, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Eye, 
  MessageSquare, 
  Building2 
} from 'lucide-react'
import { RoleGuard } from '@/components/role-guard'

// Données fictives pour les graphiques
const viewsData = [
  { name: 'Jan', views: 400 },
  { name: 'Fév', views: 300 },
  { name: 'Mar', views: 600 },
  { name: 'Avr', views: 800 },
  { name: 'Mai', views: 700 },
  { name: 'Juin', views: 900 },
  { name: 'Juil', views: 1000 },
  { name: 'Août', views: 1200 },
  { name: 'Sep', views: 1100 },
  { name: 'Oct', views: 1300 },
  { name: 'Nov', views: 1500 },
  { name: 'Déc', views: 1400 },
]

const inquiriesData = [
  { name: 'Jan', inquiries: 20 },
  { name: 'Fév', inquiries: 15 },
  { name: 'Mar', inquiries: 30 },
  { name: 'Avr', inquiries: 40 },
  { name: 'Mai', inquiries: 35 },
  { name: 'Juin', inquiries: 45 },
  { name: 'Juil', inquiries: 50 },
  { name: 'Août', inquiries: 60 },
  { name: 'Sep', inquiries: 55 },
  { name: 'Oct', inquiries: 65 },
  { name: 'Nov', inquiries: 75 },
  { name: 'Déc', inquiries: 70 },
]

const conversionData = [
  { name: 'Jan', rate: 5 },
  { name: 'Fév', rate: 5 },
  { name: 'Mar', rate: 5 },
  { name: 'Avr', rate: 5 },
  { name: 'Mai', rate: 5 },
  { name: 'Juin', rate: 5 },
  { name: 'Juil', rate: 5 },
  { name: 'Août', rate: 5 },
  { name: 'Sep', rate: 5 },
  { name: 'Oct', rate: 5 },
  { name: 'Nov', rate: 5 },
  { name: 'Déc', rate: 5 },
]

const propertyTypeData = [
  { name: 'Appartements', value: 45 },
  { name: 'Maisons', value: 30 },
  { name: 'Bureaux', value: 15 },
  { name: 'Commerces', value: 10 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const topProperties = [
  { id: 1, title: 'Appartement de luxe à Paris', views: 1245, inquiries: 32 },
  { id: 2, title: 'Villa avec piscine à Nice', views: 987, inquiries: 28 },
  { id: 3, title: 'Loft moderne à Lyon', views: 876, inquiries: 24 },
  { id: 4, title: 'Maison de campagne à Bordeaux', views: 765, inquiries: 20 },
  { id: 5, title: 'Studio au cœur de Marseille', views: 654, inquiries: 18 },
]

export default function AgentAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('year')
  const [propertyFilter, setPropertyFilter] = useState('all')

  return (
    <RoleGuard allowedRoles={['agent', 'admin']} message="Vous devez être un agent pour accéder à cette page.">
      <div className="container mx-auto py-8">
        <div className="flex flex-col space-y-8">
          {/* En-tête */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Statistiques</h1>
              <p className="text-gray-500 mt-1">
                Analysez les performances de vos annonces immobilières
              </p>
            </div>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">7 derniers jours</SelectItem>
                  <SelectItem value="month">30 derniers jours</SelectItem>
                  <SelectItem value="quarter">3 derniers mois</SelectItem>
                  <SelectItem value="year">12 derniers mois</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>

          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Vues totales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12,543</div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% depuis le mois dernier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Demandes reçues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">543</div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.2% depuis le mois dernier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Taux de conversion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4.3%</div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +0.5% depuis le mois dernier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Propriétés actives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24</div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2 depuis le mois dernier
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Onglets pour les différents graphiques */}
          <Tabs defaultValue="views" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="views">
                <Eye className="h-4 w-4 mr-2" />
                Vues
              </TabsTrigger>
              <TabsTrigger value="inquiries">
                <MessageSquare className="h-4 w-4 mr-2" />
                Demandes
              </TabsTrigger>
              <TabsTrigger value="properties">
                <Building2 className="h-4 w-4 mr-2" />
                Propriétés
              </TabsTrigger>
            </TabsList>

            {/* Contenu de l'onglet Vues */}
            <TabsContent value="views" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des vues</CardTitle>
                  <CardDescription>
                    Nombre total de vues de vos propriétés au cours des 12 derniers mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={viewsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="views" fill="#3b82f6" name="Vues" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Vues par jour de la semaine</CardTitle>
                    <CardDescription>
                      Répartition des vues selon les jours de la semaine
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { day: 'Lun', views: 120 },
                          { day: 'Mar', views: 150 },
                          { day: 'Mer', views: 180 },
                          { day: 'Jeu', views: 170 },
                          { day: 'Ven', views: 190 },
                          { day: 'Sam', views: 220 },
                          { day: 'Dim', views: 200 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="views" fill="#3b82f6" name="Vues" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Vues par heure</CardTitle>
                    <CardDescription>
                      Répartition des vues selon l'heure de la journée
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { hour: '00h', views: 10 },
                          { hour: '02h', views: 5 },
                          { hour: '04h', views: 3 },
                          { hour: '06h', views: 8 },
                          { hour: '08h', views: 25 },
                          { hour: '10h', views: 45 },
                          { hour: '12h', views: 65 },
                          { hour: '14h', views: 70 },
                          { hour: '16h', views: 80 },
                          { hour: '18h', views: 90 },
                          { hour: '20h', views: 75 },
                          { hour: '22h', views: 40 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hour" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="views" stroke="#3b82f6" name="Vues" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Contenu de l'onglet Demandes */}
            <TabsContent value="inquiries" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des demandes</CardTitle>
                  <CardDescription>
                    Nombre total de demandes reçues au cours des 12 derniers mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={inquiriesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="inquiries" stroke="#10b981" name="Demandes" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Taux de conversion</CardTitle>
                  <CardDescription>
                    Pourcentage de vues qui se convertissent en demandes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={conversionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis unit="%" />
                        <Tooltip formatter={(value) => [`${value}%`, 'Taux']} />
                        <Legend />
                        <Line type="monotone" dataKey="rate" stroke="#f59e0b" name="Taux de conversion" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contenu de l'onglet Propriétés */}
            <TabsContent value="properties" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition par type de propriété</CardTitle>
                    <CardDescription>
                      Distribution de vos annonces par catégorie
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={propertyTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {propertyTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}`, 'Nombre']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Propriétés les plus populaires</CardTitle>
                    <CardDescription>
                      Classement de vos propriétés par nombre de vues
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topProperties.map((property) => (
                        <div key={property.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                          <div className="flex-1">
                            <p className="font-medium truncate">{property.title}</p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Eye className="h-3 w-3 mr-1" />
                              <span>{property.views} vues</span>
                              <MessageSquare className="h-3 w-3 ml-3 mr-1" />
                              <span>{property.inquiries} demandes</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">
                              {(property.inquiries / property.views * 100).toFixed(1)}%
                            </span>
                            <p className="text-xs text-gray-500">Conversion</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RoleGuard>
  )
}