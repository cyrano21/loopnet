"use client"

import { useState, useEffect } from "react"

interface UserProperty {
  _id: string
  title: string
  propertyType: string
  transactionType: string
  price: number
  surface: number
  status: string
  views: number
  favorites: number
  inquiries: number
  images: Array<{ url: string; alt?: string }>
  createdAt: string
  updatedAt: string
}

interface UserPropertiesStats {
  total: number
  active: number
  pending: number
  sold: number
  rented: number
  expired: number
  totalViews: number
  totalFavorites: number
  totalInquiries: number
}

interface UseUserPropertiesReturn {
  properties: UserProperty[]
  stats: UserPropertiesStats | null
  loading: boolean
  error: string | null
  pagination: any
  refetch: () => void
}

export function useUserProperties(userId?: string, status?: string, page = 1) {
  const [properties, setProperties] = useState<UserProperty[]>([])
  const [stats, setStats] = useState<UserPropertiesStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState(null)

  const fetchUserProperties = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (userId) params.append("userId", userId)
      if (status) params.append("status", status)
      params.append("page", page.toString())

      const response = await fetch(`/api/user/properties?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch user properties")
      }

      setProperties(result.data.properties)
      setStats(result.data.stats)
      setPagination(result.data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching user properties:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserProperties()
  }, [userId, status, page])

  return {
    properties,
    stats,
    loading,
    error,
    pagination,
    refetch: fetchUserProperties,
  }
}
