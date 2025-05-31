'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Bath } from 'lucide-react'

interface BathroomFilterProps {
  value?: number | undefined
  onChange?: (value: number | undefined) => void
  // Alternative interface names for compatibility
  selectedBathrooms?: number | undefined
  onBathroomChange?: (value: number | undefined) => void
}

export function BathroomFilter({ 
  value, 
  onChange, 
  selectedBathrooms, 
  onBathroomChange 
}: BathroomFilterProps) {
  // Use the alternative props if provided, otherwise use the main props
  const currentValue = selectedBathrooms !== undefined ? selectedBathrooms : (value || undefined)
  const handleChange = onBathroomChange || onChange || (() => {})
  const options = [
    { id: 'any', label: 'Tous', value: undefined },
    { id: 'oneplus', label: '1+', value: 1 },
    { id: 'twoplus', label: '2+', value: 2 },
    { id: 'threeplus', label: '3+', value: 3 },
    { id: 'fourplus', label: '4+', value: 4 },
    { id: 'fiveplus', label: '5+', value: 5 },
  ]

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Bath className="w-4 h-4 text-blue-600" />
        Salles de bain
      </Label>
      <div className="grid grid-cols-3 gap-2">        {options.map((option) => (
          <Button
            key={option.id}
            variant={currentValue === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleChange(option.value)}
            className={`
              h-8 text-xs transition-all duration-200
              ${currentValue === option.value 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                : 'bg-white hover:bg-blue-50 hover:border-blue-300 border-gray-200'
              }
            `}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
