'use client'

import { useState, useEffect } from 'react'
import { usePermissions } from './use-permissions'

interface MarketTrends {
  currentPricePerSqFt: number
  marketAvgPricePerSqFt: number
  pricePerSqFtTrend: number
  vacancyRate: number
  vacancyTrend: number
  avgDaysOnMarket: number
  daysOnMarketTrend: number
}

interface ComparableProperty {
  id: string
  address: string
  price: number
  size: number
  daysOnMarket: number
  propertyType: string
  yearBuilt?: number
}

interface MarketForecast {
  oneYear: number
  threeYears: number
  fiveYears: number
  factors: string[]
}

interface MarketAnalysisData {
  trends: MarketTrends
  comparable: ComparableProperty[]
  forecast: MarketForecast
}

export function useMarketAnalysis(propertyId: string, propertyType: string, location: { city: string; state: string; zip?: string }) {
  const [marketData, setMarketData] = useState<MarketAnalysisData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { can } = usePermissions()

  useEffect(() => {
    const fetchMarketAnalysis = async () => {
      // Vérifier si l'utilisateur a les permissions nécessaires
      if (!can('canViewMarketAnalytics')) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Construire les paramètres de requête
        const params = new URLSearchParams({
          propertyType,
          city: location.city,
          state: location.state
        })
        if (location.zip) {
          params.append('zip', location.zip)
        }

        // Appeler l'API d'analyse de marché
        const response = await fetch(`/api/market-analysis/${propertyId}?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données d\'analyse de marché')
        }

        const data = await response.json()
        setMarketData(data)
      } catch (err) {
        console.error('Erreur d\'analyse de marché:', err)
        setError(err instanceof Error ? err.message : 'Une erreur s\'est produite')
      } finally {
        setLoading(false)
      }
    }

    fetchMarketAnalysis()
  }, [propertyId, propertyType, location, can])

  return {
    marketData,
    loading,
    error,
    hasAccess: can('canViewMarketAnalytics')
  }
}
