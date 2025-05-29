'use client'

import { useState } from 'react'
import {
  Building2,
  Plus,
  Edit,
  Eye,
  Users,
  DollarSign,
  RefreshCw,
  Target,
  ArrowUp,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  Star,
  Filter,
  Download,
  Share2
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useUserProperties } from '@/hooks/use-user-properties'
import { useDashboardAnalytics } from '@/hooks/use-dashboard-analytics'
import { usePermissions } from '@/hooks/use-permissions'
import { useToast } from '@/hooks/use-toast'
import { SavedSearchesCard } from '@/components/saved-searches-card'
import { SearchAlertsCard } from '@/components/search-alerts-card'
import { ExportDataCard } from '@/components/export-data-card'
import { ReportGeneratorCard } from '@/components/report-generator-card'
import { MarketAnalysisCard } from '@/components/market-analysis-card'
import { PriceHistoryCard } from '@/components/price-history-card'
import { CRMDashboard } from '@/components/crm-dashboard'
import { CommissionTracker } from '@/components/commission-tracker'
import { AccessRestriction } from '@/components/access-restriction'
import { TasksManager } from '@/components/tasks-manager'

export default function DashboardPage () {
  const { can, userRole } = usePermissions()
  const {
    properties,
    loading: propertiesLoading,
    error: propertiesError,
    refetch: refetchProperties
  } = useUserProperties()
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const {
    analytics,
    loading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics
  } = useDashboardAnalytics(selectedPeriod)
  const { toast } = useToast()

  const loading = propertiesLoading || analyticsLoading
  const error = propertiesError || analyticsError

  if (loading) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='container mx-auto px-4 py-8'>
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-center'>
              <RefreshCw className='w-8 h-8 animate-spin mx-auto mb-4' />
              <p>Chargement de votre dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='container mx-auto px-4 py-8'>
          <div className='text-center py-12'>
            <p className='text-red-600 mb-4'>Erreur : {error}</p>
            <Button
              onClick={() => {
                refetchProperties()
                refetchAnalytics()
              }}
            >
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        <div className='space-y-8'>
          {/* Header avec actions rapides */}
          <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold mb-2'>Tableau de bord</h1>
              <p className='text-gray-600'>
                Vue d'ensemble de votre portefeuille immobilier
              </p>
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' size='sm'>
                <Download className='w-4 h-4 mr-2' />
                Exporter
              </Button>
              <Button variant='outline' size='sm'>
                <Share2 className='w-4 h-4 mr-2' />
                Partager
              </Button>
              <Link href='/list-property'>
                <Button size='sm'>
                  <Plus className='w-4 h-4 mr-2' />
                  Nouvelle propriété
                </Button>
              </Link>
            </div>
          </div>

          {/* Métriques principales */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <Card className='relative overflow-hidden'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Chiffre d'affaires
                    </p>
                    <p className='text-2xl font-bold'>
                      {analytics?.monthlyRevenue?.toLocaleString('fr-FR') || 0}€
                    </p>
                    <div className='flex items-center gap-1 text-sm text-green-600'>
                      <ArrowUp className='w-4 h-4' />+
                      {analytics?.monthlyGrowth || 0}% ce mois
                    </div>
                  </div>
                  <div className='p-3 bg-green-100 rounded-full'>
                    <DollarSign className='h-6 w-6 text-green-600' />
                  </div>
                </div>
                <div className='absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500'></div>
              </CardContent>
            </Card>

            <Card className='relative overflow-hidden'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Taux d'occupation
                    </p>
                    <p className='text-2xl font-bold'>
                      {analytics?.occupancyRate || 0}%
                    </p>
                    <Progress
                      value={analytics?.occupancyRate || 0}
                      className='mt-2'
                    />
                  </div>
                  <div className='p-3 bg-blue-100 rounded-full'>
                    <Building2 className='h-6 w-6 text-blue-600' />
                  </div>
                </div>
                <div className='absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500'></div>
              </CardContent>
            </Card>

            <Card className='relative overflow-hidden'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Nouvelles demandes
                    </p>
                    <p className='text-2xl font-bold'>
                      {analytics?.recentInquiries || 0}
                    </p>
                    <p className='text-xs text-gray-500'>
                      Sur {analytics?.totalInquiries || 0} total
                    </p>
                  </div>
                  <div className='p-3 bg-purple-100 rounded-full'>
                    <Users className='h-6 w-6 text-purple-600' />
                  </div>
                </div>
                <div className='absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500'></div>
              </CardContent>
            </Card>

            <Card className='relative overflow-hidden'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Propriétés actives
                    </p>
                    <p className='text-2xl font-bold'>
                      {analytics?.activeProperties || 0}
                    </p>
                    <p className='text-xs text-orange-600'>
                      {analytics?.pendingProperties || 0} en attente
                    </p>
                  </div>
                  <div className='p-3 bg-orange-100 rounded-full'>
                    <Building2 className='h-6 w-6 text-orange-600' />
                  </div>
                </div>
                <div className='absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500'></div>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal avec onglets */}
          <Tabs defaultValue='overview' className='space-y-6'>
            <TabsList
              className={`grid w-full ${
                can('canUseCRM')
                  ? 'grid-cols-7'
                  : can('canViewMarketAnalytics')
                  ? 'grid-cols-6'
                  : 'grid-cols-5'
              }`}
            >
              <TabsTrigger value='overview'>Vue d'ensemble</TabsTrigger>
              <TabsTrigger value='properties'>Propriétés</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              <TabsTrigger value='tasks'>Tâches</TabsTrigger>
              <TabsTrigger value='reports'>Rapports</TabsTrigger>
              {can('canViewMarketAnalytics') && (
                <TabsTrigger value='advanced'>Avancé</TabsTrigger>
              )}
              {can('canUseCRM') && <TabsTrigger value='crm'>CRM</TabsTrigger>}
            </TabsList>

            <TabsContent value='overview' className='space-y-6'>
              <div className='grid lg:grid-cols-3 gap-6'>
                {/* Activité récente */}
                <Card className='lg:col-span-2'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Activity className='w-5 h-5' />
                      Activité récente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {analytics?.recentActivities?.length === 0 ? (
                      <div className='text-center py-8'>
                        <Activity className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                        <p className='text-gray-600'>Aucune activité récente</p>
                      </div>
                    ) : (
                      analytics?.recentActivities?.map(activity => (
                        <div
                          key={activity.id}
                          className='flex items-center gap-3 p-3 rounded-lg bg-gray-50'
                        >
                          <div className='p-2 rounded-full bg-blue-100'>
                            <Users className='w-4 h-4 text-blue-600' />
                          </div>
                          <div className='flex-1'>
                            <p className='font-medium text-sm'>
                              {activity.message}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {new Date(activity.time).toLocaleString('fr-FR')}
                            </p>
                          </div>
                          <Badge variant='secondary'>{activity.priority}</Badge>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Propriétés les plus performantes */}
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Star className='w-5 h-5' />
                      Top Propriétés
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    {analytics?.topProperties?.length === 0 ? (
                      <div className='text-center py-8'>
                        <Star className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                        <p className='text-gray-600'>Aucune propriété</p>
                      </div>
                    ) : (
                      analytics?.topProperties
                        ?.slice(0, 3)
                        .map((property, index) => (
                          <div
                            key={property._id}
                            className='flex items-center gap-3 p-2 rounded border'
                          >
                            <div className='flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold text-sm'>
                              {index + 1}
                            </div>
                            <div className='flex-1'>
                              <p className='font-medium text-sm'>
                                {property.title}
                              </p>
                              <p className='text-xs text-gray-500'>
                                {property.views} vues
                              </p>
                            </div>
                          </div>
                        ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Propriétés avec vraies données */}
            <TabsContent value='properties'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between'>
                  <CardTitle>Mes Propriétés ({properties.length})</CardTitle>
                  <div className='flex gap-2'>
                    <Button variant='outline' size='sm'>
                      <Filter className='w-4 h-4 mr-2' />
                      Filtrer
                    </Button>
                    <Button variant='outline' size='sm'>
                      <BarChart3 className='w-4 h-4 mr-2' />
                      Analytics
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {properties.length === 0 ? (
                    <div className='text-center py-12'>
                      <Building2 className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                      <h3 className='text-lg font-semibold mb-2'>
                        Aucune propriété
                      </h3>
                      <p className='text-gray-600 mb-6'>
                        Commencez par ajouter votre première propriété
                      </p>
                      <Link href='/list-property'>
                        <Button>
                          <Plus className='w-4 h-4 mr-2' />
                          Ajouter une propriété
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Propriété</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Prix</TableHead>
                          <TableHead>Performance</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {properties.map(property => (
                          <TableRow key={property._id}>
                            <TableCell>
                              <div className='flex items-center gap-3'>
                                <Image
                                  src={
                                    property.images[0]?.url ||
                                    '/placeholder.svg?height=60&width=80'
                                  }
                                  alt={property.title}
                                  width={60}
                                  height={40}
                                  className='rounded object-cover'
                                />
                                <div>
                                  <div className='font-medium'>
                                    {property.title}
                                  </div>
                                  <div className='text-sm text-gray-600 flex items-center gap-1'>
                                    <MapPin className='w-3 h-3' />
                                    {property.surface}m²
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant='outline'>
                                {property.propertyType}
                              </Badge>
                            </TableCell>
                            <TableCell className='font-medium'>
                              {property.price.toLocaleString('fr-FR')}€
                              {property.transactionType === 'rent' && '/mois'}
                            </TableCell>
                            <TableCell>
                              <div className='space-y-1'>
                                <div className='flex items-center gap-2 text-sm'>
                                  <Eye className='w-3 h-3' />
                                  {property.views} vues
                                </div>
                                <div className='flex items-center gap-2 text-sm'>
                                  <Users className='w-3 h-3' />
                                  {property.inquiries} demandes
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  property.status === 'active'
                                    ? 'bg-green-600'
                                    : property.status === 'pending'
                                    ? 'bg-yellow-600'
                                    : 'bg-gray-600'
                                }
                              >
                                {property.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className='flex gap-1'>
                                <Button size='sm' variant='ghost'>
                                  <Eye className='w-4 h-4' />
                                </Button>
                                <Button size='sm' variant='ghost'>
                                  <Edit className='w-4 h-4' />
                                </Button>
                                <Button size='sm' variant='ghost'>
                                  <BarChart3 className='w-4 h-4' />
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

            {/* Autres onglets */}
            <TabsContent value='analytics'>
              <div className='grid lg:grid-cols-2 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Évolution du chiffre d'affaires</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center'>
                      <div className='text-center'>
                        <BarChart3 className='w-12 h-12 text-blue-500 mx-auto mb-2' />
                        <p className='text-gray-600'>Graphique Chart.js</p>
                        <p className='text-sm text-gray-500'>
                          Intégration à venir
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Répartition par type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='h-64 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center'>
                      <div className='text-center'>
                        <PieChart className='w-12 h-12 text-green-500 mx-auto mb-2' />
                        <p className='text-gray-600'>Graphique en secteurs</p>
                        <p className='text-sm text-gray-500'>
                          Données interactives
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value='tasks'>
              <TasksManager />
            </TabsContent>

            <TabsContent value='reports'>
              <Card>
                <CardHeader>
                  <CardTitle>Rapports et exports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-center py-12'>
                    <Download className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                    <h3 className='text-lg font-semibold mb-2'>
                      Rapports détaillés
                    </h3>
                    <p className='text-gray-600'>
                      Génération de rapports PDF et Excel
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Avancé - Disponible pour Premium et Agent */}
            {can('canViewMarketAnalytics') && (
              <TabsContent value='advanced' className='space-y-6'>
                <div className='grid lg:grid-cols-2 gap-6'>
                  {/* Recherches sauvegardées - Premium et Agent */}
                  <AccessRestriction action='canSaveSearches'>
                    <SavedSearchesCard />
                  </AccessRestriction>

                  {/* Alertes de recherche - Premium et Agent */}
                  <AccessRestriction action='canSetAlerts'>
                    <SearchAlertsCard />
                  </AccessRestriction>

                  {/* Analyse de marché - Premium et Agent */}
                  <AccessRestriction action='canViewMarketAnalytics'>
                    <MarketAnalysisCard
                      propertyId='dashboard-sample'
                      propertyType='Office'
                      location={{
                        city: 'Montreal',
                        state: 'QC'
                      }}
                    />
                  </AccessRestriction>

                  {/* Historique des prix - Premium et Agent */}
                  <AccessRestriction action='canViewPropertyHistory'>
                    <PriceHistoryCard propertyId='sample-property-id' />
                  </AccessRestriction>

                  {/* Export de données - Agent uniquement */}
                  <AccessRestriction action='canExportData'>
                    <ExportDataCard />
                  </AccessRestriction>

                  {/* Génération de rapports - Agent uniquement */}
                  <AccessRestriction action='canGenerateReports'>
                    <ReportGeneratorCard />
                  </AccessRestriction>
                </div>
              </TabsContent>
            )}

            {/* Onglet CRM - Agent uniquement */}
            {can('canUseCRM') && (
              <TabsContent value='crm' className='space-y-6'>
                <AccessRestriction action='canUseCRM'>
                  <CRMDashboard />
                </AccessRestriction>

                {/* Commission Tracker - Agent uniquement */}
                <AccessRestriction action='canUseCRM'>
                  <CommissionTracker />
                </AccessRestriction>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
