'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationProps {
  onLocationChange: (locations: string[]) => void;
  selectedLocations: string[];
}

export default function Location({ onLocationChange, selectedLocations }: LocationProps) {
  const [customLocation, setCustomLocation] = useState('');

  const popularLocations = [
    'Paris',
    'Lyon',
    'Marseille',
    'Toulouse',
    'Nice',
    'Nantes',
    'Strasbourg',
    'Montpellier',
    'Bordeaux',
    'Lille'
  ];

  const handleLocationToggle = (location: string) => {
    if (selectedLocations.includes(location)) {
      onLocationChange(selectedLocations.filter(l => l !== location));
    } else {
      onLocationChange([...selectedLocations, location]);
    }
  };

  const handleCustomLocationAdd = () => {
    if (customLocation.trim() && !selectedLocations.includes(customLocation.trim())) {
      onLocationChange([...selectedLocations, customLocation.trim()]);
      setCustomLocation('');
    }
  };

  const handleCustomLocationKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomLocationAdd();
    }
  };

  return (
    <div className="location-filter">
      <h6 className="text-lg font-semibold mb-3 flex items-center">
        <MapPin className="h-4 w-4 mr-2" />
        Localisation
      </h6>

      {/* Recherche de localisation personnalisée */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={customLocation}
            onChange={(e) => setCustomLocation(e.target.value)}
            onKeyPress={handleCustomLocationKeyPress}
            placeholder="Entrez une ville ou région..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleCustomLocationAdd}
            className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            Ajouter
          </button>
        </div>
      </div>

      {/* Villes populaires */}
      <div className="mb-4">
        <h6 className="text-sm font-medium mb-2">Villes populaires</h6>
        <div className="space-y-2">
          {popularLocations.map((location) => (
            <label key={location} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLocations.includes(location)}
                onChange={() => handleLocationToggle(location)}
                className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">{location}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Localisations sélectionnées */}
      {selectedLocations.length > 0 && (
        <div className="border-t pt-3">
          <h6 className="text-sm font-medium mb-2">Localisations sélectionnées</h6>
          <div className="flex flex-wrap gap-2">
            {selectedLocations.map((location) => (
              <span
                key={location}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
              >
                {location}
                <button
                  onClick={() => handleLocationToggle(location)}
                  className="ml-1 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <button
            onClick={() => onLocationChange([])}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Effacer toutes les localisations
          </button>
        </div>
      )}
    </div>
  );
}
