'use client'

import React, { ReactNode } from 'react'
import { usePropertyComparison } from '@/hooks/use-property-comparison'
import { ComparisonBar } from './comparison-bar'
import { PropertyComparisonModal } from './property-comparison-modal'
import { Property } from '@/types/property'

// Contournement temporaire pour React 19 - import direct des fonctions
const createContext = (React as any).createContext
const useContext = (React as any).useContext

interface ComparisonContextType {
  comparisonList: Property[]
  addToComparison: (property: Property) => void
  removeFromComparison: (propertyId: string) => void
  clearComparison: () => void
  openComparison: () => void
  isComparisonOpen: boolean
  setIsComparisonOpen: (isOpen: boolean) => void
}

const ComparisonContext = createContext(null) as any

export function useComparison () {
  const context = useContext(ComparisonContext)
  if (!context) {
    throw new Error('useComparison must be used within ComparisonProvider')
  }
  return context
}

export function ComparisonProvider ({
  children
}: {
  children: React.ReactNode
}) {
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
