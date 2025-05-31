'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  MapPin, 
  DollarSign, 
  SquareM,
  Eye,
  Clock,
  Users,
  BarChart3,
  Calendar,
  Target
} from 'lucide-react'

interface MarketStats {
  averagePrice: number
  priceChange: number
  totalProperties: number
  newListings: number
  averageSize: number
  popularAreas: string[]
  competitionLevel: 'low' | 'medium' | 'high'
  marketTrend: 'up' | 'down' | 'stable'
}

interface SearchAnalyticsProps {
  filters: any
  resultCount: number
  className?: string
}

export function SearchAnalytics({ filters, resultCount, className }: SearchAnalyticsProps) {
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Simuler le chargement des données de marché
  useEffect(() => {
    if (filters.city || filters.propertyType) {
      setLoading(true)
      // Simuler un appel API
      setTimeout(() => {
        setMarketStats({
          averagePrice: Math.floor(Math.random() * 500000) + 100000,
          priceChange: (Math.random() - 0.5) * 20,
          totalProperties: Math.floor(Math.random() * 1000) + 100,
          newListings: Math.floor(Math.random() * 50) + 5,
          averageSize: Math.floor(Math.random() * 500) + 50,
          popularAreas: ['Centre-ville', 'Zone commerciale', 'Quartier d\'affaires'],
          competitionLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
          marketTrend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as any
        })
        setLoading(false)
      }, 800)
    }
  }, [filters.city, filters.propertyType])

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCompetitionLabel = (level: string) => {
    switch (level) {
      case 'low': return 'Faible concurrence'
      case 'medium': return 'Concurrence modérée'
      case 'high': return 'Forte concurrence'
      default: return 'Non déterminée'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendLabel = (trend: string) => {
    switch (trend) {
      case 'up': return 'En hausse'
      case 'down': return 'En baisse'
      default: return 'Stable'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className={className}>
      {/* Statistiques rapides */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Analyse de recherche
          </CardTitle>
          <CardDescription>
            Statistiques en temps réel pour vos critères de recherche
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Résultats trouvés */}
          <div className="flex items-center justify-between p-3 bg-blue-50/80 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-900">{resultCount} propriétés trouvées</p>
                <p className="text-sm text-blue-700">Correspondant à vos critères</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {resultCount > 50 ? 'Excellent choix' : resultCount > 20 ? 'Bon choix' : 'Recherche ciblée'}
            </Badge>
          </div>

          {/* Données de marché */}
          {loading ? (
            <div className="space-y-3">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ) : marketStats ? (
            <div className="space-y-3">
              {/* Prix moyen */}
              <div className="flex items-center justify-between p-3 bg-green-50/80 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">
                      {formatPrice(marketStats.averagePrice)}
                    </p>
                    <p className="text-sm text-green-700">Prix moyen du marché</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(marketStats.marketTrend)}
                  <span className={`text-sm font-medium ${
                    marketStats.priceChange > 0 ? 'text-green-600' : 
                    marketStats.priceChange < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {marketStats.priceChange > 0 ? '+' : ''}
                    {marketStats.priceChange.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Concurrence */}
              <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Niveau de concurrence</p>
                    <p className="text-sm text-gray-700">{marketStats.totalProperties} propriétés similaires</p>
                  </div>
                </div>
                <Badge className={getCompetitionColor(marketStats.competitionLevel)}>
                  {getCompetitionLabel(marketStats.competitionLevel)}
                </Badge>
              </div>

              {/* Nouvelles annonces */}
              <div className="flex items-center justify-between p-3 bg-orange-50/80 rounded-lg border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-orange-900">
                      {marketStats.newListings} nouvelles annonces
                    </p>
                    <p className="text-sm text-orange-700">Cette semaine</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-orange-200 text-orange-800">
                  +{Math.round((marketStats.newListings / marketStats.totalProperties) * 100)}%
                </Badge>
              </div>

              {/* Surface moyenne */}
              <div className="flex items-center justify-between p-3 bg-purple-50/80 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <SquareM className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-purple-900">
                      {marketStats.averageSize} m²
                    </p>
                    <p className="text-sm text-purple-700">Surface moyenne</p>
                  </div>
                </div>
              </div>

              {/* Bouton pour plus de détails */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="w-full mt-4"
              >
                {showDetails ? 'Masquer les détails' : 'Voir plus de détails'}
              </Button>

              {/* Détails étendus */}
              {showDetails && (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Zones populaires
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {marketStats.popularAreas.map((area, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        {area}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Tendance du marché</h4>
                    <div className="flex items-center gap-2 mb-2">
                      {getTrendIcon(marketStats.marketTrend)}
                      <span className="text-sm font-medium">
                        {getTrendLabel(marketStats.marketTrend)}
                      </span>
                    </div>
                    <Progress 
                      value={Math.abs(marketStats.priceChange) * 5} 
                      className="h-2"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Évolution sur les 30 derniers jours
                    </p>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50/80 rounded-lg border border-blue-200">
                    <h5 className="font-medium text-blue-900 mb-1">💡 Recommandation</h5>
                    <p className="text-sm text-blue-700">
                      {marketStats.competitionLevel === 'low' 
                        ? 'Excellent moment pour investir - peu de concurrence sur ce marché.'
                        : marketStats.competitionLevel === 'medium'
                        ? 'Marché équilibré - bonnes opportunités disponibles.'
                        : 'Marché très compétitif - agissez rapidement sur les bonnes affaires.'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Conseils d'optimisation */}
          {resultCount === 0 && (
            <div className="p-3 bg-yellow-50/80 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Suggestions d'optimisation
              </h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Élargissez la zone géographique</li>
                <li>• Augmentez la fourchette de prix</li>
                <li>• Considérez d'autres types de propriétés</li>
                <li>• Réduisez les critères optionnels</li>
              </ul>
            </div>
          )}

          {resultCount > 100 && (
            <div className="p-3 bg-blue-50/80 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Affiner votre recherche
              </h4>
              <p className="text-sm text-blue-700">
                Vous avez beaucoup de résultats. Affinez vos critères pour des résultats plus ciblés.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
