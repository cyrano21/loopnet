'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FeaturesFilterProps {
  selectedFeatures: string[];
  onChange: (features: string[]) => void;
}

const FeaturesFilter: React.FC<FeaturesFilterProps> = ({ selectedFeatures, onChange }) => {
  const features = [
    { value: 'elevator', label: 'Ascenseur' },
    { value: 'parking', label: 'Parking' },
    { value: 'security', label: 'Sécurité 24h' },
    { value: 'aircon', label: 'Climatisation' },
    { value: 'fiber', label: 'Fibre optique' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'gym', label: 'Salle de sport' },
    { value: 'terrace', label: 'Terrasse' },
    { value: 'sea-view', label: 'Vue mer' },
    { value: 'public-transport', label: 'Transport public' },
  ];

  const handleFeatureChange = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      onChange(selectedFeatures.filter(f => f !== feature));
    } else {
      onChange([...selectedFeatures, feature]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {features.map((feature) => (
        <div key={feature.value} className="flex items-center space-x-2">
          <Checkbox
            id={`feature-${feature.value}`}
            checked={selectedFeatures.includes(feature.value)}
            onCheckedChange={() => handleFeatureChange(feature.value)}
          />
          <Label
            htmlFor={`feature-${feature.value}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {feature.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default FeaturesFilter;
