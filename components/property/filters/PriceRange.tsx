'use client';

import { useState } from 'react';

interface PriceRangeProps {
  onPriceChange: (min: number | null, max: number | null) => void;
  minPrice: number | null;
  maxPrice: number | null;
}

export default function PriceRange({ onPriceChange, minPrice, maxPrice }: PriceRangeProps) {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice?.toString() || '');
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice?.toString() || '');

  const priceRanges = [
    { label: 'Tous les prix', min: null, max: null },
    { label: '0 € - 100 000 €', min: 0, max: 100000 },
    { label: '100 000 € - 200 000 €', min: 100000, max: 200000 },
    { label: '200 000 € - 300 000 €', min: 200000, max: 300000 },
    { label: '300 000 € - 500 000 €', min: 300000, max: 500000 },
    { label: '500 000 € - 750 000 €', min: 500000, max: 750000 },
    { label: '750 000 € - 1 000 000 €', min: 750000, max: 1000000 },
    { label: '1 000 000 € +', min: 1000000, max: null }
  ];

  const handlePriceRangeSelect = (min: number | null, max: number | null) => {
    setLocalMinPrice(min?.toString() || '');
    setLocalMaxPrice(max?.toString() || '');
    onPriceChange(min, max);
  };

  const handleCustomPriceChange = () => {
    const min = localMinPrice ? parseInt(localMinPrice) : null;
    const max = localMaxPrice ? parseInt(localMaxPrice) : null;
    onPriceChange(min, max);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="price-range-filter">
      <h6 className="text-lg font-semibold mb-3">Gamme de prix</h6>
      
      {/* Prix prédéfinis */}
      <div className="space-y-2 mb-4">
        {priceRanges.map((range, index) => (
          <label key={index} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="priceRange"
              checked={minPrice === range.min && maxPrice === range.max}
              onChange={() => handlePriceRangeSelect(range.min, range.max)}
              className="mr-3 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">{range.label}</span>
          </label>
        ))}
      </div>

      {/* Prix personnalisés */}
      <div className="border-t pt-4">
        <h6 className="text-sm font-medium mb-2">Prix personnalisé</h6>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="number"
              placeholder="Min"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
              onBlur={handleCustomPriceChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <span className="flex items-center text-gray-500">à</span>
          <div className="flex-1">
            <input
              type="number"
              placeholder="Max"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
              onBlur={handleCustomPriceChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Affichage du prix sélectionné */}
      {(minPrice !== null || maxPrice !== null) && (
        <div className="mt-3 p-2 bg-blue-50 rounded-md">
          <span className="text-sm text-blue-800">
            Prix sélectionné: {minPrice ? formatPrice(minPrice) : '0 €'} - {maxPrice ? formatPrice(maxPrice) : 'Illimité'}
          </span>
        </div>
      )}
    </div>
  );
}
