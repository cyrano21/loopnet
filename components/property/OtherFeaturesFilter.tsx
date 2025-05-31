'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Home, 
  Car, 
  Wifi, 
  Shield, 
  Zap, 
  TreePine, 
  Waves,
  Camera,
  Wind,
  Snowflake,
  Sun,
  Building
} from 'lucide-react'

interface OtherFeaturesFilterProps {
  value?: string[]
  onChange?: (value: string[]) => void
  // Alternative interface names for compatibility
  selectedFeatures?: string[]
  onFeaturesChange?: (value: string[]) => void
}

export function OtherFeaturesFilter({ 
  value, 
  onChange, 
  selectedFeatures, 
  onFeaturesChange 
}: OtherFeaturesFilterProps) {
  // Use the alternative props if provided, otherwise use the main props
  const currentValue = selectedFeatures !== undefined ? selectedFeatures : (value || [])
  const handleChange = onFeaturesChange || onChange || (() => {})
  const features = [
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'ascenseur', label: 'Ascenseur', icon: Building },
    { id: 'climatisation', label: 'Climatisation', icon: Wind },
    { id: 'chauffage', label: 'Chauffage', icon: Sun },
    { id: 'fibre', label: 'Fibre optique', icon: Wifi },
    { id: 'securite', label: 'Sécurité 24h', icon: Shield },
    { id: 'alarme', label: 'Système d\'alarme', icon: Shield },
    { id: 'videosurveillance', label: 'Vidéosurveillance', icon: Camera },
    { id: 'balcon', label: 'Balcon', icon: Home },
    { id: 'terrasse', label: 'Terrasse', icon: Home },
    { id: 'jardin', label: 'Jardin', icon: TreePine },
    { id: 'piscine', label: 'Piscine', icon: Waves },
    { id: 'cave', label: 'Cave/Cellier', icon: Home },
    { id: 'concierge', label: 'Concierge', icon: Shield },
    { id: 'vue_mer', label: 'Vue mer', icon: Waves },
    { id: 'vue_degagee', label: 'Vue dégagée', icon: Sun },
    { id: 'meuble', label: 'Meublé', icon: Home },
    { id: 'cuisine_equipee', label: 'Cuisine équipée', icon: Home },
    { id: 'salle_sport', label: 'Salle de sport', icon: Zap },
    { id: 'sauna', label: 'Sauna', icon: Snowflake }
  ]
  const handleFeatureChange = (featureId: string, checked: boolean) => {
    if (checked) {
      handleChange([...currentValue, featureId])
    } else {
      handleChange(currentValue.filter(id => id !== featureId))
    }
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Home className="w-4 h-4 text-blue-600" />
        Équipements et caractéristiques
      </Label>
      <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
        {features.map((feature) => {
          const IconComponent = feature.icon
          return (
            <div key={feature.id} className="flex items-center space-x-3">              <Checkbox
                id={feature.id}
                checked={currentValue.includes(feature.id)}
                onCheckedChange={(checked) => handleFeatureChange(feature.id, checked as boolean)}
                className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label 
                htmlFor={feature.id} 
                className="text-sm text-gray-700 cursor-pointer flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <IconComponent className="w-3 h-3 text-gray-500" />
                {feature.label}
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
