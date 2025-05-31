'use client'

import { useState, useEffect } from 'react'
import { usePermissions } from '@/hooks/use-permissions'
import { AccessRestriction } from '@/components/access-restriction'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, TrendingUp, TrendingDown, Calendar, BarChart3, Download, RefreshCw, LineChart } from 'lucide-react'
import { toast } from 'sonner'

interface PricePoint {
  date: string
  price: number
  pricePerSqm: number
  change: number
}

interface PropertyHistory {
  id: string
  address: string
  propertyType: string
  size: number
  currentPrice: number
  priceHistory: PricePoint[]
  trends: {
    monthly: number
    quarterly: number
    yearly: number
    allTime: number
  }
  marketComparison: {
    vsMarket: number
    vsRegion: number
    vsType: number
  }
  lastSale: {
    date: string
    price: number
    buyer: string
  }
}

interface MarketTrends {
  region: string
  avgPriceChange: number
  transactionVolume: number
  daysOnMarket: number
  pricePerSqm: number
}

export default function PriceHistoryPage() {
  const { can } = usePermissions()
  const [properties, setProperties] = useState<PropertyHistory[]>([])
  const [marketTrends, setMarketTrends] = useState<MarketTrends[]>([])
  const [searchAddress, setSearchAddress] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<string>('1year')
  const [isLoading, setIsLoading] = useState(false)

  const title = 'Historique des Prix'
  const description = "Consultez l'évolution des prix et les tendances historiques des propriétés commerciales."

  // Vérifier si l'utilisateur a la permission d'utiliser cette fonctionnalité
  if (!can('canViewPropertyHistory')) {
    return (
      <AccessRestriction
        action='canViewPropertyHistory'
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

  const loadPriceHistory = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        region: selectedRegion,
        propertyType: selectedPropertyType,
        timeRange,
        ...(searchAddress && { address: searchAddress })
      })
      
      const response = await fetch(`/api/price-history?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties || [])
        setMarketTrends(data.trends || [])
      } else {
        throw new Error('Erreur lors du chargement des données')
      }
    } catch (error) {
      console.error('Erreur:', error)
      // Données de démonstration
      const mockProperties: PropertyHistory[] = [
        {
          id: '1',
          address: '125 Avenue des Champs-Élysées, Paris 8e',
          propertyType: 'Bureau',
          size: 450,
          currentPrice: 2850000,
          priceHistory: [
            { date: '2024-01', price: 2650000, pricePerSqm: 5888, change: 0 },
            { date: '2024-04', price: 2720000, pricePerSqm: 6044, change: 2.6 },
            { date: '2024-07', price: 2780000, pricePerSqm: 6177, change: 2.2 },
            { date: '2024-10', price: 2820000, pricePerSqm: 6266, change: 1.4 },
            { date: '2025-01', price: 2850000, pricePerSqm: 6333, change: 1.1 }
          ],
          trends: { monthly: 0.8, quarterly: 2.5, yearly: 7.5, allTime: 24.5 },
          marketComparison: { vsMarket: 3.2, vsRegion: 1.8, vsType: 2.4 },
          lastSale: { date: '2023-12-15', price: 2650000, buyer: 'SCI Investissement' }
        },
        {
          id: '2',
          address: '45 Rue de la République, Lyon 2e',
          propertyType: 'Commerce',
          size: 180,
          currentPrice: 720000,
          priceHistory: [
            { date: '2024-01', price: 680000, pricePerSqm: 3777, change: 0 },
            { date: '2024-04', price: 695000, pricePerSqm: 3861, change: 2.2 },
            { date: '2024-07', price: 708000, pricePerSqm: 3933, change: 1.9 },
            { date: '2024-10', price: 715000, pricePerSqm: 3972, change: 1.0 },
            { date: '2025-01', price: 720000, pricePerSqm: 4000, change: 0.7 }
          ],
          trends: { monthly: 0.5, quarterly: 1.5, yearly: 5.9, allTime: 18.2 },
          marketComparison: { vsMarket: 1.2, vsRegion: 2.1, vsType: -0.8 },
          lastSale: { date: '2024-01-10', price: 680000, buyer: 'SARL Commerce Plus' }
        }
      ]
      
      const mockTrends: MarketTrends[] = [
        {
          region: 'Paris',
          avgPriceChange: 4.2,
          transactionVolume: 156,
          daysOnMarket: 45,
          pricePerSqm: 8500
        },
        {
          region: 'Lyon',
          avgPriceChange: 2.8,
          transactionVolume: 89,
          daysOnMarket: 62,
          pricePerSqm: 4200
        }
      ]
      
      setProperties(mockProperties)
      setMarketTrends(mockTrends)
      toast.info('Données de démonstration chargées')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    loadPriceHistory()
  }

  const handleExport = async () => {
    try {
      const response = await fetch('/api/price-history/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: searchAddress,
          region: selectedRegion,
          propertyType: selectedPropertyType,
          timeRange
        })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `historique-prix-${new Date().toISOString().slice(0, 10)}.xlsx`
        a.click()
        toast.success('Export réalisé avec succès')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'export')
    }
  }

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <BarChart3 className="h-4 w-4 text-gray-500" />
  }

  const getTrendColor = (change: number) => {
    return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
  }

  useEffect(() => {
    loadPriceHistory()
  }, [selectedRegion, selectedPropertyType, timeRange])

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
            <Button onClick={loadPriceHistory} disabled={isLoading} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Recherche et filtres */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <Label htmlFor="search">Rechercher une adresse</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="search"
                    placeholder="Adresse, ville, code postal..."
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch} size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="region">Région</Label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="paris">Paris</SelectItem>
                    <SelectItem value="lyon">Lyon</SelectItem>
                    <SelectItem value="marseille">Marseille</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={selectedPropertyType} onValueChange={setSelectedPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="bureau">Bureau</SelectItem>
                    <SelectItem value="commerce">Commerce</SelectItem>
                    <SelectItem value="entrepot">Entrepôt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timerange">Période</Label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6months">6 mois</SelectItem>
                    <SelectItem value="1year">1 an</SelectItem>
                    <SelectItem value="2years">2 ans</SelectItem>
                    <SelectItem value="5years">5 ans</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tendances du marché */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Tendances du marché
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {marketTrends.map((trend, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">{trend.region}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Évolution prix:</span>
                      <span className={getTrendColor(trend.avgPriceChange)}>
                        {trend.avgPriceChange > 0 ? '+' : ''}{trend.avgPriceChange}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transactions:</span>
                      <span>{trend.transactionVolume}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Délai moyen:</span>
                      <span>{trend.daysOnMarket} jours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prix/m²:</span>
                      <span>{trend.pricePerSqm.toLocaleString()} €</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Historique des propriétés */}
        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="properties">Propriétés</TabsTrigger>
            <TabsTrigger value="analysis">Analyse détaillée</TabsTrigger>
          </TabsList>

          <TabsContent value="properties">
            <div className="space-y-6">
              {properties.map((property) => (
                <Card key={property.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        <CardTitle className="text-lg">{property.address}</CardTitle>
                        <CardDescription>
                          {property.propertyType} • {property.size} m²
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{formatPrice(property.currentPrice)}</div>
                        <div className="text-sm text-muted-foreground">
                          {(property.currentPrice / property.size).toLocaleString()} €/m²
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Évolution des prix */}
                      <div>
                        <h4 className="font-semibold mb-3">Évolution des prix</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-sm text-muted-foreground">Mensuel</div>
                            <div className={`font-bold ${getTrendColor(property.trends.monthly)}`}>
                              {property.trends.monthly > 0 ? '+' : ''}{property.trends.monthly}%
                            </div>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-sm text-muted-foreground">Trimestriel</div>
                            <div className={`font-bold ${getTrendColor(property.trends.quarterly)}`}>
                              {property.trends.quarterly > 0 ? '+' : ''}{property.trends.quarterly}%
                            </div>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-sm text-muted-foreground">Annuel</div>
                            <div className={`font-bold ${getTrendColor(property.trends.yearly)}`}>
                              {property.trends.yearly > 0 ? '+' : ''}{property.trends.yearly}%
                            </div>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-sm text-muted-foreground">Total</div>
                            <div className={`font-bold ${getTrendColor(property.trends.allTime)}`}>
                              {property.trends.allTime > 0 ? '+' : ''}{property.trends.allTime}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Historique des prix par période */}
                      <div>
                        <h4 className="font-semibold mb-3">Historique détaillé</h4>
                        <div className="space-y-2">
                          {property.priceHistory.slice(-5).map((point, index) => (
                            <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {new Date(point.date).toLocaleDateString('fr-FR', { 
                                    year: 'numeric', 
                                    month: 'long' 
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="font-bold">{formatPrice(point.price)}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {point.pricePerSqm.toLocaleString()} €/m²
                                  </div>
                                </div>
                                {index > 0 && (
                                  <div className="flex items-center gap-1">
                                    {getTrendIcon(point.change)}
                                    <span className={`text-sm font-medium ${getTrendColor(point.change)}`}>
                                      {point.change > 0 ? '+' : ''}{point.change}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Comparaison marché */}
                      <div>
                        <h4 className="font-semibold mb-3">Comparaison avec le marché</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex justify-between p-3 border rounded-lg">
                            <span>vs Marché global</span>
                            <span className={`font-bold ${getTrendColor(property.marketComparison.vsMarket)}`}>
                              {property.marketComparison.vsMarket > 0 ? '+' : ''}
                              {property.marketComparison.vsMarket}%
                            </span>
                          </div>
                          <div className="flex justify-between p-3 border rounded-lg">
                            <span>vs Région</span>
                            <span className={`font-bold ${getTrendColor(property.marketComparison.vsRegion)}`}>
                              {property.marketComparison.vsRegion > 0 ? '+' : ''}
                              {property.marketComparison.vsRegion}%
                            </span>
                          </div>
                          <div className="flex justify-between p-3 border rounded-lg">
                            <span>vs Type de bien</span>
                            <span className={`font-bold ${getTrendColor(property.marketComparison.vsType)}`}>
                              {property.marketComparison.vsType > 0 ? '+' : ''}
                              {property.marketComparison.vsType}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Dernière vente */}
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2">Dernière transaction</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Date: </span>
                            <span className="font-medium">
                              {new Date(property.lastSale.date).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Prix: </span>
                            <span className="font-medium">{formatPrice(property.lastSale.price)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Acheteur: </span>
                            <span className="font-medium">{property.lastSale.buyer}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle>Analyse approfondie du marché</CardTitle>
                <CardDescription>
                  Insights et recommandations basés sur l'historique des prix
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        Opportunités d'investissement
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Secteurs en forte croissance identifiés</li>
                        <li>• Prix encore accessibles dans certaines zones</li>
                        <li>• Potentiel de plus-value à 2-5 ans</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                        Tendances observées
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Hausse généralisée des prix commerciaux</li>
                        <li>• Stabilisation dans le secteur bureau</li>
                        <li>• Forte demande pour les entrepôts</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-800">Recommandations</h4>
                    <p className="text-sm text-blue-700">
                      Basé sur l'analyse des tendances récentes, nous recommandons de surveiller 
                      les opportunités dans les secteurs commerciaux de Lyon et Marseille, 
                      qui montrent des signes de croissance soutenue avec des prix encore attractifs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
