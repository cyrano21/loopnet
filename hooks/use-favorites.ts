"use client"

import { useState, useEffect } from "react"

interface Property {
  _id: string
  title: string
  price: number
  location: {
    address: string
    city: string
    state: string
  }
  images: string[]
  propertyType: string
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/favorites")
      if (!response.ok) throw new Error("Failed to fetch favorites")
      const data = await response.json()
      setFavorites(data.favorites || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const addToFavorites = async (propertyId: string) => {
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      })
      if (!response.ok) throw new Error("Failed to add to favorites")
      await fetchFavorites()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  const removeFromFavorites = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/favorites/${propertyId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to remove from favorites")
      await fetchFavorites()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  const isFavorite = (propertyId: string) => {
    return favorites.some((fav) => fav._id === propertyId)
  }

  return {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refetch: fetchFavorites,
  }
}
