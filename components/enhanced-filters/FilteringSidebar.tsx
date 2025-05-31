'use client';

import React from 'react';
import LocationFilter from './LocationFilter';
import PropertyTypeFilter from './PropertyTypeFilter';
import PriceRangeFilter from './PriceRangeFilter';
import FeaturesFilter from './FeaturesFilter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterParams {
  transactionType: string;
  propertyType: string;
  city: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  features: string[];
  [key: string]: any;
}

interface FilteringSidebarProps {
  filters: FilterParams;
  onFilterChange: (key: string, value: any) => void;
  onReset: () => void;
  className?: string;
}

const FilteringSidebar: React.FC<FilteringSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
  className = '',
}) => {
  const handlePropertyTypeChange = (types: string[]) => {
    onFilterChange('propertyTypes', types);
  };
  const handleCityChange = (city: string) => {
    // Si la valeur est 'all', on considère qu'aucun filtre de ville n'est appliqué
    onFilterChange('city', city === 'all' ? '' : city);
  };

  const handlePriceChange = (min: number | undefined, max: number | undefined) => {
    onFilterChange('minPrice', min);
    onFilterChange('maxPrice', max);
  };

  const handleFeaturesChange = (features: string[]) => {
    onFilterChange('features', features);
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}>
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Filtres avancés</h3>
        <Button variant="ghost" size="sm" onClick={onReset} className="flex items-center gap-1">
          <X className="h-4 w-4" /> Réinitialiser
        </Button>
      </div>
      
      <div className="p-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Basique</TabsTrigger>
            <TabsTrigger value="features">Équipements</TabsTrigger>
            <TabsTrigger value="more">Avancés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Ville
              </label>
              <LocationFilter 
                value={filters.city}
                onChange={handleCityChange}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Prix
              </label>
              <PriceRangeFilter 
                minPrice={filters.minPrice}
                maxPrice={filters.maxPrice}
                onChange={handlePriceChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Type de propriété
              </label>
              <PropertyTypeFilter 
                selectedTypes={filters.propertyTypes || []}
                onChange={handlePropertyTypeChange}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Équipements
              </label>
              <FeaturesFilter 
                selectedFeatures={filters.features || []}
                onChange={handleFeaturesChange}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="more" className="space-y-4">
            {/* Contenu supplémentaire pour les filtres avancés */}
            <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
              D'autres filtres avancés seront bientôt disponibles
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          Appliquer les filtres
        </Button>
      </div>
    </div>
  );
};

export default FilteringSidebar;
