"use client"

import { useState } from "react"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void
  className?: string
}

interface SearchFilters {
  query: string
  location: string
  propertyType: string
  minPrice: string
  maxPrice: string
}

export default function SearchBar({ onSearch, className = "" }: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    location: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
  })

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Query */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search properties..."
              value={filters.query}
              onChange={(e) => handleInputChange("query", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Location"
              value={filters.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Property Type */}
        <div>
          <Select value={filters.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="multifamily">Multifamily</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div>
          <Button onClick={handleSearch} className="w-full">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <Input
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => handleInputChange("minPrice", e.target.value)}
            type="number"
          />
        </div>
        <div>
          <Input
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => handleInputChange("maxPrice", e.target.value)}
            type="number"
          />
        </div>
      </div>
    </div>
  )
}
