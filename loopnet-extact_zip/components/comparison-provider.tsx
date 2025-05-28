"use client"

import type React from "react"

import { createContext, useContext } from "react"
import { usePropertyComparison } from "@/hooks/use-property-comparison"
import { ComparisonBar } from "./comparison-bar"
import { PropertyComparisonModal } from "./property-comparison-modal"

const ComparisonContext = createContext<ReturnType<typeof usePropertyComparison> | null>(null)

export function useComparison() {
  const context = useContext(ComparisonContext)
  if (!context) {
    throw new Error("useComparison must be used within ComparisonProvider")
  }
  return context
}

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const comparison = usePropertyComparison()

  return (
    <ComparisonContext.Provider value={comparison}>
      {children}
      <ComparisonBar
        properties={comparison.comparisonList}
        onRemove={comparison.removeFromComparison}
        onCompare={comparison.openComparison}
        onClear={comparison.clearComparison}
      />
      <PropertyComparisonModal
        isOpen={comparison.isComparisonOpen}
        onClose={() => comparison.setIsComparisonOpen(false)}
        properties={comparison.comparisonList}
        onRemove={comparison.removeFromComparison}
      />
    </ComparisonContext.Provider>
  )
}
