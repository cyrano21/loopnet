'use client';

import React from 'react';
import { 
  MapPin, 
  Building2, 
  Search, 
  CalendarDays,
  ArrowDownUp,
  Grid3X3, 
  Heart, 
  Sliders 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterParams {
  transactionType: string;
  q: string;
  [key: string]: any;
}

interface TopFilterProps {
  filters: FilterParams;
  onFilterChange: (key: string, value: any) => void;
  onShowFilters: () => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  clearFilters: () => void;
  activeFilterCount: number;
}

const TopFilter: React.FC<TopFilterProps> = ({
  filters,
  onFilterChange,
  onShowFilters,
  sortBy,
  setSortBy,
  clearFilters,
  activeFilterCount,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange('q', e.target.value);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Search */}
        <div className="lg:col-span-5 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <Input
            placeholder="Rechercher par adresse, quartier, code postal..."
            value={filters.q || ''}
            onChange={handleSearchChange}
            className="pl-9 border border-slate-200 dark:border-slate-700"
          />
        </div>
        
        {/* Transaction Type */}
        <div className="lg:col-span-2">
          <Select 
            value={filters.transactionType} 
            onValueChange={(value) => onFilterChange('transactionType', value)}
          >
            <SelectTrigger className="border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-500" />
                <SelectValue placeholder="Type de transaction" />
              </div>
            </SelectTrigger>
            <SelectContent>              <SelectItem value="all">Tous types</SelectItem>
              <SelectItem value="rent">Location</SelectItem>
              <SelectItem value="sale">Vente</SelectItem>
              <SelectItem value="vacation">Saisonnier</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Sort */}
        <div className="lg:col-span-3">
          <Select 
            value={sortBy} 
            onValueChange={(value) => setSortBy(value)}
          >
            <SelectTrigger className="border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <ArrowDownUp className="h-4 w-4 text-slate-500" />
                <SelectValue placeholder="Trier par" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Plus récents</SelectItem>
              <SelectItem value="price-low">Prix croissant</SelectItem>
              <SelectItem value="price-high">Prix décroissant</SelectItem>
              <SelectItem value="size-large">Surface décroissante</SelectItem>
              <SelectItem value="featured">En vedette</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Filter Button */}
        <div className="lg:col-span-2 flex justify-end">
          <Button 
            variant="outline" 
            onClick={onShowFilters} 
            className="w-full flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
          >
            <Sliders className="h-4 w-4" />
            Filtres
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
      
      {activeFilterCount > 0 && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          {filters.city && (
            <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20">
              <MapPin className="h-3 w-3" />
              {filters.city}
              <button onClick={() => onFilterChange('city', '')} className="ml-1 hover:text-red-500">×</button>
            </Badge>
          )}
          
          {filters.transactionType && (
            <Badge variant="outline" className="flex items-center gap-1 bg-purple-50 dark:bg-purple-900/20">
              <Building2 className="h-3 w-3" />
              {filters.transactionType === 'rent' ? 'À louer' : 
               filters.transactionType === 'sale' ? 'À vendre' : 'Saisonnier'}
              <button onClick={() => onFilterChange('transactionType', '')} className="ml-1 hover:text-red-500">×</button>
            </Badge>
          )}
          
          {filters.propertyType && (
            <Badge variant="outline" className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20">
              <Building2 className="h-3 w-3" />
              {filters.propertyType}
              <button onClick={() => onFilterChange('propertyType', '')} className="ml-1 hover:text-red-500">×</button>
            </Badge>
          )}
          
          {(filters.minPrice || filters.maxPrice) && (
            <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20">
              Prix: {filters.minPrice || '0'} - {filters.maxPrice || 'Max'} €
              <button 
                onClick={() => {
                  onFilterChange('minPrice', undefined);
                  onFilterChange('maxPrice', undefined);
                }} 
                className="ml-1 hover:text-red-500"
              >×</button>
            </Badge>
          )}
          
          {filters.features?.length > 0 && (
            <Badge variant="outline" className="flex items-center gap-1 bg-rose-50 dark:bg-rose-900/20">
              Équipements: {filters.features.length}
              <button onClick={() => onFilterChange('features', [])} className="ml-1 hover:text-red-500">×</button>
            </Badge>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters} 
            className="text-xs text-slate-500 hover:text-red-500"
          >
            Effacer tout
          </Button>
        </div>
      )}
    </div>
  );
};

export default TopFilter;
