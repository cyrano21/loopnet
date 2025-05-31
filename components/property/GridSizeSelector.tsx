'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Grid3X3, LayoutGrid } from 'lucide-react'

type GridSize = '1' | '2' | '3' | '4' | '5'

interface GridSizeSelectorProps {
  value?: GridSize
  onChange?: (size: GridSize) => void
  className?: string
  // Alternative interface names for compatibility
  gridSize?: GridSize
  onGridSizeChange?: (size: GridSize) => void
}

export function GridSizeSelector({ 
  value, 
  onChange, 
  className = '', 
  gridSize, 
  onGridSizeChange 
}: GridSizeSelectorProps) {
  // Use the alternative props if provided, otherwise use the main props
  const currentValue = gridSize !== undefined ? gridSize : (value || '3')
  const handleChange = onGridSizeChange || onChange || (() => {})
  const gridSizes: { size: GridSize; label: string; icon?: React.ReactNode }[] = [
    { size: '1', label: '1 colonne' },
    { size: '2', label: '2 colonnes' },
    { size: '3', label: '3 colonnes', icon: <Grid3X3 className="h-4 w-4" /> },
    { size: '4', label: '4 colonnes' },
    { size: '5', label: '5 colonnes', icon: <LayoutGrid className="h-4 w-4" /> },
  ]

  return (
    <div className={`flex items-center space-x-1 ${className}`}>      {gridSizes.map((gridSizeOption) => (
        <Button
          key={gridSizeOption.size}
          variant={currentValue === gridSizeOption.size ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleChange(gridSizeOption.size)}
          className={`
            h-8 w-8 p-0 transition-all duration-200
            ${currentValue === gridSizeOption.size 
              ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
              : 'bg-white hover:bg-blue-50 hover:border-blue-300 border-gray-200'
            }
          `}
          title={gridSizeOption.label}        >
          {gridSizeOption.icon || gridSizeOption.size}
        </Button>
      ))}
    </div>
  )
}
