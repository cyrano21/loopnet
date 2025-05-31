'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  MapPin, 
  Star, 
  Building2, 
  Users, 
  TrendingUp,
  Award,
  Phone,
  Mail,
  Globe,
  Filter,
  Grid3X3,
  List,
  SortAsc
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useProfessionals } from '@/hooks/use-professionals'

export default function AgentsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState({
    specialty: 'all',
    location: 'all',
    sortBy: 'rating',
    search: ''
  })

  const { professionals, loading, error, total } = useProfessionals(filters)

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const specialties = [
    'Commercial Real Estate',
    'Office Buildings',
    'Retail Properties',
    'Industrial Properties',
    'Investment Properties',
    'Land Development',
    'Hospitality',
    'Healthcare Real Estate'
  ]

  const locations = [
    'Paris',
    'Lyon',
    'Marseille',
    'Toulouse',
    'Nice',
    'Nantes',
    'Bordeaux',
    'Lille'
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600">Erreur: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Trouvez le Bon Agent Immobilier
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Connectez-vous avec des professionnels de l'immobilier commercial expérimentés et certifiés
            </p>
            <div className="bg-white rounded-lg p-2 max-w-2xl mx-auto">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom, entreprise ou ville..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10 border-0 text-gray-900"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres de Recherche
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {total} agent{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
                  </span>
                  <Separator orientation="vertical" className="h-6" />
                  <div className="flex gap-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Spécialité
                  </label>
                  <Select value={filters.specialty} onValueChange={(value) => handleFilterChange('specialty', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les spécialités" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les spécialités</SelectItem>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Localisation
                  </label>
                  <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les villes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les villes</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Trier par
                  </label>
                  <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Note</SelectItem>
                      <SelectItem value="experience">Expérience</SelectItem>
                      <SelectItem value="transactions">Transactions</SelectItem>
                      <SelectItem value="volume">Volume</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setFilters({ specialty: 'all', location: 'all', sortBy: 'rating', search: '' })}
                  >
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Agents Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {professionals.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun agent trouvé</h3>
                <p className="text-gray-600">
                  Essayez de modifier vos critères de recherche ou de supprimer certains filtres.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
              {professionals.map((agent, index) => (
                <motion.div
                  key={agent._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {viewMode === 'grid' ? (
                    <AgentCard agent={agent} />
                  ) : (
                    <AgentListItem agent={agent} />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

interface AgentCardProps {
  agent: any
}

function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative">
        <div className="aspect-[4/3] relative overflow-hidden">
          <Image
            src={agent.image || '/placeholder.svg?height=300&width=400'}
            alt={agent.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        {agent.isVerified && (
          <Badge className="absolute top-3 right-3 bg-green-600">
            <Award className="h-3 w-3 mr-1" />
            Vérifié
          </Badge>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-1 group-hover:text-blue-600 transition-colors">
            <Link href={`/agents/${agent._id}`}>
              {agent.name}
            </Link>
          </h3>
          <p className="text-blue-600 font-medium">{agent.title}</p>
          <p className="text-gray-600">{agent.company}</p>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{agent.rating}</span>
            <span className="text-gray-600 text-sm">({agent.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{agent.location.city}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <span className="text-gray-600">Expérience:</span>
            <span className="font-medium ml-1">{agent.yearsExperience} ans</span>
          </div>
          <div>
            <span className="text-gray-600">Transactions:</span>
            <span className="font-medium ml-1">{agent.totalTransactions}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-6">
          {agent.specialties.slice(0, 2).map((specialty: string) => (
            <Badge key={specialty} variant="secondary" className="text-xs">
              {specialty}
            </Badge>
          ))}
          {agent.specialties.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{agent.specialties.length - 2}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/agents/${agent._id}`}>
              Voir le profil
            </Link>
          </Button>
          <Button variant="outline" size="icon">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function AgentListItem({ agent }: AgentCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 group">
      <CardContent className="p-6">
        <div className="flex gap-6">
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={agent.image || '/placeholder.svg?height=100&width=100'}
              alt={agent.name}
              fill
              className="object-cover rounded-lg"
              sizes="100px"
            />
            {agent.isVerified && (
              <Badge className="absolute -top-2 -right-2 bg-green-600 text-xs p-1">
                <Award className="h-3 w-3" />
              </Badge>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1 group-hover:text-blue-600 transition-colors">
                  <Link href={`/agents/${agent._id}`}>
                    {agent.name}
                  </Link>
                </h3>
                <p className="text-blue-600 font-medium">{agent.title}</p>
                <p className="text-gray-600 mb-2">{agent.company}</p>
                
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{agent.rating}</span>
                    <span className="text-gray-600 text-sm">({agent.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{agent.location.city}</span>
                  </div>
                  <div className="text-gray-600 text-sm">
                    {agent.yearsExperience} ans d'expérience
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {agent.specialties.slice(0, 3).map((specialty: string) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {agent.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{agent.specialties.length - 3}
                    </Badge>
                  )}
                </div>
                
                {agent.bio && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {agent.bio}
                  </p>
                )}
              </div>
              
              <div className="flex flex-col gap-2 md:items-end">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="text-center">
                    <div className="font-bold text-lg">{agent.totalTransactions}</div>
                    <div className="text-gray-600">Transactions</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">
                      {agent.totalVolume ? `€${(agent.totalVolume / 1000000).toFixed(1)}M` : 'N/A'}
                    </div>
                    <div className="text-gray-600">Volume</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button asChild>
                    <Link href={`/agents/${agent._id}`}>
                      Voir le profil
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
