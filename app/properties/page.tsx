'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { SearchBar } from '@/components/ui/SearchBar'
import { CustomPagination } from '@/components/custom-pagination'
import { PropertyCard } from '@/components/property-card'
// import { PropertyCardMobile } from '@/components/property-card-mobile' // Remplacé par PropertyCard avec prop compact
import { useProperties } from '@/hooks/use-properties'
import { usePermissions } from '@/hooks/use-permissions'
import { PropertyFilters } from '@/components/property-filters'
import { useComparison } from '@/components/comparison-provider'
import { UsageLimit } from '@/components/usage-limit'
import { AccessRestriction } from '@/components/access-restriction'
import FilteringSidebar from '@/components/enhanced-filters/FilteringSidebar'
import BedroomBathroomModal from '@/components/modals/BedroomBathroomModal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { 
  Grid3X3, 
  List, 
  Map, 
  Filter, 
  SlidersHorizontal, 
  Search, 
  ChevronDown, 
  Eye, 
  LayoutGrid,
  MapPin,
  Building2,
  TrendingUp,
  Calendar,
  DollarSign,
  SquareM,
  Bed,
  Bath,
  Car,
  Star,
  Heart,
  Share2,
  X
} from 'lucide-react'

type ViewMode = 'grid' | 'list' | 'map' | 'grid-large' | 'grid-small' | 'grid-1-col' | 'grid-2-col' | 'grid-3-col' | 'grid-4-col'
type SortBy = 'newest' | 'oldest' | 'price-low' | 'price-high' | 'size-large' | 'size-small' | 'trending' | 'featured' | 'best-match' | 'most-viewed'

export default function PropertiesPage () {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortBy>('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMap, setShowMap] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [savedSearchName, setSavedSearchName] = useState('')
  const [isBedroomBathroomModalOpen, setIsBedroomBathroomModalOpen] = useState(false)
  
  const [propertiesPerPage, setPropertiesPerPage] = useState(12)
  
  const [filters, setFilters] = useState({
    transactionType: '',
    propertyType: '',
    source: '',
    city: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    minSurface: undefined as number | undefined,
    maxSurface: undefined as number | undefined,
    rooms: undefined as number | undefined,
    sort: 'newest' as SortBy,
    q: '',
    agent: '',
    page: 1,
    limit: 12, // Nombre de propriétés par page
    // Nouveaux filtres avancés
    availability: '', // 'available', 'soon', 'leased'
    buildingClass: '', // 'A', 'B', 'C'
    parking: '',
    yearBuilt: {
      min: undefined as number | undefined,
      max: undefined as number | undefined
    },
    features: [] as string[], // 'elevator', 'parking', 'security', 'gym', etc.
    neighborhood: '',
    pricePerSqft: {
      min: undefined as number | undefined,
      max: undefined as number | undefined
    },
    distance: undefined as number | undefined, // en km depuis un point
    lastUpdated: '', // 'today', 'week', 'month'
    verified: false,
    featured: false,
    bedrooms: undefined as number | undefined,
    bathrooms: undefined as number | undefined,
    minYearBuilt: undefined as number | undefined,
    maxYearBuilt: undefined as number | undefined,
    condition: '',
    energyClass: '',
    floor: '',
    orientation: ''
  })

  // Données de filtres prédéfinis
  const quickFilters = [
    { label: 'Nouveautés', key: 'lastUpdated', value: 'today', icon: Calendar },
    { label: 'En vedette', key: 'featured', value: true, icon: Star },
    { label: 'Vérifiées', key: 'verified', value: true, icon: Eye },
    { label: 'Classe A', key: 'buildingClass', value: 'A', icon: Building2 },
    { label: 'Avec parking', key: 'parking', value: 1, icon: Car },
    { label: 'Tendances', key: 'sort', value: 'trending', icon: TrendingUp }
  ]

  const propertyTypes = [
    'Bureau', 'Commerce', 'Industriel', 'Entrepôt', 'Terrain', 'Mixte', 'Hôtel', 'Restaurant'
  ]

  const availabilityOptions = [
    { value: 'available', label: 'Disponible maintenant' },
    { value: 'soon', label: 'Bientôt disponible' },
    { value: 'leased', label: 'Récemment loué' }
  ]

  const buildingClasses = [
    { value: 'A', label: 'Classe A - Premium' },
    { value: 'B', label: 'Classe B - Standard' },
    { value: 'C', label: 'Classe C - Économique' }
  ]

  const features = [
    'Ascenseur', 'Parking', 'Sécurité 24h', 'Climatisation', 'Fibre optique',
    'Restaurant', 'Salle de sport', 'Terrasse', 'Vue mer', 'Transport public'
  ]

  // Initialiser les filtres depuis les paramètres URL
  useEffect(() => {
    const agentParam = searchParams.get('agent')
    if (agentParam) {
      setFilters(prev => ({ ...prev, agent: agentParam }))
    }
  }, [searchParams])

  const [viewedProperties, setViewedProperties] = useState(0)
  const { properties, loading, error, pagination } = useProperties(filters)
  const { can, limit, userRole } = usePermissions()
  const comparison = useComparison()

  const maxViewLimit = limit('maxPropertiesView')

  // Limiter les propriétés affichées selon les permissions
  const limitedProperties = maxViewLimit
    ? properties.slice(0, Math.max(0, maxViewLimit - viewedProperties))
    : properties

  const handleFilterChange = (key: string, value: any) => {
    // Convert string values to numbers for numeric filters
    let processedValue = value
    if (
      ['minPrice', 'maxPrice', 'minSurface', 'maxSurface', 'rooms', 'parking', 'distance'].includes(key)
    ) {
      processedValue =
        value === '' || value === null || value === undefined
          ? undefined
          : Number(value)
    }
    
    // Handle nested objects like yearBuilt and pricePerSqft
    if (key.includes('.')) {
      const [parent, child] = key.split('.')
      setFilters(prev => {
        const parentValue = prev[parent as keyof typeof prev]
        const parentObj = typeof parentValue === 'object' && parentValue !== null ? parentValue : {}
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: processedValue
          },
          page: 1
        }
      })
    } else if (key === 'features') {
      // Handle array values like features
      setFilters(prev => ({
        ...prev,
        features: prev.features.includes(value)
          ? prev.features.filter(f => f !== value)
          : [...prev.features, value],
        page: 1
      }))
    } else {
      setFilters(prev => ({ ...prev, [key]: processedValue, page: 1 }))
    }
  }

  const handleQuickFilter = (key: string, value: any) => {
    if (key === 'sort') {
      setSortBy(value)
      setFilters(prev => ({ ...prev, sort: value, page: 1 }))
    } else {
      handleFilterChange(key, value)
    }
  }

  const clearFilters = () => {
    setFilters({
      transactionType: '',
      propertyType: '',
      source: '',
      city: '',
      minPrice: undefined,
      maxPrice: undefined,
      minSurface: undefined,
      maxSurface: undefined,
      rooms: undefined,
      sort: 'newest',
      q: '',
      agent: '',
      page: 1,
      limit: 12,
      availability: '',
      buildingClass: '',
      parking: '',
      yearBuilt: { min: undefined, max: undefined },
      features: [],
      neighborhood: '',
      pricePerSqft: { min: undefined, max: undefined },
      distance: undefined,
      lastUpdated: '',
      verified: false,
      featured: false,
      bedrooms: undefined,
      bathrooms: undefined,
      minYearBuilt: undefined,
      maxYearBuilt: undefined,
      condition: '',
      energyClass: '',
      floor: '',
      orientation: ''
    })
    setSearchQuery('')
    setSortBy('newest')
  }

  const saveSearch = () => {
    if (savedSearchName.trim()) {
      // Logique pour sauvegarder la recherche
      console.log('Sauvegarde de la recherche:', { name: savedSearchName, filters })
      setSavedSearchName('')
    }
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  // Synchroniser le filtre limit avec propertiesPerPage
  useEffect(() => {
    setFilters(prev => ({ ...prev, limit: propertiesPerPage }))
  }, [propertiesPerPage])

  useEffect(() => {
    if (properties.length > 0) {
      setViewedProperties(prev => prev + properties.length)
    }
  }, [properties])

  if (loading) {
    return (
      <div className='container mx-auto py-8'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto py-8'>
        <div className='text-red-600 text-center p-4'>
          Erreur lors du chargement des propriétés: {error}
        </div>
      </div>
    )
  }

  const isAtViewLimit = maxViewLimit && viewedProperties >= maxViewLimit

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800'>
      <div className='container mx-auto py-6 px-4'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>
            <div>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                Propriétés Commerciales
              </h1>
              <div className='flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400'>
                <span className='flex items-center gap-1'>
                  <Building2 className='h-4 w-4' />
                  {limitedProperties.length} propriétés
                </span>
                {maxViewLimit && (
                  <span className='flex items-center gap-1'>
                    <Eye className='h-4 w-4' />
                    {viewedProperties}/{maxViewLimit} vues
                  </span>
                )}
                <Badge variant="secondary" className='text-xs'>
                  Vue {viewMode}
                </Badge>
              </div>
            </div>

            {/* Quick Actions */}
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-2 mr-4'>
                <Input
                  placeholder="Nom de la recherche..."
                  value={savedSearchName}
                  onChange={(e) => setSavedSearchName(e.target.value)}
                  className='w-40'
                />
                <Button 
                  onClick={saveSearch} 
                  size="sm" 
                  disabled={!savedSearchName.trim()}
                  className='bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                >
                  Sauvegarder
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className='flex items-center gap-2'
              >
                <X className='h-4 w-4' />
                Effacer
              </Button>
            </div>
          </div>

          {/* Alerte pour les utilisateurs non connectés */}
          {userRole === 'guest' && (
            <div className="mb-6 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Accès limité - Compte invité
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Créez un compte gratuit pour voir plus de propriétés et accéder à tous les filtres avancés.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search and Quick Filters */}
        <div className='mb-6 space-y-4'>
          {/* Enhanced Search Bar */}
          <div className='relative'>
            <div className='absolute left-3 top-1/2 transform -translate-y-1/2 z-10'>
              <Search className='h-5 w-5 text-slate-400' />
            </div>
            <Input
              placeholder="Rechercher par adresse, quartier, code postal..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                handleFilterChange('q', e.target.value)
              }}
              className='pl-10 h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
            />
          </div>

          {/* Quick Filters */}
          <div className='flex flex-wrap gap-2'>
            {quickFilters.map((filter) => {
              const IconComponent = filter.icon
              const isActive = filters[filter.key as keyof typeof filters] === filter.value ||
                               (filter.key === 'sort' && sortBy === filter.value)
              
              return (
                <Button
                  key={filter.label}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleQuickFilter(filter.key, filter.value)}
                  className={`flex items-center gap-2 transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <IconComponent className='h-4 w-4' />
                  {filter.label}
                </Button>
              )
            })}
          </div>
        </div>

        <div className='flex flex-col xl:flex-row gap-6'>
          {/* Enhanced Sidebar with Advanced Filters */}
          <div className='xl:w-80 space-y-6'>
            {/* Basic Filters */}
            <div className='bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2'>
                  <Filter className='h-5 w-5' />
                  Filtres principaux
                </h3>
              </div>

              <div className='space-y-4'>
                {/* Transaction Type */}
                <div>
                  <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                    Type de transaction
                  </label>
                  <Select value={filters.transactionType} onValueChange={(value) => handleFilterChange('transactionType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous types</SelectItem>
                      <SelectItem value="forLease">À louer</SelectItem>
                      <SelectItem value="forSale">À vendre</SelectItem>
                      <SelectItem value="sold">Vendu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Property Type */}
                <div>
                  <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
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
                <div>
                  <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                    Fourchette de prix
                  </label>
                  <div className='grid grid-cols-2 gap-2'>
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice || ''}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className='text-sm'
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className='text-sm'
                    />
                  </div>
                </div>

                {/* Surface Area */}
                <div>
                  <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                    Surface (m²)
                  </label>
                  <div className='grid grid-cols-2 gap-2'>
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minSurface || ''}
                      onChange={(e) => handleFilterChange('minSurface', e.target.value)}
                      className='text-sm'
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxSurface || ''}
                      onChange={(e) => handleFilterChange('maxSurface', e.target.value)}
                      className='text-sm'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className='bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2'>
                  <SlidersHorizontal className='h-5 w-5' />
                  Filtres avancés
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  {showAdvancedFilters ? 'Masquer' : 'Afficher'}
                </Button>
              </div>

              {showAdvancedFilters && (
                <div className='space-y-6'>
                  {/* Bedrooms & Bathrooms */}
                  <div>
                    <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                      Chambres et Salles de bain
                    </label>
                    <Button
                      variant="outline"
                      onClick={() => setIsBedroomBathroomModalOpen(true)}
                      className="w-full justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4" />
                        <Bath className="h-4 w-4" />
                        <span>
                          {filters.bedrooms || filters.bathrooms
                            ? `${filters.bedrooms ? `${filters.bedrooms} ch` : 'Toutes ch'}, ${filters.bathrooms ? `${filters.bathrooms} sdb` : 'Toutes sdb'}`
                            : 'Chambres & Salles de bain'
                          }
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Year Built Range */}
                  <div>
                    <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                      Année de construction
                    </label>
                    <div className='grid grid-cols-2 gap-2'>
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.minYearBuilt}
                        onChange={(e) => handleFilterChange('minYearBuilt', e.target.value)}
                        min="1800"
                        max="2024"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.maxYearBuilt}
                        onChange={(e) => handleFilterChange('maxYearBuilt', e.target.value)}
                        min="1800"
                        max="2024"
                      />
                    </div>
                  </div>

                  {/* Property Condition */}
                  <div>
                    <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                      État du bien
                    </label>
                    <Select value={filters.condition} onValueChange={(value) => handleFilterChange('condition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="new">Neuf</SelectItem>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Bon</SelectItem>
                        <SelectItem value="fair">Correct</SelectItem>
                        <SelectItem value="renovation">À rénover</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Energy Class */}
                  <div>
                    <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                      Classe énergétique
                    </label>
                    <Select value={filters.energyClass} onValueChange={(value) => handleFilterChange('energyClass', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">Toutes</SelectItem>
                          <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                        <SelectItem value="E">E</SelectItem>
                        <SelectItem value="F">F</SelectItem>
                        <SelectItem value="G">G</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Floor & Total Floors */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                        Étage
                      </label>
                      <Select value={filters.floor} onValueChange={(value) => handleFilterChange('floor', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="ground">Rez-de-chaussée</SelectItem>
                          <SelectItem value="1-3">1er-3ème</SelectItem>
                          <SelectItem value="4-6">4ème-6ème</SelectItem>
                          <SelectItem value="7+">7ème et plus</SelectItem>
                          <SelectItem value="top">Dernier étage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                        Orientation
                      </label>
                      <Select value={filters.orientation} onValueChange={(value) => handleFilterChange('orientation', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Toutes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes</SelectItem>
                          <SelectItem value="north">Nord</SelectItem>
                          <SelectItem value="south">Sud</SelectItem>
                          <SelectItem value="east">Est</SelectItem>
                          <SelectItem value="west">Ouest</SelectItem>
                          <SelectItem value="southeast">Sud-Est</SelectItem>
                          <SelectItem value="southwest">Sud-Ouest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Additional Features */}
                  <div>
                    <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3'>
                      Équipements supplémentaires
                    </label>
                    <div className='grid grid-cols-2 gap-3'>
                      {[
                        { key: 'furnished', label: 'Meublé' },
                        { key: 'elevator', label: 'Ascenseur' },
                        { key: 'balcony', label: 'Balcon' },
                        { key: 'terrace', label: 'Terrasse' },
                        { key: 'garden', label: 'Jardin' },
                        { key: 'pool', label: 'Piscine' },
                        { key: 'garage', label: 'Garage' },
                        { key: 'security', label: 'Sécurité' },
                        { key: 'airConditioning', label: 'Climatisation' },
                        { key: 'heating', label: 'Chauffage central' }
                      ].map(feature => (
                        <label key={feature.key} className='flex items-center space-x-2 text-sm cursor-pointer'>
                          <input
                            type="checkbox"
                            checked={filters[feature.key as keyof typeof filters] === 'true'}
                            onChange={(e) => handleFilterChange(feature.key, e.target.checked ? 'true' : '')}
                            className='rounded border-slate-300 text-blue-600 focus:ring-blue-500'
                          />
                          <span className='text-slate-700 dark:text-slate-300'>{feature.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                      Disponibilité
                    </label>
                    <Select value={filters.availability} onValueChange={(value) => handleFilterChange('availability', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">Toutes</SelectItem>
                          {availabilityOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Building Class */}
                  <div>
                    <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                      Classe de bâtiment
                    </label>
                    <Select value={filters.buildingClass} onValueChange={(value) => handleFilterChange('buildingClass', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">Toutes</SelectItem>
                          {buildingClasses.map(cls => (
                          <SelectItem key={cls.value} value={cls.value}>
                            {cls.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Parking */}
                  <div>
                    <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                      Places de parking
                    </label>
                    <Select value={filters.parking} onValueChange={(value) => handleFilterChange('parking', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Indifférent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Indifférent</SelectItem>
                        <SelectItem value="1+">1+</SelectItem>
                        <SelectItem value="2+">2+</SelectItem>
                        <SelectItem value="3+">3+</SelectItem>
                        <SelectItem value="4+">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {/* Usage Limit */}
            {maxViewLimit && (
              <UsageLimit
                limitType='maxPropertiesView'
                currentUsage={viewedProperties}
                label='Propriétés vues'
              />
            )}
          </div>

          {/* Main Content */}
          <div className='flex-1 space-y-6'>
            {/* Enhanced Toolbar */}
            <div className='bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4'>
              <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                {/* Results Info */}
                <div className='flex items-center gap-4'>
                  <div className='flex items-center gap-2'>
                    <Building2 className='h-5 w-5 text-slate-500' />
                    <span className='font-medium text-slate-900 dark:text-slate-100'>
                      {properties.length} propriété{properties.length > 1 ? 's' : ''}
                    </span>
                    <span className='text-sm text-slate-500'>trouvée{properties.length > 1 ? 's' : ''}</span>
                  </div>
                  
                  {filters.city && (
                    <Badge variant="secondary" className='flex items-center gap-1'>
                      <MapPin className='h-3 w-3' />
                      {filters.city}
                    </Badge>
                  )}
                  
                  {filters.propertyType && (
                    <Badge variant="secondary">
                      {filters.propertyType}
                    </Badge>
                  )}
                </div>

                {/* View Controls */}
                <div className='flex items-center gap-4'>
                  {/* Sort Dropdown */}
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-slate-600 dark:text-slate-400'>Trier par:</span>
                    <Select value={sortBy} onValueChange={(value: SortBy) => {
                      setSortBy(value)
                      handleFilterChange('sort', value)
                    }}>
                      <SelectTrigger className='w-40'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Plus récent</SelectItem>
                        <SelectItem value="oldest">Plus ancien</SelectItem>
                        <SelectItem value="price-low">Prix croissant</SelectItem>
                        <SelectItem value="price-high">Prix décroissant</SelectItem>
                        <SelectItem value="size-large">Surface décroissante</SelectItem>
                        <SelectItem value="size-small">Surface croissante</SelectItem>
                        <SelectItem value="trending">Tendances</SelectItem>
                        <SelectItem value="featured">En vedette</SelectItem>
                        <SelectItem value="best-match">Meilleure correspondance</SelectItem>
                        <SelectItem value="most-viewed">Plus consultés</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Propriétés par page */}
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-slate-600 dark:text-slate-400'>Par page:</span>
                    <Select 
                      value={propertiesPerPage.toString()} 
                      onValueChange={(value) => {
                        const newLimit = parseInt(value)
                        setPropertiesPerPage(newLimit)
                        setFilters(prev => ({ ...prev, limit: newLimit, page: 1 }))
                      }}
                    >
                      <SelectTrigger className='w-20'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="24">24</SelectItem>
                        <SelectItem value="48">48</SelectItem>
                        <SelectItem value="96">96</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* View Mode Selector */}
                  <div className='flex items-center border rounded-lg overflow-hidden'>
                    <Button
                      variant={viewMode === 'grid-1-col' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid-1-col')}
                      className='rounded-none px-3'
                      title="1 colonne"
                    >
                      <div className='w-4 h-4 flex flex-col gap-0.5'>
                        <div className='w-full h-full bg-current rounded-sm'></div>
                      </div>
                    </Button>
                    <Button
                      variant={viewMode === 'grid-2-col' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid-2-col')}
                      className='rounded-none px-3 border-l'
                      title="2 colonnes"
                    >
                      <div className='w-4 h-4 grid grid-cols-2 gap-0.5'>
                        <div className='bg-current rounded-sm'></div>
                        <div className='bg-current rounded-sm'></div>
                      </div>
                    </Button>
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className='rounded-none px-3 border-l'
                      title="3 colonnes"
                    >
                      <Grid3X3 className='h-4 w-4' />
                    </Button>
                    <Button
                      variant={viewMode === 'grid-4-col' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid-4-col')}
                      className='rounded-none px-3 border-l'
                      title="4 colonnes"
                    >
                      <div className='w-4 h-4 grid grid-cols-2 gap-0.5'>
                        <div className='bg-current rounded-sm'></div>
                        <div className='bg-current rounded-sm'></div>
                        <div className='bg-current rounded-sm'></div>
                        <div className='bg-current rounded-sm'></div>
                      </div>
                    </Button>
                    <Button
                      variant={viewMode === 'grid-large' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid-large')}
                      className='rounded-none px-3 border-l'
                      title="Vue large"
                    >
                      <LayoutGrid className='h-4 w-4' />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className='rounded-none px-3 border-l'
                      title="Liste"
                    >
                      <List className='h-4 w-4' />
                    </Button>
                    <Button
                      variant={viewMode === 'map' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('map')}
                      className='rounded-none px-3 border-l'
                      title="Carte"
                    >
                      <Map className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {limitedProperties.length === 0 && !isAtViewLimit ? (
              <div className='bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center'>
                <div className='max-w-md mx-auto'>
                  <div className='w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Search className='h-8 w-8 text-slate-400' />
                  </div>
                  <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2'>
                    Aucune propriété trouvée
                  </h3>
                  <p className='text-slate-600 dark:text-slate-400 mb-4'>
                    Essayez de modifier vos critères de recherche ou explorez d'autres options.
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Effacer tous les filtres
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Different View Modes - Optimized for Mobile */}
                {viewMode === 'grid-1-col' && (
                  <div className='grid grid-cols-1 gap-4 md:gap-6'>
                    {limitedProperties.map(property => (
                      <PropertyCard
                        key={property._id}
                        property={property}
                        onAddToComparison={comparison.addToComparison}
                        isInComparison={comparison.comparisonList.some(
                          (p: any) => p._id === property._id
                        )}
                      />
                    ))}
                  </div>
                )}

                {viewMode === 'grid-2-col' && (
                  <div className='grid grid-cols-2 gap-3 sm:gap-4 md:gap-6'>
                    {limitedProperties.map(property => (
                      <PropertyCard
                        key={property._id}
                        property={property}
                        onAddToComparison={comparison.addToComparison}
                        isInComparison={comparison.comparisonList.some(
                          (p: any) => p._id === property._id
                        )}
                        compact={false}
                      />
                    ))}
                  </div>
                )}

                {viewMode === 'grid' && (
                  <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6'>
                    {limitedProperties.map(property => (
                      <PropertyCard
                        key={property._id}
                        property={property}
                        onAddToComparison={comparison.addToComparison}
                        isInComparison={comparison.comparisonList.some(
                          (p: any) => p._id === property._id
                        )}
                        compact={false}
                      />
                    ))}
                  </div>
                )}

                {viewMode === 'grid-4-col' && (
                  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-6'>
                    {limitedProperties.map(property => (
                      <PropertyCard
                        key={property._id}
                        property={property}
                        onAddToComparison={comparison.addToComparison}
                        isInComparison={comparison.comparisonList.some(
                          (p: any) => p._id === property._id
                        )}
                        compact={true}
                      />
                    ))}
                  </div>
                )}

                {viewMode === 'grid-large' && (
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {limitedProperties.map(property => (
                      <div key={property._id} className='bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 group'>
                        <div className='relative h-64'>
                          <img
                            src={property.images?.[0]?.url || '/placeholder-property.jpg'}
                            alt={property.title}
                            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                          />
                          <div className='absolute top-4 left-4'>
                            <Badge className='bg-white/90 text-slate-900'>
                              {property.transactionType === 'rent' ? 'À louer' : 'À vendre'}
                            </Badge>
                          </div>
                          <div className='absolute top-4 right-4 flex gap-2'>
                            <Button size="sm" variant="secondary" className='h-8 w-8 p-0'>
                              <Heart className='h-4 w-4' />
                            </Button>
                            <Button size="sm" variant="secondary" className='h-8 w-8 p-0'>
                              <Share2 className='h-4 w-4' />
                            </Button>
                          </div>
                          <div className='absolute bottom-4 left-4'>
                            <div className='bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold'>
                              {property.price ? `${property.price.toLocaleString()}€` : 'Prix sur demande'}
                            </div>
                          </div>
                        </div>
                        <div className='p-6'>
                          <div className='flex items-start justify-between mb-3'>
                            <div>
                              <h3 className='font-semibold text-lg text-slate-900 dark:text-slate-100 mb-1'>
                                {property.title}
                              </h3>
                              <p className='text-slate-600 dark:text-slate-400 flex items-center gap-1'>
                                <MapPin className='h-4 w-4' />
                                {property.address}
                              </p>
                            </div>
                            <Badge variant="secondary">
                              {property.propertyType}
                            </Badge>
                          </div>
                          
                          <div className='grid grid-cols-3 gap-4 mb-4'>
                            <div className='text-center'>
                              <div className='flex items-center justify-center gap-1 text-slate-600 dark:text-slate-400'>
                                <SquareM className='h-4 w-4' />
                                <span className='text-sm'>{property.surface}m²</span>
                              </div>
                            </div>
                            {property.rooms && (
                              <div className='text-center'>
                                <div className='flex items-center justify-center gap-1 text-slate-600 dark:text-slate-400'>
                                  <Bed className='h-4 w-4' />
                                  <span className='text-sm'>{property.rooms}</span>
                                </div>
                              </div>
                            )}
                            {property.parking && (
                              <div className='text-center'>
                                <div className='flex items-center justify-center gap-1 text-slate-600 dark:text-slate-400'>
                                  <Car className='h-4 w-4' />
                                  <span className='text-sm'>{property.parking}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              {property.isFeatured && (
                                <Badge className='bg-yellow-100 text-yellow-800'>
                                  <Star className='h-3 w-3 mr-1' />
                                  Vedette
                                </Badge>
                              )}
                              {/* Verified badge removed - property doesn't have verified field */}
                              {false && (
                                <Badge className='bg-green-100 text-green-800'>
                                  Vérifié
                                </Badge>
                              )}
                            </div>
                            <Button 
                              onClick={() => comparison.addToComparison(property)}
                              variant="outline" 
                              size="sm"
                              disabled={comparison.comparisonList.some((p: any) => p._id === property._id)}
                            >
                              {comparison.comparisonList.some((p: any) => p._id === property._id) ? 'Ajouté' : 'Comparer'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {viewMode === 'list' && (
                  <div className='space-y-4'>
                    {limitedProperties.map(property => (
                      <div key={property._id} className='bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300'>
                        <div className='flex gap-6'>
                          <div className='w-48 h-32 flex-shrink-0'>
                            <img
                              src={property.images?.[0]?.url || '/placeholder-property.jpg'}
                              alt={property.title}
                              className='w-full h-full object-cover rounded-lg'
                            />
                          </div>
                          <div className='flex-1'>
                            <div className='flex items-start justify-between mb-3'>
                              <div>
                                <div className='flex items-center gap-3 mb-2'>
                                  <h3 className='font-semibold text-xl text-slate-900 dark:text-slate-100'>
                                    {property.title}
                                  </h3>
                                  <Badge variant="secondary">
                                    {property.propertyType}
                                  </Badge>
                                  {property.isFeatured && (
                                    <Badge className='bg-yellow-100 text-yellow-800'>
                                      <Star className='h-3 w-3 mr-1' />
                                      Vedette
                                    </Badge>
                                  )}
                                </div>
                                <p className='text-slate-600 dark:text-slate-400 flex items-center gap-1 mb-2'>
                                  <MapPin className='h-4 w-4' />
                                  {property.address}
                                </p>
                                <div className='text-2xl font-bold text-blue-600 mb-3'>
                                  {property.price ? `${property.price.toLocaleString()}€` : 'Prix sur demande'}
                                  {property.transactionType === 'rent' && <span className='text-sm font-normal text-slate-500'>/mois</span>}
                                </div>
                              </div>
                              <div className='flex gap-2'>
                                <Button size="sm" variant="outline">
                                  <Heart className='h-4 w-4' />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Share2 className='h-4 w-4' />
                                </Button>
                              </div>
                            </div>
                            
                            <div className='grid grid-cols-4 gap-6 mb-4'>
                              <div className='flex items-center gap-2'>
                                <SquareM className='h-4 w-4 text-slate-500' />
                                <span className='text-sm text-slate-600 dark:text-slate-400'>
                                  {property.surface}m²
                                </span>
                              </div>
                              {property.rooms && (
                                <div className='flex items-center gap-2'>
                                  <Bed className='h-4 w-4 text-slate-500' />
                                  <span className='text-sm text-slate-600 dark:text-slate-400'>
                                    {property.rooms} pièces
                                  </span>
                                </div>
                              )}
                              {property.parking && (
                                <div className='flex items-center gap-2'>
                                  <Car className='h-4 w-4 text-slate-500' />
                                  <span className='text-sm text-slate-600 dark:text-slate-400'>
                                    {property.parking} places
                                  </span>
                                </div>
                              )}
                              <div className='flex items-center gap-2'>
                                <Calendar className='h-4 w-4 text-slate-500' />
                                <span className='text-sm text-slate-600 dark:text-slate-400'>
                                  {property.yearBuilt || 'N/A'}
                                </span>
                              </div>
                            </div>

                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-2'>
                                <Badge className={`${
                                  property.transactionType === 'rent' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {property.transactionType === 'rent' ? 'À louer' : 'À vendre'}
                                </Badge>
                                {/* Verified badge removed - property doesn't have verified field */}
                                {false && (
                                  <Badge className='bg-green-100 text-green-800'>
                                    Vérifié
                                  </Badge>
                                )}
                              </div>
                              <div className='flex gap-2'>
                                <Button 
                                  onClick={() => comparison.addToComparison(property)}
                                  variant="outline" 
                                  size="sm"
                                  disabled={comparison.comparisonList.some((p: any) => p._id === property._id)}
                                >
                                  {comparison.comparisonList.some((p: any) => p._id === property._id) ? 'Ajouté' : 'Comparer'}
                                </Button>
                                <Button size="sm">
                                  Voir détails
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {viewMode === 'map' && (
                  <div className='bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6'>
                    <div className='h-96 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center'>
                      <div className='text-center'>
                        <Map className='h-12 w-12 text-slate-400 mx-auto mb-4' />
                        <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2'>
                          Vue cartographique
                        </h3>
                        <p className='text-slate-600 dark:text-slate-400'>
                          Intégration avec Google Maps à venir
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Limit Reached Message */}
                {isAtViewLimit && (
                  <div className='bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 text-center'>
                    <div className='max-w-md mx-auto'>
                      <div className='w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <Eye className='h-8 w-8 text-amber-600 dark:text-amber-400' />
                      </div>
                      <h3 className='text-xl font-semibold text-amber-900 dark:text-amber-100 mb-2'>
                        Limite de visualisation atteinte
                      </h3>
                      <p className='text-amber-700 dark:text-amber-300 mb-4'>
                        Vous avez atteint votre limite de visualisation de propriétés ({maxViewLimit}).
                      </p>
                      <Button className='bg-gradient-to-r from-blue-500 to-purple-600 text-white'>
                        Passer au plan Premium
                      </Button>
                    </div>
                  </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && !isAtViewLimit && (
                  <div className='flex justify-center pt-8'>
                    <CustomPagination
                      currentPage={filters.page}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Bedroom & Bathroom Modal */}
      <BedroomBathroomModal
        isOpen={isBedroomBathroomModalOpen}
        onClose={() => setIsBedroomBathroomModalOpen(false)}
        onApply={(bedrooms, bathrooms) => {
          setFilters(prev => ({
            ...prev,
            bedrooms: bedrooms || undefined,
            bathrooms: bathrooms || undefined
          }))
          setIsBedroomBathroomModalOpen(false)
        }}
        initialBedrooms={filters.bedrooms}
        initialBathrooms={filters.bathrooms}
      />
    </div>
  )
}