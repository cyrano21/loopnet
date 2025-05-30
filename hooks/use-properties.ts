"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Property } from "@/types/property"

interface UsePropertiesOptions {
  page?: number
  limit?: number
  transactionType?: string
  propertyType?: string
  source?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  minSurface?: number
  maxSurface?: number
  rooms?: number
  sort?: string
  q?: string
  agent?: string
}

interface UsePropertiesReturn {
  properties: Property[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  } | null
  refetch: () => void
}

export function useProperties(options: UsePropertiesOptions = {}): UsePropertiesReturn {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState(null)

  const fetchProperties = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()

      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/properties?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch properties")
      }

      setProperties(result.data.properties)
      setPagination(result.data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching properties:", err)
    } finally {
      setLoading(false)
    }
  }

  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if the change is from a text input (city or search query)
    const isTextInput = (options.city !== undefined && options.city !== '') || 
                       (options.q !== undefined && options.q !== '')
    
    if (isTextInput) {
      // Clear existing timeout
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      
      // Set new timeout for debounced fetch
      debounceRef.current = setTimeout(() => {
        fetchProperties()
      }, 500)
    } else {
      // For non-text inputs (dropdowns, numbers), fetch immediately
      // Clear any pending debounced calls
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
        debounceRef.current = null
      }
      fetchProperties()
    }

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [JSON.stringify(options)])

  return {
    properties,
    loading,
    error,
    pagination,
    refetch: fetchProperties,
  }
}

export function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchProperty = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/properties/${id}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch property")
        }

        setProperty(result.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching property:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id])

  return { property, loading, error }
}
