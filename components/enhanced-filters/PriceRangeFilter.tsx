'use client';

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface PriceRangeFilterProps {
  minPrice: number | undefined;
  maxPrice: number | undefined;
  onChange: (min: number | undefined, max: number | undefined) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minPrice,
  maxPrice,
  onChange,
}) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? undefined : Number(e.target.value);
    onChange(value, maxPrice);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? undefined : Number(e.target.value);
    onChange(minPrice, value);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
            Min (€)
          </label>
          <Input
            type="number"
            placeholder="Min"
            value={minPrice || ''}
            onChange={handleMinChange}
            className="text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
            Max (€)
          </label>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice || ''}
            onChange={handleMaxChange}
            className="text-sm"
          />
        </div>
      </div>
      <div className="px-2">
        <Slider
          defaultValue={[minPrice || 0, maxPrice || 5000000]}
          min={0}
          max={5000000}
          step={50000}
          onValueChange={(values) => {
            onChange(values[0], values[1]);
          }}
          className="mt-6"
        />
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>0 €</span>
          <span>5M €</span>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
