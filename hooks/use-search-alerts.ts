'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface SearchAlert {
  id: string
  name: string
  filters: Record<string, any>
  frequency: 'immediate' | 'daily' | 'weekly'
  enabled: boolean
  createdAt: string
  lastTriggered?: string
  newResultsCount?: number
}

export function useSearchAlerts() {
  const [alerts, setAlerts] = useState<SearchAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/search-alerts')
      if (!response.ok) throw new Error('Failed to fetch alerts')
      const data = await response.json()
      setAlerts(data.alerts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createAlert = async (alertData: Omit<SearchAlert, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/search-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData)
      })
      if (!response.ok) throw new Error('Failed to create alert')
      const data = await response.json()
      setAlerts(prev => [...prev, data.alert])
      toast.success('Alerte créée avec succès')
      return data.alert
    } catch (error) {
      toast.error('Erreur lors de la création de l\'alerte')
      throw error
    }
  }

  const updateAlert = async (id: string, updates: Partial<SearchAlert>) => {
    try {
      const response = await fetch(`/api/search-alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (!response.ok) throw new Error('Failed to update alert')
      const data = await response.json()
      setAlerts(prev => prev.map(alert => 
        alert.id === id ? { ...alert, ...updates } : alert
      ))
      toast.success('Alerte mise à jour')
      return data.alert
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
      throw error
    }
  }

  const deleteAlert = async (id: string) => {
    try {
      const response = await fetch(`/api/search-alerts/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete alert')
      setAlerts(prev => prev.filter(alert => alert.id !== id))
      toast.success('Alerte supprimée')
    } catch (error) {
      toast.error('Erreur lors de la suppression')
      throw error
    }
  }

  const toggleAlert = async (id: string) => {
    const alert = alerts.find(a => a.id === id)
    if (alert) {
      await updateAlert(id, { enabled: !alert.enabled })
    }
  }

  return {
    alerts,
    loading,
    error,
    createAlert,
    updateAlert,
    deleteAlert,
    toggleAlert,
    refetch: fetchAlerts
  }
}
