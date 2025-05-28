'use client'

import { useState } from 'react'
import { useProfessionals } from '@/hooks/use-professionals'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, MapPin, Star, Phone, Mail, Building, Award, TrendingUp, Users } from 'lucide-react'
import { Pagination } from '@/components/ui/pagination'

interface SearchFilters {
  search: string
  specialty: string
  location: string
  sortBy: string
}

const ProfessionalsPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    specialty: 'all',
    location: '',
    sortBy: 'rating'
  })

  const { professionals, loading, error, total, totalPages } = useProfessionals({
    ...filters,
    page: currentPage
  })

  const handleSearch = () => {
    setCurrentPage(1)
  }

  const handleFilterChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
    setCurrentPage(1)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Professionnels de l'Immobilier Commercial
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trouvez les meilleurs agents et courtiers pour vos projets immobiliers commerciaux
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par nom, entreprise..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Ville ou région"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Specialty */}
              <div>
                <Select value={filters.specialty} onValueChange={(value) => handleFilterChange('specialty', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Spécialité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes spécialités</SelectItem>
                    <SelectItem value="Office">Bureaux</SelectItem>
                    <SelectItem value="Retail">Commerce</SelectItem>
                    <SelectItem value="Industrial">Industriel</SelectItem>
                    <SelectItem value="Warehouse">Entrepôt</SelectItem>
                    <SelectItem value="Land">Terrain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div>
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Note</SelectItem>
                    <SelectItem value="experience">Expérience</SelectItem>
                    <SelectItem value="transactions">Transactions</SelectItem>
                    <SelectItem value="volume">Volume d'affaires</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
              <p className="text-sm text-gray-600">
                {total} professionnel{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <p className="text-red-600">Erreur lors du chargement des professionnels: {error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="mt-4"
              >
                Réessayer
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Professionals Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {professionals.map((professional) => (
                <Card key={professional._id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={professional.image} alt={professional.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                          {getInitials(professional.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-lg text-gray-900 truncate">
                            {professional.name}
                          </h3>
                          {professional.isVerified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <Award className="h-3 w-3 mr-1" />
                              Vérifié
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{professional.title}</p>
                        <p className="text-sm font-medium text-blue-600">{professional.company}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Rating and Reviews */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{professional.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({professional.reviews} avis)</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      {professional.location.city}, {professional.location.state}
                    </div>

                    {/* Specialties */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {professional.specialties.slice(0, 3).map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {professional.specialties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{professional.specialties.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-semibold text-gray-900">{professional.yearsExperience}</div>
                        <div className="text-gray-600">Années d'exp.</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-semibold text-gray-900">{professional.totalTransactions}</div>
                        <div className="text-gray-600">Transactions</div>
                      </div>
                    </div>

                    {/* Volume */}
                    {professional.totalVolume > 0 && (
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Volume: {formatCurrency(professional.totalVolume)}
                      </div>
                    )}

                    {/* Bio */}
                    {professional.bio && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {professional.bio}
                      </p>
                    )}

                    {/* Contact Buttons */}
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => window.open(`tel:${professional.phone}`)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Appeler
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.open(`mailto:${professional.email}`)}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {professionals.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun professionnel trouvé
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Essayez de modifier vos critères de recherche
                  </p>
                  <Button 
                    onClick={() => {
                      setFilters({ search: '', specialty: 'all', location: '', sortBy: 'rating' })
                      setCurrentPage(1)
                    }}
                    variant="outline"
                  >
                    Réinitialiser les filtres
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProfessionalsPage
