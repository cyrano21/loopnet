'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

interface PropertyFiltersProps {
  onFilterChange: (key: string, value: any) => void
}

export function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const [filters, setFilters] = useState({
    transactionType: 'all',
    propertyType: 'all',
    city: '',
    minPrice: '',
    maxPrice: '',
    minSurface: '',
    maxSurface: '',
    rooms: '',
    sort: 'newest'
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    // Convert 'all' back to empty string for the parent component
    const processedValue = value === 'all' ? '' : value
    onFilterChange(key, processedValue)
  }

  const clearFilters = () => {
    const clearedFilters = {
      transactionType: 'all',
      propertyType: 'all',
      city: '',
      minPrice: '',
      maxPrice: '',
      minSurface: '',
      maxSurface: '',
      rooms: '',
      sort: 'newest'
    }
    setFilters(clearedFilters)
    Object.keys(clearedFilters).forEach(key => {
      onFilterChange(key, clearedFilters[key as keyof typeof clearedFilters])
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filtres</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Type de transaction */}
        <div>
          <Label htmlFor="transactionType">Type de transaction</Label>
          <Select
            value={filters.transactionType}
            onValueChange={(value) => handleFilterChange('transactionType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="sale">Vente</SelectItem>
              <SelectItem value="rent">Location</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type de propriété */}
        <div>
          <Label htmlFor="propertyType">Type de propriété</Label>
          <Select
            value={filters.propertyType}
            onValueChange={(value) => handleFilterChange('propertyType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="office">Bureau</SelectItem>
              <SelectItem value="retail">Commerce</SelectItem>
              <SelectItem value="warehouse">Entrepôt</SelectItem>
              <SelectItem value="industrial">Industriel</SelectItem>
              <SelectItem value="land">Terrain</SelectItem>
              <SelectItem value="hotel">Hôtel</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ville */}
        <div>
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            placeholder="Entrez une ville"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
          />
        </div>

        <Separator />

        {/* Prix */}
        <div>
          <Label>Prix (€)</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Min"
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
            <Input
              placeholder="Max"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>
        </div>

        {/* Surface */}
        <div>
          <Label>Surface (m²)</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Min"
              type="number"
              value={filters.minSurface}
              onChange={(e) => handleFilterChange('minSurface', e.target.value)}
            />
            <Input
              placeholder="Max"
              type="number"
              value={filters.maxSurface}
              onChange={(e) => handleFilterChange('maxSurface', e.target.value)}
            />
          </div>
        </div>

        {/* Nombre de pièces */}
        <div>
          <Label htmlFor="rooms">Nombre de pièces</Label>
          <Input
            id="rooms"
            placeholder="Nombre de pièces"
            type="number"
            value={filters.rooms}
            onChange={(e) => handleFilterChange('rooms', e.target.value)}
          />
        </div>

        <Separator />

        {/* Tri */}
        <div>
          <Label htmlFor="sort">Trier par</Label>
          <Select
            value={filters.sort}
            onValueChange={(value) => handleFilterChange('sort', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Plus récent</SelectItem>
              <SelectItem value="oldest">Plus ancien</SelectItem>
              <SelectItem value="price-asc">Prix croissant</SelectItem>
              <SelectItem value="price-desc">Prix décroissant</SelectItem>
              <SelectItem value="surface-asc">Surface croissante</SelectItem>
              <SelectItem value="surface-desc">Surface décroissante</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bouton pour effacer les filtres */}
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
        >
          Effacer les filtres
        </Button>
      </CardContent>
    </Card>
  )
}