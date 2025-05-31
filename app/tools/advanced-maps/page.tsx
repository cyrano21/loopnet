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
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Map, MapPin, Layers, Filter, Search, Settings, Maximize, Download, BarChart3, Users, Building, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'

interface PropertyMarker {
  id: string
  lat: number
  lng: number
  address: string
  propertyType: string
  price: number
  size: number
  status: 'available' | 'sold' | 'under-offer'
}

interface MarketLayer {
  id: string
  name: string
  type: 'price' | 'density' | 'demographics' | 'transport' | 'amenities'
  enabled: boolean
  opacity: number
  color: string
}

interface AnalysisResult {
  zone: string
  avgPrice: number
  propertyCount: number
  priceChange: number
  demographics: {
    population: number
    income: number
    age: number
  }
  amenities: {
    schools: number
    transport: number
    shops: number
  }
}

export default function AdvancedMapsPage() {
  const { can } = usePermissions()
  const [properties, setProperties] = useState<PropertyMarker[]>([])
  const [mapLayers, setMapLayers] = useState<MarketLayer[]>([])
  const [selectedLayer, setSelectedLayer] = useState<string>('')
  const [searchRadius, setSearchRadius] = useState<number[]>([1000])
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(['all'])
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000000])
  const [centerLocation, setCenterLocation] = useState({ lat: 48.8566, lng: 2.3522 }) // Paris par défaut
  const [searchAddress, setSearchAddress] = useState('')
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const title = 'Cartes de Marché Avancées'
  const description = 'Visualisations cartographiques avancées avec données de marché en temps réel pour analyser le marché immobilier.'

  // Vérifier si l'utilisateur a la permission d'utiliser cette fonctionnalité
  if (!can('canViewMarketAnalytics')) {
    return (
      <AccessRestriction
        action='canViewMarketAnalytics'
        requiredLevel='agent'
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

  const loadMapData = async () => {
    try {
      const params = new URLSearchParams({
        lat: centerLocation.lat.toString(),
        lng: centerLocation.lng.toString(),
        radius: searchRadius[0].toString(),
        propertyTypes: selectedPropertyTypes.join(','),
        minPrice: priceRange[0].toString(),
        maxPrice: priceRange[1].toString()
      })

      const response = await fetch(`/api/maps/properties?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties || [])
      } else {
        throw new Error('Erreur lors du chargement des données')
      }
    } catch (error) {
      console.error('Erreur:', error)
      // Données de démonstration
      const mockProperties: PropertyMarker[] = [
        {
          id: '1',
          lat: 48.8566,
          lng: 2.3522,
          address: '125 Champs-Élysées, Paris 8e',
          propertyType: 'Bureau',
          price: 2850000,
          size: 450,
          status: 'available'
        },
        {
          id: '2',
          lat: 48.8606,
          lng: 2.3376,
          address: '45 Rue de Rivoli, Paris 1er',
          propertyType: 'Commerce',
          price: 1850000,
          size: 180,
          status: 'under-offer'
        },
        {
          id: '3',
          lat: 48.8534,
          lng: 2.3488,
          address: '78 Boulevard Saint-Germain, Paris 6e',
          propertyType: 'Bureau',
          price: 3200000,
          size: 380,
          status: 'available'
        }
      ]
      setProperties(mockProperties)
    }
  }

  const loadMapLayers = async () => {
    try {
      const response = await fetch('/api/maps/layers')
      if (response.ok) {
        const data = await response.json()
        setMapLayers(data.layers || [])
      } else {
        throw new Error('Erreur lors du chargement des calques')
      }
    } catch (error) {
      console.error('Erreur:', error)
      // Données de démonstration
      const mockLayers: MarketLayer[] = [
        {
          id: 'price-heatmap',
          name: 'Carte de chaleur des prix',
          type: 'price',
          enabled: true,
          opacity: 0.7,
          color: '#FF6B35'
        },
        {
          id: 'property-density',
          name: 'Densité des propriétés',
          type: 'density',
          enabled: false,
          opacity: 0.6,
          color: '#4ECDC4'
        },
        {
          id: 'demographics',
          name: 'Données démographiques',
          type: 'demographics',
          enabled: false,
          opacity: 0.5,
          color: '#45B7D1'
        },
        {
          id: 'transport',
          name: 'Réseaux de transport',
          type: 'transport',
          enabled: false,
          opacity: 0.8,
          color: '#96CEB4'
        },
        {
          id: 'amenities',
          name: 'Commodités et services',
          type: 'amenities',
          enabled: false,
          opacity: 0.6,
          color: '#FFEAA7'
        }
      ]
      setMapLayers(mockLayers)
    }
  }

  const handleSearch = async () => {
    if (!searchAddress) return

    try {
      const response = await fetch(`/api/maps/geocode?address=${encodeURIComponent(searchAddress)}`)
      if (response.ok) {
        const data = await response.json()
        setCenterLocation({ lat: data.lat, lng: data.lng })
        toast.success('Localisation trouvée')
      } else {
        throw new Error('Adresse non trouvée')
      }
    } catch (error) {
      toast.error('Impossible de localiser cette adresse')
    }
  }

  const handleZoneAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/maps/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          center: centerLocation,
          radius: searchRadius[0],
          propertyTypes: selectedPropertyTypes
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAnalysisResults(data.results || [])
      } else {
        throw new Error('Erreur lors de l\'analyse')
      }
    } catch (error) {
      console.error('Erreur:', error)
      // Données de démonstration
      const mockResults: AnalysisResult[] = [
        {
          zone: 'Paris 8e',
          avgPrice: 8500,
          propertyCount: 24,
          priceChange: 3.2,
          demographics: { population: 38000, income: 65000, age: 42 },
          amenities: { schools: 8, transport: 12, shops: 45 }
        },
        {
          zone: 'Paris 1er',
          avgPrice: 12000,
          propertyCount: 18,
          priceChange: 5.1,
          demographics: { population: 16500, income: 75000, age: 38 },
          amenities: { schools: 5, transport: 15, shops: 67 }
        }
      ]
      setAnalysisResults(mockResults)
      toast.success('Analyse terminée')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleLayerToggle = (layerId: string, enabled: boolean) => {
    setMapLayers(prev =>
      prev.map(layer =>
        layer.id === layerId ? { ...layer, enabled } : layer
      )
    )
  }

  const handleLayerOpacity = (layerId: string, opacity: number) => {
    setMapLayers(prev =>
      prev.map(layer =>
        layer.id === layerId ? { ...layer, opacity: opacity / 100 } : layer
      )
    )
  }

  const exportMapData = async () => {
    try {
      const response = await fetch('/api/maps/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          center: centerLocation,
          radius: searchRadius[0],
          layers: mapLayers.filter(l => l.enabled).map(l => l.id),
          properties: properties.length
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `carte-marche-${new Date().toISOString().slice(0, 10)}.pdf`
        a.click()
        toast.success('Carte exportée avec succès')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'export')
    }
  }

  const getPropertyStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600'
      case 'under-offer': return 'text-orange-600'
      case 'sold': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getPropertyStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible'
      case 'under-offer': return 'Sous offre'
      case 'sold': return 'Vendu'
      default: return 'Inconnu'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
  }

  useEffect(() => {
    loadMapData()
    loadMapLayers()
  }, [])

  useEffect(() => {
    loadMapData()
  }, [centerLocation, searchRadius, selectedPropertyTypes, priceRange])

  return (
    <div className="container mx-auto py-8 max-w-full">
      <div className="flex flex-col gap-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground mt-2">{description}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportMapData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Dialog open={showFilters} onOpenChange={setShowFilters}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Filtres de carte</DialogTitle>
                  <DialogDescription>
                    Personnalisez l'affichage de la carte
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Types de propriétés</Label>
                    <Select value={selectedPropertyTypes[0]} onValueChange={(value) => setSelectedPropertyTypes([value])}>
                      <SelectTrigger>
                        <SelectValue />
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
                  <div>
                    <Label>Rayon de recherche: {searchRadius[0]}m</Label>
                    <Slider
                      value={searchRadius}
                      onValueChange={setSearchRadius}
                      max={5000}
                      min={100}
                      step={100}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Fourchette de prix</Label>
                    <div className="mt-2 space-y-2">
                      <Input
                        type="number"
                        placeholder="Prix minimum"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      />
                      <Input
                        type="number"
                        placeholder="Prix maximum"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 5000000])}
                      />
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panneau de contrôle */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recherche */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Recherche
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Adresse, ville..."
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch} size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Calques de carte */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Calques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mapLayers.map((layer) => (
                  <div key={layer.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={layer.enabled}
                          onCheckedChange={(enabled) => handleLayerToggle(layer.id, enabled)}
                        />
                        <label className="text-sm font-medium">{layer.name}</label>
                      </div>
                      <div 
                        className="w-4 h-4 rounded border" 
                        style={{ backgroundColor: layer.color }}
                      />
                    </div>
                    {layer.enabled && (
                      <div className="ml-6">
                        <Label className="text-xs">Opacité: {Math.round(layer.opacity * 100)}%</Label>
                        <Slider
                          value={[layer.opacity * 100]}
                          onValueChange={([value]) => handleLayerOpacity(layer.id, value)}
                          max={100}
                          min={10}
                          step={10}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Analyse de zone */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analyse de zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleZoneAnalysis}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? 'Analyse en cours...' : 'Analyser la zone'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Carte principale */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    Carte interactive
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">{properties.length} propriétés</Badge>
                    <Button size="sm" variant="outline">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative h-full bg-muted rounded-b-lg flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Map className="h-16 w-16 mx-auto text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-semibold">Carte interactive</h3>
                      <p className="text-muted-foreground">
                        La carte s'afficherait ici avec les propriétés et calques sélectionnés
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Centre: {centerLocation.lat.toFixed(4)}, {centerLocation.lng.toFixed(4)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Propriétés et analyses */}
        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="properties">Propriétés ({properties.length})</TabsTrigger>
            <TabsTrigger value="analysis">Analyses ({analysisResults.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="properties">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map((property) => (
                <Card key={property.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline">{property.propertyType}</Badge>
                        </div>
                        <Badge variant="outline" className={getPropertyStatusColor(property.status)}>
                          {getPropertyStatusLabel(property.status)}
                        </Badge>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-sm">{property.address}</h3>
                        <div className="text-xs text-muted-foreground mt-1">
                          {property.lat.toFixed(4)}, {property.lng.toFixed(4)}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-lg font-bold">{formatPrice(property.price)}</div>
                          <div className="text-xs text-muted-foreground">
                            {(property.price / property.size).toLocaleString()} €/m²
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{property.size} m²</div>
                          <div className="text-xs text-muted-foreground">Surface</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {properties.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune propriété trouvée</h3>
                  <p className="text-muted-foreground">
                    Ajustez vos filtres pour voir plus de résultats
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="space-y-4">
              {analysisResults.map((result, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{result.zone}</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-normal text-green-600">
                          +{result.priceChange}%
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Marché immobilier
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Prix moyen/m²:</span>
                            <span className="font-medium">{result.avgPrice.toLocaleString()} €</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Nombre de biens:</span>
                            <span className="font-medium">{result.propertyCount}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Démographie
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Population:</span>
                            <span className="font-medium">{result.demographics.population.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Revenu médian:</span>
                            <span className="font-medium">{result.demographics.income.toLocaleString()} €</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Âge moyen:</span>
                            <span className="font-medium">{result.demographics.age} ans</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Commodités
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Écoles:</span>
                            <span className="font-medium">{result.amenities.schools}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Transports:</span>
                            <span className="font-medium">{result.amenities.transport}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Commerces:</span>
                            <span className="font-medium">{result.amenities.shops}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {analysisResults.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune analyse disponible</h3>
                    <p className="text-muted-foreground">
                      Lancez une analyse de zone pour voir les résultats ici
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
