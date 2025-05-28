"use client"

import { useState, useEffect, useCallback } from "react"
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

  // Mémoriser la fonction de récupération
  const fetchPriceHistory = useCallback(async () => {
    // Si l'utilisateur n'a pas la permission, ne pas essayer de récupérer les données
    if (!can('canViewPropertyHistory')) {
      setLoading(false)
      return
    }

    if (!propertyId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/properties/${propertyId}/price-history`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch price history')
      }
      
      const data = await response.json()
      setPriceHistory(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching price history:', err)
    } finally {
      setLoading(false)
    }
  }, [propertyId, can])

  // Récupérer l'historique des prix d'une propriété
  useEffect(() => {
    fetchPriceHistory()
  }, [fetchPriceHistory])

  return {
    priceHistory,
    loading,
    error,
    canViewHistory: can('canViewPropertyHistory')
  }
}
