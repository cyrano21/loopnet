'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface PropertyTypeFilterProps {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
}

const PropertyTypeFilter: React.FC<PropertyTypeFilterProps> = ({ selectedTypes, onChange }) => {
  const propertyTypes = [
    { value: 'apartment', label: 'Appartement' },
    { value: 'house', label: 'Maison' },
    { value: 'office', label: 'Bureau' },
    { value: 'retail', label: 'Commerce' },
    { value: 'warehouse', label: 'Entrepôt' },
    { value: 'industrial', label: 'Industriel' },
    { value: 'hotel', label: 'Hôtel' },
    { value: 'land', label: 'Terrain' },
  ];

  const handleTypeChange = (type: string) => {
    if (selectedTypes.includes(type)) {
      onChange(selectedTypes.filter(t => t !== type));
    } else {
      onChange([...selectedTypes, type]);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {propertyTypes.map((type) => (
        <div key={type.value} className="flex items-center space-x-2">
          <Checkbox
            id={`type-${type.value}`}
            checked={selectedTypes.includes(type.value)}
            onCheckedChange={() => handleTypeChange(type.value)}
          />
          <Label
            htmlFor={`type-${type.value}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {type.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default PropertyTypeFilter;
