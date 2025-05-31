'use client'

import React from "react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { 
  Building2, 
  DollarSign, 
  MapPin, 
  Calendar,
  SquareM, 
  Car, 
  Star,
  Eye
} from "lucide-react"
import { Input } from "../ui/input"

interface FilterFunctions {
  handleFilterChange: (key: string, value: any) => void;
  clearFilters: () => void;
  filters: any;
  quickFilters: {
    label: string;
    key: string;
    value: any;
    icon: React.ElementType;
  }[];
  handleQuickFilter: (key: string, value: any) => void;
  propertyTypes: string[];
  availabilityOptions: { value: string; label: string }[];
  buildingClasses: { value: string; label: string }[];
  features: string[];
}

const AdvancedPropertyFilter: React.FC<FilterFunctions> = ({
  handleFilterChange,
  clearFilters,
  filters,
  quickFilters,
  handleQuickFilter,
  propertyTypes,
  availabilityOptions,
  buildingClasses,
  features
}) => {
  return (
    <div className="property-filter-advanced">
      {/* Quick Filters */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Filtres rapides
        </h3>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter) => {
            const IconComponent = filter.icon;
            const isActive = filters[filter.key as keyof typeof filters] === filter.value;
            
            return (
              <Button
                key={filter.label}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handleQuickFilter(filter.key, filter.value)}
                className={`flex items-center gap-2 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Transaction Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Type de transaction
        </label>
        <Select value={filters.transactionType} onValueChange={(value) => handleFilterChange('transactionType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Tous types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous types</SelectItem>
            <SelectItem value="rent">À louer</SelectItem>
            <SelectItem value="sale">À vendre</SelectItem>
            <SelectItem value="vacation">Location saisonnière</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Property Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Type de propriété
        </label>
        <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange('propertyType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Tous types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous types</SelectItem>
            {propertyTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Fourchette de prix
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <DollarSign className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
          <div className="relative">
            <DollarSign className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Surface Area */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Surface (m²)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <SquareM className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="number"
              placeholder="Min"
              value={filters.minSurface || ''}
              onChange={(e) => handleFilterChange('minSurface', e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
          <div className="relative">
            <SquareM className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxSurface || ''}
              onChange={(e) => handleFilterChange('maxSurface', e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Ville
        </label>
        <div className="relative">
          <MapPin className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Entrer une ville"
            value={filters.city || ''}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      {/* Availability */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Disponibilité
        </label>
        <Select value={filters.availability} onValueChange={(value) => handleFilterChange('availability', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Toutes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {availabilityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Building Class */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Classe de bâtiment
        </label>
        <Select value={filters.buildingClass} onValueChange={(value) => handleFilterChange('buildingClass', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Toutes classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes classes</SelectItem>
            {buildingClasses.map((cls) => (
              <SelectItem key={cls.value} value={cls.value}>{cls.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Features */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Équipements
        </label>
        <div className="grid grid-cols-2 gap-2">
          {features.map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={feature}
                checked={filters.features.includes(feature)}
                onChange={() => handleFilterChange('features', feature)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={feature} className="text-xs text-slate-600 dark:text-slate-400">
                {feature}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Year Built */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Année de construction
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <Calendar className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="number"
              placeholder="De"
              value={filters.yearBuilt?.min || ''}
              onChange={(e) => handleFilterChange('yearBuilt.min', e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
          <div className="relative">
            <Calendar className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="number"
              placeholder="À"
              value={filters.yearBuilt?.max || ''}
              onChange={(e) => handleFilterChange('yearBuilt.max', e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Parking */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Places de parking (min)
        </label>
        <div className="relative">
          <Car className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="number"
            placeholder="0"
            value={filters.parking || ''}
            onChange={(e) => handleFilterChange('parking', e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-6">
        <Button 
          onClick={clearFilters} 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
        >
          <X className="h-4 w-4" />
          Réinitialiser tous les filtres
        </Button>
      </div>
    </div>
  )
}

export default AdvancedPropertyFilter
