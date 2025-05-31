'use client';

import { useState } from 'react';

interface YearBuiltProps {
  onYearBuiltChange: (min: number | null, max: number | null) => void;
  minYearBuilt: number | null;
  maxYearBuilt: number | null;
}

export default function YearBuilt({ onYearBuiltChange, minYearBuilt, maxYearBuilt }: YearBuiltProps) {
  const [localMinYear, setLocalMinYear] = useState(minYearBuilt?.toString() || '');
  const [localMaxYear, setLocalMaxYear] = useState(maxYearBuilt?.toString() || '');

  const currentYear = new Date().getFullYear();
  
  const yearRanges = [
    { label: 'Toute année', min: null, max: null },
    { label: 'Neuf (2020-' + currentYear + ')', min: 2020, max: currentYear },
    { label: 'Récent (2010-2019)', min: 2010, max: 2019 },
    { label: 'Moderne (2000-2009)', min: 2000, max: 2009 },
    { label: 'Années 90 (1990-1999)', min: 1990, max: 1999 },
    { label: 'Années 80 (1980-1989)', min: 1980, max: 1989 },
    { label: 'Vintage (1970-1979)', min: 1970, max: 1979 },
    { label: 'Classique (avant 1970)', min: null, max: 1969 }
  ];

  const handleYearRangeSelect = (min: number | null, max: number | null) => {
    setLocalMinYear(min?.toString() || '');
    setLocalMaxYear(max?.toString() || '');
    onYearBuiltChange(min, max);
  };

  const handleCustomYearChange = () => {
    const min = localMinYear ? parseInt(localMinYear) : null;
    const max = localMaxYear ? parseInt(localMaxYear) : null;
    onYearBuiltChange(min, max);
  };

  return (
    <div className="year-built-filter">
      <h6 className="text-lg font-semibold mb-3">Année de construction</h6>
      
      {/* Années prédéfinies */}
      <div className="space-y-2 mb-4">
        {yearRanges.map((range, index) => (
          <label key={index} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="yearBuiltRange"
              checked={minYearBuilt === range.min && maxYearBuilt === range.max}
              onChange={() => handleYearRangeSelect(range.min, range.max)}
              className="mr-3 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">{range.label}</span>
          </label>
        ))}
      </div>

      {/* Année personnalisée */}
      <div className="border-t pt-4">
        <h6 className="text-sm font-medium mb-2">Année personnalisée</h6>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="number"
              placeholder="De"
              min="1800"
              max={currentYear}
              value={localMinYear}
              onChange={(e) => setLocalMinYear(e.target.value)}
              onBlur={handleCustomYearChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <span className="flex items-center text-gray-500">à</span>
          <div className="flex-1">
            <input
              type="number"
              placeholder="À"
              min="1800"
              max={currentYear}
              value={localMaxYear}
              onChange={(e) => setLocalMaxYear(e.target.value)}
              onBlur={handleCustomYearChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Affichage de l'année sélectionnée */}
      {(minYearBuilt !== null || maxYearBuilt !== null) && (
        <div className="mt-3 p-2 bg-blue-50 rounded-md">
          <span className="text-sm text-blue-800">
            Construite entre: {minYearBuilt || '1800'} - {maxYearBuilt || currentYear}
          </span>
        </div>
      )}
    </div>
  );
}
