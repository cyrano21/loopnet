"use client"

import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { usePermissions } from "@/hooks/use-permissions"
import { Property } from "@/types/property"

export function usePropertyComparison() {
  const { can, limit, userRole } = usePermissions()
  const [comparisonList, setComparisonList] = useState<Property[]>([])
  const [isComparisonOpen, setIsComparisonOpen] = useState(false)
  const [maxComparisons, setMaxComparisons] = useState(0)

  // Récupérer la limite de comparaisons en fonction du rôle de l'utilisateur
  useEffect(() => {
    // Obtenir la limite depuis les permissions
    const maxCompare = limit('maxComparisons') as number
    setMaxComparisons(maxCompare || 0)
  }, [limit, userRole])

  const addToComparison = useCallback((property: Property) => {
    if (!can('canCompareProperties')) {
      toast.error("Vous devez passer à un abonnement supérieur pour utiliser cette fonctionnalité")
      return
    }
    
    setComparisonList((prev) => {
      if (prev.find((p) => p._id === property._id)) {
        toast.error("Cette propriété est déjà dans la comparaison")
        return prev
      }

      if (prev.length >= maxComparisons) {
        toast.error(`Vous ne pouvez comparer que ${maxComparisons} propriétés maximum avec votre abonnement actuel`)
        return prev
      }

      toast.success("Propriété ajoutée à la comparaison")
      return [...prev, property]
    })
  }, [can, maxComparisons])

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
    setIsComparisonOpen(true)
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
