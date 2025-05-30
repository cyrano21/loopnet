'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Filter, XIcon, ChevronDown, Search, Users } from 'lucide-react'

interface PropertyFiltersProps {
  onFilterChange: (key: string, value: any) => void
}

export function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const [filters, setFilters] = useState({
    transactionType: 'all',
    propertyType: 'all',
    source: 'all',
    agent: 'all',
    city: '',
    minPrice: '',
    maxPrice: '',
    minSurface: '',
    maxSurface: '',
    rooms: '',
    sort: 'newest'
  })

  const [agents, setAgents] = useState<Array<{ _id: string; name: string; company: string }>>([])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    // Convert 'all' back to empty string for the parent component
    const processedValue = value === 'all' ? '' : value
    onFilterChange(key, processedValue)
  }

  // Charger la liste des agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/professionals?limit=100')
        if (response.ok) {
          const data = await response.json()
          setAgents(data.professionals || [])
        }
      } catch (error) {
        console.error('Erreur lors du chargement des agents:', error)
      }
    }
    fetchAgents()
  }, [])

  const clearFilters = () => {
    const clearedFilters = {
      transactionType: 'all',
      propertyType: 'all',
      source: 'all',
      agent: 'all',
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"
          animate={{
            background: [
              'linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(168, 85, 247, 0.05))',
              'linear-gradient(to right, rgba(168, 85, 247, 0.05), rgba(59, 130, 246, 0.05))',
              'linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(168, 85, 247, 0.05))'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <CardHeader className="relative">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="h-4 w-4" />
            </motion.div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Filtres de Recherche
            </CardTitle>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-6 relative">
        {/* Type de transaction */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <Label htmlFor="transactionType" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Type de transaction
          </Label>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Select
              value={filters.transactionType}
              onValueChange={(value) => handleFilterChange('transactionType', value)}
            >
              <SelectTrigger className="border-2 border-gray-200 hover:border-blue-300 transition-colors duration-200 bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="sale">Vente</SelectItem>
                <SelectItem value="rent">Location</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </motion.div>

        {/* Type de propriété */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <Label htmlFor="propertyType" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            Type de propriété
          </Label>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Select
              value={filters.propertyType}
              onValueChange={(value) => handleFilterChange('propertyType', value)}
            >
              <SelectTrigger className="border-2 border-gray-200 hover:border-green-300 transition-colors duration-200 bg-white/80 backdrop-blur-sm">
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
          </motion.div>
        </motion.div>

        {/* Source des données */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 }}
          className="space-y-2"
        >
          <Label htmlFor="source" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.75 }}
            />
            Source des données
          </Label>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Select
              value={filters.source}
              onValueChange={(value) => handleFilterChange('source', value)}
            >
              <SelectTrigger className="border-2 border-gray-200 hover:border-cyan-300 transition-colors duration-200 bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="Toutes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sources</SelectItem>
                <SelectItem value="scraped">Propriétés scrapées</SelectItem>
                <SelectItem value="manual">Saisie manuelle</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </motion.div>

        {/* Agent/Professionnel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.47 }}
          className="space-y-2"
        >
          <Label htmlFor="agent" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
            />
            Agent/Professionnel
          </Label>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Select
              value={filters.agent}
              onValueChange={(value) => handleFilterChange('agent', value)}
            >
              <SelectTrigger className="border-2 border-gray-200 hover:border-indigo-300 transition-colors duration-200 bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="Tous les agents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les agents</SelectItem>
                {agents.map((agent) => (
                  <SelectItem key={agent._id} value={agent._id}>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-indigo-500" />
                      <span className="font-medium">{agent.name}</span>
                      {agent.company && (
                        <span className="text-xs text-gray-500">({agent.company})</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        </motion.div>

        {/* Ville */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <Label htmlFor="city" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            Ville
          </Label>
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="city"
              placeholder="Entrez une ville"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="pl-10 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-colors duration-200 bg-white/80 backdrop-blur-sm"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </motion.div>

        {/* Prix */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-2"
        >
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            />
            Prix (€)
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Input
                placeholder="Min"
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="border-2 border-gray-200 hover:border-yellow-300 focus:border-yellow-500 transition-colors duration-200 bg-white/80 backdrop-blur-sm"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Input
                placeholder="Max"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 transition-colors duration-200 bg-white/80 backdrop-blur-sm"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Surface */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-2"
        >
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 2 }}
            />
            Surface (m²)
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Input
                placeholder="Min"
                type="number"
                value={filters.minSurface}
                onChange={(e) => handleFilterChange('minSurface', e.target.value)}
                className="border-2 border-gray-200 hover:border-teal-300 focus:border-teal-500 transition-colors duration-200 bg-white/80 backdrop-blur-sm"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Input
                placeholder="Max"
                type="number"
                value={filters.maxSurface}
                onChange={(e) => handleFilterChange('maxSurface', e.target.value)}
                className="border-2 border-gray-200 hover:border-cyan-300 focus:border-cyan-500 transition-colors duration-200 bg-white/80 backdrop-blur-sm"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Nombre de pièces */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="space-y-2"
        >
          <Label htmlFor="rooms" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 2.5 }}
            />
            Nombre de pièces
          </Label>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Input
              id="rooms"
              placeholder="Nombre de pièces"
              type="number"
              value={filters.rooms}
              onChange={(e) => handleFilterChange('rooms', e.target.value)}
              className="border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 transition-colors duration-200 bg-white/80 backdrop-blur-sm"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </motion.div>

        {/* Tri */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
          className="space-y-2"
        >
          <Label htmlFor="sort" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 3 }}
            />
            Trier par
          </Label>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Select
              value={filters.sort}
              onValueChange={(value) => handleFilterChange('sort', value)}
            >
              <SelectTrigger className="border-2 border-gray-200 hover:border-rose-300 transition-colors duration-200 bg-white/80 backdrop-blur-sm">
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
          </motion.div>
        </motion.div>

        {/* Bouton pour effacer les filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative"
          >
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full relative overflow-hidden border-2 border-gray-300 hover:border-red-400 bg-white/80 backdrop-blur-sm text-gray-700 hover:text-red-600 transition-all duration-300 group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              <span className="relative flex items-center gap-2">
                <XIcon className="h-4 w-4" />
                Effacer les filtres
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
    </motion.div>
  )
}