"use client"

import { useState, useEffect } from "react"
import { usePermissions } from "./use-permissions"

interface PriceHistoryEntry {
  date: string
  price: number
  change?: number
  changePercentage?: number
  event?: string
}

interface PriceHistoryData {
  propertyId: string
  history: PriceHistoryEntry[]
  averagePriceChange: number
  totalChangePercentage: number
}

export function usePriceHistory(propertyId: string) {
  const { can } = usePermissions()
  const [priceHistory, setPriceHistory] = useState<PriceHistoryData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Récupérer l'historique des prix d'une propriété
  useEffect(() => {
    const fetchPriceHistory = async () => {
      // Si l'utilisateur n'a pas la permission, ne pas essayer de récupérer les données
      if (!can('canViewPropertyHistory')) {
        return
      }
      
      try {
        setLoading(true)
        // Simulation d'un appel API
        const response = await fetch(`/api/properties/${propertyId}/price-history`)
        
        if (!response.ok) {
          throw new Error('Impossible de récupérer l\'historique des prix')
        }
        
        const data = await response.json()
        setPriceHistory(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
        console.error('Erreur lors de la récupération de l\'historique des prix:', err)
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      fetchPriceHistory()
    }
  }, [propertyId, can])

  return {
    priceHistory,
    loading,
    error,
    canViewHistory: can('canViewPropertyHistory')
  }
}
