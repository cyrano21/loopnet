'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePermissions } from './use-permissions'

interface SavedSearch {
  id: string
  name: string
  filters: Record<string, any>
  alertEnabled: boolean
  createdAt: string
  lastRun?: string
  resultsCount?: number
}

export function useSavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { can, limit } = usePermissions()

  const maxSavedSearches = limit('maxSavedSearches')

  const fetchSavedSearches = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/saved-searches')
      if (!response.ok) throw new Error('Failed to fetch saved searches')
      const data = await response.json()
      setSavedSearches(data.searches || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (can('canSaveSearches')) {
      fetchSavedSearches()
    } else {
      setLoading(false)
    }
  }, [can, fetchSavedSearches])

  const saveSearch = async (name: string, filters: Record<string, any>, alertEnabled = false) => {
    if (!can('canSaveSearches')) {
      throw new Error('Permission denied')
    }

    if (maxSavedSearches && savedSearches.length >= maxSavedSearches) {
      throw new Error(`Limite de ${maxSavedSearches} recherches sauvegardées atteinte`)
    }

    try {
      const response = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, filters, alertEnabled })
      })
      
      if (!response.ok) throw new Error('Failed to save search')
      
      await fetchSavedSearches()
      return true
    } catch (err) {
      throw err
    }
  }

  const deleteSearch = async (searchId: string) => {
    try {
      const response = await fetch(`/api/saved-searches/${searchId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete search')
      
      setSavedSearches(prev => prev.filter(s => s.id !== searchId))
      return true
    } catch (err) {
      throw err
    }
  }
  const toggleAlert = async (searchId: string, alertEnabled: boolean) => {
    try {
      const response = await fetch(`/api/saved-searches/${searchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertEnabled })
      })
      
      if (!response.ok) throw new Error('Failed to update alert')
      
      setSavedSearches(prev => 
        prev.map(s => s.id === searchId ? { ...s, alertEnabled } : s)
      )
      return true
    } catch (err) {
      throw err
    }
  }

  const updateSearch = async (searchId: string, updates: Partial<Omit<SavedSearch, 'id' | 'createdAt'>>) => {
    try {
      const response = await fetch(`/api/saved-searches/${searchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) throw new Error('Failed to update search')
      
      setSavedSearches(prev => 
        prev.map(s => s.id === searchId ? { ...s, ...updates } : s)
      )
      return true
    } catch (err) {
      throw err
    }
  }

  const runSearch = async (searchId: string) => {
    const search = savedSearches.find(s => s.id === searchId)
    if (!search) return null
    
    // Retourner les filtres pour appliquer à la recherche
    return search.filters
  }
  return {
    savedSearches,
    loading,
    error,
    saveSearch,
    deleteSearch,
    toggleAlert,
    updateSearch,
    runSearch,
    canSave: can('canSaveSearches'),
    maxSavedSearches,
    remainingSlots: maxSavedSearches ? Math.max(0, maxSavedSearches - savedSearches.length) : null
  }
}
