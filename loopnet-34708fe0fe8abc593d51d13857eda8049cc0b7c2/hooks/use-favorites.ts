"use client"

import { useState, useEffect } from "react"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    // Charger les favoris depuis localStorage
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  const addToFavorites = async (propertyId: string) => {
    const newFavorites = [...favorites, propertyId]
    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
  }

  const removeFromFavorites = async (propertyId: string) => {
    const newFavorites = favorites.filter((id) => id !== propertyId)
    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
  }

  const isFavorite = (propertyId: string) => {
    return favorites.includes(propertyId)
  }

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  }
}
