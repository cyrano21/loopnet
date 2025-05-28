"use client"

import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"

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
  size: number
  bedrooms?: number
  bathrooms?: number
  description: string
}

export function usePropertyComparison() {
  const [comparisonList, setComparisonList] = useState<Property[]>([])
  const [isComparisonOpen, setIsComparisonOpen] = useState(false)

  // Charger depuis localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem("property-comparison")
    if (saved) {
      try {
        setComparisonList(JSON.parse(saved))
      } catch (error) {
        console.error("Erreur lors du chargement de la comparaison:", error)
      }
    }
  }, [])

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("property-comparison", JSON.stringify(comparisonList))
  }, [comparisonList])

  const addToComparison = useCallback((property: Property) => {
    setComparisonList((prev) => {
      if (prev.find((p) => p._id === property._id)) {
        toast.error("Cette propriété est déjà dans la comparaison")
        return prev
      }

      if (prev.length >= 4) {
        toast.error("Vous ne pouvez comparer que 4 propriétés maximum")
        return prev
      }

      toast.success("Propriété ajoutée à la comparaison")
      return [...prev, property]
    })
  }, [])

  const removeFromComparison = useCallback((propertyId: string) => {
    setComparisonList((prev) => prev.filter((p) => p._id !== propertyId))
    toast.success("Propriété retirée de la comparaison")
  }, [])

  const clearComparison = useCallback(() => {
    setComparisonList([])
    setIsComparisonOpen(false)
    toast.success("Comparaison effacée")
  }, [])

  const openComparison = useCallback(() => {
    if (comparisonList.length < 2) {
      toast.error("Sélectionnez au moins 2 propriétés pour comparer")
      return
    }
    // Rediriger vers la page de comparaison
    window.location.href = "/compare"
  }, [comparisonList.length])

  return {
    comparisonList,
    isComparisonOpen,
    setIsComparisonOpen,
    addToComparison,
    removeFromComparison,
    clearComparison,
    openComparison,
  }
}
