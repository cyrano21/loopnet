'use client';

import { useState } from 'react';

interface SquareFeetProps {
  onSquareFeetChange: (min: number | null, max: number | null) => void;
  minSquareFeet: number | null;
  maxSquareFeet: number | null;
}

export default function SquareFeet({ onSquareFeetChange, minSquareFeet, maxSquareFeet }: SquareFeetProps) {
  const [localMinSqFt, setLocalMinSqFt] = useState(minSquareFeet?.toString() || '');
  const [localMaxSqFt, setLocalMaxSqFt] = useState(maxSquareFeet?.toString() || '');

  const squareFeetRanges = [
    { label: 'Toute superficie', min: null, max: null },
    { label: '0 - 50 m²', min: 0, max: 50 },
    { label: '50 - 75 m²', min: 50, max: 75 },
    { label: '75 - 100 m²', min: 75, max: 100 },
    { label: '100 - 150 m²', min: 100, max: 150 },
    { label: '150 - 200 m²', min: 150, max: 200 },
    { label: '200 - 300 m²', min: 200, max: 300 },
    { label: '300+ m²', min: 300, max: null }
  ];

  const handleSquareFeetRangeSelect = (min: number | null, max: number | null) => {
    setLocalMinSqFt(min?.toString() || '');
    setLocalMaxSqFt(max?.toString() || '');
    onSquareFeetChange(min, max);
  };

  const handleCustomSquareFeetChange = () => {
    const min = localMinSqFt ? parseInt(localMinSqFt) : null;
    const max = localMaxSqFt ? parseInt(localMaxSqFt) : null;
    onSquareFeetChange(min, max);
  };

  return (
    <div className="square-feet-filter">
      <h6 className="text-lg font-semibold mb-3">Superficie (m²)</h6>
      
      {/* Superficies prédéfinies */}
      <div className="space-y-2 mb-4">
        {squareFeetRanges.map((range, index) => (
          <label key={index} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="squareFeetRange"
              checked={minSquareFeet === range.min && maxSquareFeet === range.max}
              onChange={() => handleSquareFeetRangeSelect(range.min, range.max)}
              className="mr-3 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">{range.label}</span>
          </label>
        ))}
      </div>

      {/* Superficie personnalisée */}
      <div className="border-t pt-4">
        <h6 className="text-sm font-medium mb-2">Superficie personnalisée</h6>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="number"
              placeholder="Min m²"
              value={localMinSqFt}
              onChange={(e) => setLocalMinSqFt(e.target.value)}
              onBlur={handleCustomSquareFeetChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <span className="flex items-center text-gray-500">à</span>
          <div className="flex-1">
            <input
              type="number"
              placeholder="Max m²"
              value={localMaxSqFt}
              onChange={(e) => setLocalMaxSqFt(e.target.value)}
              onBlur={handleCustomSquareFeetChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Affichage de la superficie sélectionnée */}
      {(minSquareFeet !== null || maxSquareFeet !== null) && (
        <div className="mt-3 p-2 bg-blue-50 rounded-md">
          <span className="text-sm text-blue-800">
            Superficie: {minSquareFeet || 0} m² - {maxSquareFeet ? `${maxSquareFeet} m²` : 'Illimitée'}
          </span>
        </div>
      )}
    </div>
  );
}
