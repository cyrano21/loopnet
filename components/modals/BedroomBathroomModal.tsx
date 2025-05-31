'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'

interface BedroomBathroomModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (bedrooms: number, bathrooms: number) => void
  initialBedrooms?: number
  initialBathrooms?: number
}

const BedroomBathroomModal: React.FC<BedroomBathroomModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialBedrooms = 0,
  initialBathrooms = 0
}) => {
  const [selectedBedrooms, setSelectedBedrooms] = useState(initialBedrooms)
  const [selectedBathrooms, setSelectedBathrooms] = useState(initialBathrooms)

  const bedroomOptions = [
    { id: 'bed-any', label: 'any', value: 0 },
    { id: 'bed-1', label: '1+', value: 1 },
    { id: 'bed-2', label: '2+', value: 2 },
    { id: 'bed-3', label: '3+', value: 3 },
    { id: 'bed-4', label: '4+', value: 4 },
    { id: 'bed-5', label: '5+', value: 5 }
  ]

  const bathroomOptions = [
    { id: 'bath-any', label: 'any', value: 0 },
    { id: 'bath-1', label: '1+', value: 1 },
    { id: 'bath-2', label: '2+', value: 2 },
    { id: 'bath-3', label: '3+', value: 3 },
    { id: 'bath-4', label: '4+', value: 4 },
    { id: 'bath-5', label: '5+', value: 5 }
  ]

  const handleApply = () => {
    onApply(selectedBedrooms, selectedBathrooms)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Bedrooms & Bathrooms
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Bedrooms Section */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">
                Bedrooms
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {bedroomOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedBedrooms(option.value)}
                    className={`
                      px-4 py-3 text-sm font-medium rounded-lg border transition-all duration-200
                      ${
                        selectedBedrooms === option.value
                          ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300 hover:bg-orange-50'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bathrooms Section */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">
                Bathrooms
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {bathroomOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedBathrooms(option.value)}
                    className={`
                      px-4 py-3 text-sm font-medium rounded-lg border transition-all duration-200
                      ${
                        selectedBathrooms === option.value
                          ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300 hover:bg-orange-50'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default BedroomBathroomModal