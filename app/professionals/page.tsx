'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useProfessionals } from '@/hooks/use-professionals'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, MapPin, Star, Phone, Mail, Building, Award, TrendingUp, Users, Filter, Sparkles, Eye } from 'lucide-react'
import { CustomPagination } from '@/components/custom-pagination'

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-r from-primary via-primary/90 to-primary/80 overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              rotate: [360, 180, 0]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-300/10 rounded-full blur-2xl"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center px-4 py-2 bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-full text-primary-foreground text-sm font-medium mb-6 border border-white/20 dark:border-white/10"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Plateforme Premium
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight"
            >
              Professionnels de l'Immobilier
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Commercial
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed"
            >
              Découvrez les meilleurs agents et courtiers certifiés pour vos projets immobiliers commerciaux. 
              Expertise garantie, résultats exceptionnels.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-primary-foreground/80"
            >
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                +500 Professionnels Certifiés
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                €2.5M+ Volume Moyen
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2" />
                4.8/5 Satisfaction Client
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border p-8 mb-8 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl opacity-30 -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/20 to-accent/10 rounded-full blur-2xl opacity-40 translate-y-12 -translate-x-12"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative z-10"
          >
            <div className="flex items-center mb-6">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-2 bg-gradient-to-r from-primary to-primary/80 rounded-lg mr-3"
              >
                <Filter className="h-5 w-5 text-primary-foreground" />
              </motion.div>
              <h2 className="text-xl font-semibold text-foreground">Filtres de Recherche</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative group"
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-hover:text-primary transition-colors" />
                <Input
                  placeholder="Rechercher par nom..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-12 h-12 border-2 border-border rounded-xl focus:border-primary focus:ring-primary/20 transition-all duration-200 bg-background/50"
                />
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }}>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
                  <Input
                    placeholder="Ville ou région"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="pl-12 h-12 border-2 border-border rounded-xl focus:border-primary focus:ring-primary/20 transition-all duration-200 bg-background/50"
                  />
                </div>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }}>
                <Select value={filters.specialty} onValueChange={(value) => handleFilterChange('specialty', value)}>
                  <SelectTrigger className="h-12 border-2 border-border rounded-xl focus:border-primary bg-background/50 hover:bg-background/70 transition-all duration-200">
                    <SelectValue placeholder="🏢 Spécialité" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2">
                    <SelectItem value="all">Toutes spécialités</SelectItem>
                    <SelectItem value="Office">🏢 Bureaux</SelectItem>
                    <SelectItem value="Retail">🛍️ Commerce</SelectItem>
                    <SelectItem value="Industrial">🏭 Industriel</SelectItem>
                    <SelectItem value="Warehouse">📦 Entrepôt</SelectItem>
                    <SelectItem value="Land">🌱 Terrain</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }}>
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger className="h-12 border-2 border-border rounded-xl focus:border-primary bg-background/50 hover:bg-background/70 transition-all duration-200">
                    <SelectValue placeholder="📊 Trier par" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2">
                    <SelectItem value="rating">⭐ Note</SelectItem>
                    <SelectItem value="experience">🎯 Expérience</SelectItem>
                    <SelectItem value="transactions">📈 Transactions</SelectItem>
                    <SelectItem value="volume">💎 Volume d'affaires</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  <Search className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Rechercher
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-muted to-muted/80 rounded-xl border border-border"
              >
                <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></div>
                <p className="text-sm font-medium text-foreground">
                  {total} professionnel{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col justify-center items-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="relative mb-6"
            >
              <div className="w-16 h-16 border-4 border-muted rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">Recherche en cours...</h3>
              <p className="text-muted-foreground">Nous trouvons les meilleurs professionnels pour vous</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex space-x-1 mt-4"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 bg-primary rounded-full"
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative inline-block mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-pink-100 rounded-full blur-xl opacity-50"></div>
              <div className="relative bg-gradient-to-r from-red-500 to-pink-600 p-6 rounded-full">
                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </motion.div>
            
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-2xl font-bold text-foreground mb-3"
            >
              Oups ! Une erreur s'est produite
            </motion.h3>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6 max-w-md mx-auto"
            >
              <p className="text-destructive font-medium">{error}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Réessayer
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Professionals Grid */}
        {!loading && !error && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
            >
              <AnimatePresence>
                {professionals.map((professional, index) => (
                  <motion.div
                    key={professional._id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.2 }
                    }}
                    className="group"
                  >
                    <Card className="h-full bg-card/70 backdrop-blur-sm border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <CardHeader className="pb-4 relative z-10">
                        <div className="flex items-start space-x-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Avatar className="w-16 h-16 ring-2 ring-white shadow-lg">
                              <AvatarImage src={professional.image} alt={professional.name} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                                {getInitials(professional.name)}
                              </AvatarFallback>
                            </Avatar>
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                                {professional.name}
                              </h3>
                              {professional.isVerified && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.3 + index * 0.1 }}
                                >
                                  <Badge className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm">
                                    <Award className="h-3 w-3 mr-1" />
                                    Vérifié
                                  </Badge>
                                </motion.div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{professional.title}</p>
                            <p className="text-sm font-medium text-primary flex items-center">
                              <Building className="h-3 w-3 mr-1" />
                              {professional.company}
                            </p>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0 relative z-10">
                        {/* Rating and Reviews */}
                        <div className="flex items-center justify-between mb-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < Math.floor(professional.rating) 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-muted-foreground/30'
                                  }`} 
                                />
                              ))}
                            </div>
                            <span className="font-semibold text-foreground">{professional.rating}</span>
                            <span className="text-muted-foreground text-sm">({professional.reviews} avis)</span>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center text-sm text-muted-foreground mb-3 bg-muted/50 rounded-lg p-2">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          {professional.location.city}, {professional.location.state}
                        </div>

                        {/* Specialties */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {professional.specialties.slice(0, 3).map((specialty, specIndex) => (
                              <motion.div
                                key={specialty}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + specIndex * 0.1 }}
                              >
                                <Badge variant="outline" className="text-xs bg-card/80 border-primary/30 text-primary hover:bg-primary/10 transition-colors">
                                  {specialty}
                                </Badge>
                              </motion.div>
                            ))}
                            {professional.specialties.length > 3 && (
                              <Badge variant="outline" className="text-xs bg-gradient-to-r from-secondary/50 to-secondary/30 border-secondary/50 text-secondary-foreground">
                                +{professional.specialties.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4">
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="text-center"
                          >
                            <div className="font-bold text-primary text-lg">{professional.yearsExperience}</div>
                            <div className="text-muted-foreground text-xs font-medium">Années d'exp.</div>
                          </motion.div>
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="text-center"
                          >
                            <div className="font-bold text-green-600 text-lg">{professional.totalTransactions}</div>
                            <div className="text-muted-foreground text-xs font-medium">Transactions</div>
                          </motion.div>
                        </div>

                        {/* Volume */}
                        {professional.totalVolume > 0 && (
                          <div className="flex items-center text-sm text-muted-foreground mb-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg p-3">
                            <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                            <span className="font-semibold">Volume: {formatCurrency(professional.totalVolume)}</span>
                          </div>
                        )}

                        {/* Bio */}
                        {professional.bio && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 bg-muted/30 rounded-lg p-3 italic">
                            "{professional.bio}"
                          </p>
                        )}

                        {/* Contact Buttons */}
                        <div className="space-y-3 pt-4">
                          {/* Voir le profil - bouton principal */}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link href={`/agents/${professional._id}`} className="block w-full">
                              <Button 
                                size="sm" 
                                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Voir le profil
                              </Button>
                            </Link>
                          </motion.div>
                          
                          {/* Boutons de contact */}
                          <div className="flex space-x-3">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex-1"
                            >
                              <Button 
                                size="sm" 
                                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                                onClick={() => window.open(`tel:${professional.phone}`)}
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Appeler
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex-1"
                            >
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full border-2 border-border hover:border-primary/50 hover:bg-primary/10 transition-all duration-200"
                                onClick={() => window.open(`mailto:${professional.email}`)}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Email
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {professionals.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-16"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative inline-block mb-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-xl opacity-50"></div>
                  <div className="relative bg-gradient-to-r from-primary to-primary/80 p-6 rounded-full">
                    <Users className="h-12 w-12 text-primary-foreground" />
                  </div>
                </motion.div>
                
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-2xl font-bold text-foreground mb-3"
                >
                  Aucun professionnel trouvé
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-muted-foreground text-lg mb-6"
                >
                  Essayez de modifier vos critères de recherche pour découvrir nos professionnels.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mb-6"
                >
                  <div className="flex items-center px-4 py-2 bg-primary/10 rounded-full">
                    <Search className="h-4 w-4 mr-2 text-primary" />
                    Élargissez votre recherche
                  </div>
                  <div className="flex items-center px-4 py-2 bg-green-500/10 rounded-full">
                    <MapPin className="h-4 w-4 mr-2 text-green-500" />
                    Changez de localisation
                  </div>
                  <div className="flex items-center px-4 py-2 bg-secondary/20 rounded-full">
                    <Building className="h-4 w-4 mr-2 text-secondary-foreground" />
                    Modifiez la spécialité
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <Button 
                    onClick={() => {
                      setFilters({ search: '', specialty: 'all', location: '', sortBy: 'rating' })
                      setCurrentPage(1)
                    }}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Réinitialiser les filtres
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex justify-center mt-12"
              >
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-4">
                  <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProfessionalsPage
