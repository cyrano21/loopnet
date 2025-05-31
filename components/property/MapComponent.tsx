'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  Locate, 
  Layers,
  Filter,
  Navigation,
  Building2,
  DollarSign,
  SquareM
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface MapComponentProps {
  properties: any[]
  onPropertySelect: (property: any) => void
  selectedProperty: any
  className?: string
}

const MapComponent = ({ properties, onPropertySelect, selectedProperty, className }: MapComponentProps) => {
  const [zoom, setZoom] = useState(12)
  const [center, setCenter] = useState({ lat: 48.8566, lng: 2.3522 }) // Paris par défaut
  const [mapStyle, setMapStyle] = useState('standard')
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [showClusters, setShowClusters] = useState(true)
  const mapRef = useRef<HTMLDivElement>(null)

  // Simuler des positions géographiques pour les propriétés
  const getPropertyCoordinates = (property: any, index: number) => {
    // En réalité, ces coordonnées viendraient de la base de données
    const baseLatParis = 48.8566
    const baseLngParis = 2.3522
    
    // Dispersion aléatoire mais cohérente basée sur l'ID de la propriété
    const hash = property._id.split('').reduce((a: number, b: string) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    return {
      lat: baseLatParis + (hash % 100 - 50) * 0.001,
      lng: baseLngParis + ((hash * 7) % 100 - 50) * 0.001
    }
  }

  // Calculer les clusters de propriétés
  const getPropertyClusters = () => {
    if (!showClusters || properties.length <= 5) {
      return properties.map((property, index) => ({
        ...property,
        coordinates: getPropertyCoordinates(property, index),
        cluster: null
      }))
    }

    // Logique de clustering simple (en réalité, on utiliserait une bibliothèque comme supercluster)
    const clusters: any[] = []
    const clusteredProperties: any[] = []

    properties.forEach((property, index) => {
      const coords = getPropertyCoordinates(property, index)
      const existingCluster = clusters.find(cluster => 
        Math.abs(cluster.lat - coords.lat) < 0.005 && 
        Math.abs(cluster.lng - coords.lng) < 0.005
      )

      if (existingCluster) {
        existingCluster.properties.push(property)
        existingCluster.count += 1
      } else {
        clusters.push({
          lat: coords.lat,
          lng: coords.lng,
          properties: [property],
          count: 1
        })
      }
    })

    return clusters
  }

  const clusters = getPropertyClusters()

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 1, 18))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 1, 1))

  const handleMarkerClick = (property: any) => {
    onPropertySelect(property)
    // Centrer la carte sur la propriété sélectionnée
    const coords = getPropertyCoordinates(property, 0)
    setCenter(coords)
  }

  return (
    <div className={`relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden border ${className}`}>
      {/* Contrôles de la carte */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
        <Card className="p-2">
          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="w-8 h-8 p-0"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="w-8 h-8 p-0"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <Card className="p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0"
            title="Ma position"
          >
            <Locate className="h-4 w-4" />
          </Button>
        </Card>
      </div>

      {/* Contrôles des calques */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="p-3">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Layers className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-medium">Calques</span>
            </div>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
                className="w-3 h-3 rounded border-gray-300"
              />
              <span className="text-xs">Heatmap prix</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showClusters}
                onChange={(e) => setShowClusters(e.target.checked)}
                className="w-3 h-3 rounded border-gray-300"
              />
              <span className="text-xs">Grouper</span>
            </label>
          </div>
        </Card>
      </div>

      {/* Informations de la carte */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="p-2">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Navigation className="h-3 w-3" />
            <span>Zoom: {zoom}</span>
            <span>•</span>
            <span>{properties.length} propriétés</span>
          </div>
        </Card>
      </div>

      {/* Légende */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="p-3">
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700">Légende</h4>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Disponible</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Nouveau</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-gray-600">En négociation</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Heatmap overlay */}
      {showHeatmap && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-radial from-red-500/20 via-yellow-500/10 to-transparent"></div>
        </div>
      )}

      {/* Fond de carte simulé */}
      <div 
        ref={mapRef}
        className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(245, 101, 101, 0.1) 0%, transparent 50%)
          `
        }}
      >
        {/* Grille de coordonnées simulée */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full border-t border-gray-400"
              style={{ top: `${i * 10}%` }}
            />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full border-l border-gray-400"
              style={{ left: `${i * 10}%` }}
            />
          ))}
        </div>

        {/* Routes simulées */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <path
            d="M 0,150 Q 200,100 400,150 T 800,150"
            stroke="#6B7280"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 100,0 Q 150,200 200,400 T 300,600"
            stroke="#6B7280"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* Marqueurs des propriétés */}
      <div className="absolute inset-0">
        {showClusters && clusters.length > 0 ? (
          // Affichage avec clusters
          clusters.map((cluster, clusterIndex) => (
            <div key={`cluster-${clusterIndex}`}>
              {cluster.count > 1 ? (
                // Cluster marker
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                  style={{
                    left: `${20 + (clusterIndex % 8) * 10}%`,
                    top: `${20 + Math.floor(clusterIndex / 8) * 15}%`
                  }}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-white">
                      {cluster.count}
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <Building2 className="w-2 h-2 text-white" />
                    </div>
                  </div>
                </div>
              ) : (
                // Single property marker
                cluster.properties.map((property: any, propIndex: number) => (
                  <PropertyMarker
                    key={property._id}
                    property={property}
                    isSelected={selectedProperty?._id === property._id}
                    onClick={() => handleMarkerClick(property)}
                    style={{
                      left: `${20 + (clusterIndex % 8) * 10}%`,
                      top: `${20 + Math.floor(clusterIndex / 8) * 15}%`
                    }}
                  />
                ))
              )}
            </div>
          ))
        ) : (
          // Affichage sans clusters
          properties.slice(0, 20).map((property, index) => (
            <PropertyMarker
              key={property._id}
              property={property}
              isSelected={selectedProperty?._id === property._id}
              onClick={() => handleMarkerClick(property)}
              style={{
                left: `${15 + (index % 6) * 14}%`,
                top: `${15 + Math.floor(index / 6) * 16}%`
              }}
            />
          ))
        )}
      </div>

      {/* Message si pas de propriétés */}
      {properties.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="p-8 text-center">
            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Aucune propriété à afficher
            </h3>
            <p className="text-gray-500">
              Modifiez vos filtres pour voir plus de résultats
            </p>
          </Card>
        </div>
      )}
    </div>
  )
}

// Composant pour les marqueurs individuels
const PropertyMarker = ({ 
  property, 
  isSelected, 
  onClick, 
  style 
}: { 
  property: any
  isSelected: boolean
  onClick: () => void
  style: React.CSSProperties
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  
  // Déterminer la couleur selon le statut
  const getMarkerColor = () => {
    if (property.featured) return 'bg-green-500'
    if (property.transactionType === 'sale') return 'bg-blue-500'
    return 'bg-purple-500'
  }

  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
        isSelected ? 'z-30 scale-110' : 'z-20 hover:scale-105'
      }`}
      style={style}
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Marqueur principal */}
      <div className={`relative ${getMarkerColor()} rounded-full p-2 shadow-lg border-2 border-white ${
        isSelected ? 'ring-2 ring-blue-400' : ''
      }`}>
        <Building2 className="w-4 h-4 text-white" />
        
        {/* Badge de prix */}
        <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium shadow-md ${
          isSelected 
            ? 'bg-blue-600 text-white' 
            : 'bg-white text-gray-900 border'
        }`}>
          {formatPrice(property.price, property.transactionType)}
        </div>

        {/* Badge featured */}
        {property.featured && (
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full border border-white"></div>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && !isSelected && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 z-40">
          <Card className="p-3 shadow-lg">
            <h4 className="font-medium text-sm mb-1 truncate">{property.title}</h4>
            <p className="text-xs text-gray-600 mb-2 truncate">
              {property.address}, {property.city}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-blue-600">
                {formatPrice(property.price)}
              </span>
              <Badge variant="outline" className="text-xs">
                {property.surface} m²
              </Badge>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {property.propertyType}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {property.transactionType === 'sale' ? 'Vente' : 'Location'}
              </Badge>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default MapComponent
