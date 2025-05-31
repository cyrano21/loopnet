'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LocationFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const LocationFilter: React.FC<LocationFilterProps> = ({ value, onChange, className }) => {
  const locations = [
    { value: 'all', label: 'Toutes les villes' },
    { value: 'paris', label: 'Paris' },
    { value: 'lyon', label: 'Lyon' },
    { value: 'marseille', label: 'Marseille' },
    { value: 'bordeaux', label: 'Bordeaux' },
    { value: 'lille', label: 'Lille' },
    { value: 'toulouse', label: 'Toulouse' },
    { value: 'nantes', label: 'Nantes' },
    { value: 'strasbourg', label: 'Strasbourg' },
  ];

  return (
    <Select value={value || 'all'} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Toutes les villes" />
      </SelectTrigger>
      <SelectContent>
        {locations.map((location) => (
          <SelectItem key={location.value} value={location.value}>
            {location.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LocationFilter;
