'use client'

import { useState, useEffect } from 'react'
import { usePermissions } from '@/hooks/use-permissions'
import { AccessRestriction } from '@/components/access-restriction'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, BarChart3, MapPin, Building, Calendar, RefreshCw, Download } from 'lucide-react'
import { toast } from 'sonner'

interface MarketData {
  id: string
  region: string
  propertyType: string
  avgPrice: number
  priceChange: number
  supply: number
  demand: number
  trend: 'up' | 'down' | 'stable'
  demographics: {
    population: number
    medianIncome: number
    employmentRate: number
  }
  forecast: {
    sixMonths: number
    oneYear: number
    twoYears: number
  }
  lastUpdated: Date
}

interface MarketMetrics {
  totalProperties: number
  avgSqmPrice: number
  marketActivity: number
  investmentPotential: number
}

export default function MarketAnalysisPage() {
  const { can } = usePermissions()
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [metrics, setMetrics] = useState<MarketMetrics | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const title = 'Analyse de Marché'
  const description = 'Accédez aux analyses de marché avancées et aux tendances locales pour prendre des décisions éclairées.'

  // Vérifier si l'utilisateur a la permission d'utiliser cette fonctionnalité
  if (!can('canViewMarketAnalytics')) {
    return (
      <AccessRestriction
        action='canViewMarketAnalytics'
        requiredLevel='premium'
        showUpgradePrompt={true}
      >
        <div className='container mx-auto py-8 max-w-4xl'>
          <Card>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </AccessRestriction>
    )
  }

  const loadMarketData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/market-analysis?region=${selectedRegion}&propertyType=${selectedPropertyType}`)
      if (response.ok) {
        const data = await response.json()
        setMarketData(data.markets || [])
        setMetrics(data.metrics)
        setLastUpdate(new Date())
      } else {
        throw new Error('Erreur lors du chargement des données')
      }
    } catch (error) {
      console.error('Erreur:', error)
      // Données de démonstration
      const mockData: MarketData[] = [
        {
          id: '1',
          region: 'Paris 1er',
          propertyType: 'Bureau',
          avgPrice: 850000,
          priceChange: 5.2,
          supply: 45,
          demand: 78,
          trend: 'up',
          demographics: { population: 16500, medianIncome: 65000, employmentRate: 92 },
          forecast: { sixMonths: 2.5, oneYear: 4.8, twoYears: 8.3 },
          lastUpdated: new Date()
        },
        {
          id: '2',
          region: 'La Défense',
          propertyType: 'Bureau',
          avgPrice: 720000,
          priceChange: -1.8,
          supply: 67,
          demand: 52,
          trend: 'down',
          demographics: { population: 180000, medianIncome: 58000, employmentRate: 89 },
          forecast: { sixMonths: -0.5, oneYear: 1.2, twoYears: 3.5 },
          lastUpdated: new Date()
        },
        {
          id: '3',
          region: 'Lyon Centre',
          propertyType: 'Commerce',
          avgPrice: 450000,
          priceChange: 3.1,
          supply: 32,
          demand: 89,
          trend: 'up',
          demographics: { population: 125000, medianIncome: 42000, employmentRate: 87 },
          forecast: { sixMonths: 3.8, oneYear: 6.2, twoYears: 11.5 },
          lastUpdated: new Date()
        }
      ]
      setMarketData(mockData)
      setMetrics({
        totalProperties: 1247,
        avgSqmPrice: 6500,
        marketActivity: 78,
        investmentPotential: 85
      })
      toast.info('Données de démonstration chargées')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/market-analysis/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region: selectedRegion, propertyType: selectedPropertyType })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `analyse-marche-${new Date().toISOString().slice(0, 10)}.xlsx`
        a.click()
        toast.success('Export réalisé avec succès')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'export')
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />
      default: return <BarChart3 className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = (change: number) => {
    return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
  }

  useEffect(() => {
    loadMarketData()
  }, [selectedRegion, selectedPropertyType])

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex flex-col gap-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground mt-2">{description}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadMarketData} disabled={isLoading} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button onClick={handleExportData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Région</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une région" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les régions</SelectItem>
                    <SelectItem value="paris">Paris</SelectItem>
                    <SelectItem value="lyon">Lyon</SelectItem>
                    <SelectItem value="marseille">Marseille</SelectItem>
                    <SelectItem value="lille">Lille</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Type de bien</label>
                <Select value={selectedPropertyType} onValueChange={setSelectedPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="bureau">Bureau</SelectItem>
                    <SelectItem value="commerce">Commerce</SelectItem>
                    <SelectItem value="entrepot">Entrepôt</SelectItem>
                    <SelectItem value="industrie">Industrie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métriques globales */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Propriétés totales</p>
                    <p className="text-2xl font-bold">{metrics.totalProperties.toLocaleString()}</p>
                  </div>
                  <Building className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Prix moyen/m²</p>
                    <p className="text-2xl font-bold">{metrics.avgSqmPrice.toLocaleString()} €</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Activité marché</p>
                    <p className="text-2xl font-bold">{metrics.marketActivity}%</p>
                  </div>
                  <Progress value={metrics.marketActivity} className="w-12 h-2 mt-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Potentiel investissement</p>
                    <p className="text-2xl font-bold">{metrics.investmentPotential}%</p>
                  </div>
                  <Progress value={metrics.investmentPotential} className="w-12 h-2 mt-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Données de marché */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="demographics">Démographie</TabsTrigger>
            <TabsTrigger value="forecasts">Prévisions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {marketData.map((market) => (
                <Card key={market.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          {market.region}
                        </CardTitle>
                        <CardDescription>{market.propertyType}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(market.trend)}
                        <Badge variant={market.trend === 'up' ? 'default' : market.trend === 'down' ? 'destructive' : 'secondary'}>
                          {market.trend === 'up' ? 'Hausse' : market.trend === 'down' ? 'Baisse' : 'Stable'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Prix moyen</span>
                        <div className="text-right">
                          <div className="font-bold">{market.avgPrice.toLocaleString()} €</div>
                          <div className={`text-sm ${getTrendColor(market.priceChange)}`}>
                            {market.priceChange > 0 ? '+' : ''}{market.priceChange}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Offre</span>
                          <span>{market.supply} biens</span>
                        </div>
                        <Progress value={market.supply} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Demande</span>
                          <span>{market.demand} recherches</span>
                        </div>
                        <Progress value={market.demand} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="demographics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {marketData.map((market) => (
                <Card key={market.id}>
                  <CardHeader>
                    <CardTitle>{market.region}</CardTitle>
                    <CardDescription>Données démographiques et économiques</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Population</span>
                        <span className="font-bold">{market.demographics.population.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Revenu médian</span>
                        <span className="font-bold">{market.demographics.medianIncome.toLocaleString()} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Taux d'emploi</span>
                        <span className="font-bold">{market.demographics.employmentRate}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="forecasts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {marketData.map((market) => (
                <Card key={market.id}>
                  <CardHeader>
                    <CardTitle>{market.region}</CardTitle>
                    <CardDescription>Prévisions d'évolution des prix</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">6 mois</span>
                        <span className={`font-bold ${getTrendColor(market.forecast.sixMonths)}`}>
                          {market.forecast.sixMonths > 0 ? '+' : ''}{market.forecast.sixMonths}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">1 an</span>
                        <span className={`font-bold ${getTrendColor(market.forecast.oneYear)}`}>
                          {market.forecast.oneYear > 0 ? '+' : ''}{market.forecast.oneYear}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">2 ans</span>
                        <span className={`font-bold ${getTrendColor(market.forecast.twoYears)}`}>
                          {market.forecast.twoYears > 0 ? '+' : ''}{market.forecast.twoYears}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Dernière mise à jour */}
        <div className="text-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 inline mr-1" />
          Dernière mise à jour : {lastUpdate.toLocaleString('fr-FR')}
        </div>
      </div>
    </div>
  )
}
