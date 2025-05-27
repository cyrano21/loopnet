"use client"

import { useState, useEffect } from "react"

interface DashboardAnalytics {
  totalProperties: number
  activeProperties: number
  pendingProperties: number
  totalViews: number
  totalFavorites: number
  totalInquiries: number
  recentInquiries: number
  monthlyRevenue: number
  occupancyRate: number
  monthlyGrowth: number
  topProperties: Array<{
    _id: string
    title: string
    views: number
    inquiries: number
    favorites: number
    price: number
    images: Array<{ url: string }>
  }>
  recentActivities: Array<{
    id: string
    type: string
    message: string
    user?: string
    time: string
    priority: string
  }>
}

interface UseDashboardAnalyticsReturn {
  analytics: DashboardAnalytics | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useDashboardAnalytics(period = "30d"): UseDashboardAnalyticsReturn {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/dashboard/analytics?period=${period}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch analytics")
      }

      setAnalytics(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching dashboard analytics:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  }
}
