'use client'

import React, { useState, useEffect } from "react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Check, MapPin, X } from "lucide-react"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"

interface PropertyFilterLocationProps {
  handleFilterChange: (key: string, value: any) => void;
  filters: any;
  availableCities?: string[];
}

const PropertyFilterLocation: React.FC<PropertyFilterLocationProps> = ({
  handleFilterChange,
  filters,
  availableCities = ["Paris", "Lyon", "Marseille", "Bordeaux", "Toulouse", "Nantes", "Strasbourg", "Lille", "Nice", "Rennes"]
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState<string[]>(availableCities);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCities(availableCities);
    } else {
      const filtered = availableCities.filter(city => 
        city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [searchTerm, availableCities]);

  const handleCitySelect = (city: string) => {
    handleFilterChange('city', city);
  };

  const clearCity = () => {
    handleFilterChange('city', '');
    setSearchTerm('');
  };

  return (
    <div className="property-filter-location space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Localisation
        </h3>
        {filters.city && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearCity}
            className="h-8 px-2 text-slate-500"
          >
            <X className="h-4 w-4 mr-1" />
            Effacer
          </Button>
        )}
      </div>
      
      <div className="relative">
        <MapPin className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          placeholder="Rechercher une ville..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {filters.city && (
        <div className="flex items-center">
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {filters.city}
          </Badge>
        </div>
      )}

      <ScrollArea className="h-60">
        <div className="space-y-1">
          {filteredCities.map((city) => (
            <div
              key={city}
              className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 ${
                filters.city === city ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''
              }`}
              onClick={() => handleCitySelect(city)}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>{city}</span>
              </div>
              {filters.city === city && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </div>
          ))}
          
          {filteredCities.length === 0 && (
            <div className="text-center p-4 text-slate-500">
              Aucune ville trouvée
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export default PropertyFilterLocation
