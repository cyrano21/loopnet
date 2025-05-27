"use client"

import { useState, useEffect } from "react"

interface Professional {
  _id: string
  name: string
  title: string
  company: string
  email: string
  phone: string
  location: {
    address?: string
    city: string
    state: string
    zipCode?: string
  }
  specialties: string[]
  certifications: string[]
  rating: number
  reviews: number
  yearsExperience: number
  totalTransactions: number
  totalVolume: number
  image?: string
  bio?: string
  languages?: string[]
  isVerified: boolean
  socialLinks?: {
    linkedin?: string
    website?: string
  }
}

interface UseProfessionalsParams {
  specialty?: string
  location?: string
  sortBy?: string
  search?: string
  page?: number
}

export function useProfessionals(params: UseProfessionalsParams = {}) {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    fetchProfessionals()
  }, [params.specialty, params.location, params.sortBy, params.search, params.page])

  const fetchProfessionals = async () => {
    try {
      setLoading(true)
      const searchParams = new URLSearchParams()

      if (params.specialty) searchParams.set("specialty", params.specialty)
      if (params.location) searchParams.set("location", params.location)
      if (params.sortBy) searchParams.set("sortBy", params.sortBy)
      if (params.search) searchParams.set("search", params.search)
      if (params.page) searchParams.set("page", params.page.toString())

      const response = await fetch(`/api/professionals?${searchParams}`)
      if (!response.ok) throw new Error("Failed to fetch professionals")

      const data = await response.json()
      setProfessionals(data.professionals || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 0)
      setHasMore(data.hasMore || false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return {
    professionals,
    loading,
    error,
    total,
    totalPages,
    hasMore,
    refetch: fetchProfessionals,
  }
}
