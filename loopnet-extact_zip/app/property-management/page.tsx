"use client"

import { useState } from "react"
import { Building2, Plus, MapPin, Phone, Mail, Edit, Trash2, Eye, Upload } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

export default function PropertyManagementPage() {
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: "Bureau moderne centre-ville",
      address: "123 Rue de la République, Lyon 69002",
      price: 2500000,
      priceType: "sale", // sale, rent, vacation
      pricePerSqft: 4500,
      sqft: 556,
      type: "Bureau",
      category: "commercial", // commercial, residential, vacation
      status: "available", // available, rented, sold, pending
      images: ["/placeholder.svg?height=300&width=400"],
      description: "Magnifique bureau en centre-ville avec vue panoramique...",
      features: ["Climatisation", "Parking", "Ascenseur", "Sécurité 24h"],
      yearBuilt: 2020,
      agent: "John Smith",
      contact: {
        phone: "+33 6 12 34 56 78",
        email: "john@realestate.fr",
      },
      availability: "Immédiate",
      virtualTour: null,
      documents: [],
    },
    {
      id: 2,
      title: "Appartement de luxe",
      address: "45 Avenue des Champs, Paris 75008",
      price: 3500,
      priceType: "rent",
      pricePerSqft: 35,
      sqft: 100,
      type: "Appartement",
      category: "residential",
      status: "available",
      images: ["/placeholder.svg?height=300&width=400"],
      description: "Superbe appartement 3 pièces dans le 8ème arrondissement...",
      features: ["Balcon", "Cave", "Gardien", "Proche métro"],
      yearBuilt: 1900,
      agent: "Marie Dubois",
      contact: {
        phone: "+33 6 98 76 54 32",
        email: "marie@paris-immo.fr",
      },
      availability: "1er Mars 2024",
    },
    {
      id: 3,
      title: "Villa avec piscine - Location vacances",
      address: "Chemin des Oliviers, Cannes 06400",
      price: 450,
      priceType: "vacation",
      pricePerSqft: 15,
      sqft: 30,
      type: "Villa",
      category: "vacation",
      status: "available",
      images: ["/placeholder.svg?height=300&width=400"],
      description: "Villa de charme avec piscine privée, idéale pour vacances...",
      features: ["Piscine", "Jardin", "BBQ", "Wifi", "Climatisation"],
      yearBuilt: 2015,
      agent: "Pierre Martin",
      contact: {
        phone: "+33 6 11 22 33 44",
        email: "pierre@riviera-vacances.fr",
      },
      availability: "Été 2024",
    },
  ])

  const [newProperty, setNewProperty] = useState({
    title: "",
    address: "",
    price: "",
    priceType: "sale",
    sqft: "",
    type: "",
    category: "commercial",
    description: "",
    features: [],
    yearBuilt: "",
    images: [],
    contact: {
      phone: "",
      email: "",
    },
  })

  const [filters, setFilters] = useState({
    category: "all",
    priceType: "all",
    type: "all",
    priceMin: "",
    priceMax: "",
    location: "",
  })

  const propertyTypes = {
    commercial: ["Bureau", "Commerce", "Entrepôt", "Local commercial", "Immeuble"],
    residential: ["Appartement", "Maison", "Studio", "Duplex", "Penthouse"],
    vacation: ["Villa", "Appartement", "Chalet", "Maison", "Studio"],
  }

  const filteredProperties = properties.filter((property) => {
    if (filters.category !== "all" && property.category !== filters.category) return false
    if (filters.priceType !== "all" && property.priceType !== filters.priceType) return false
    if (filters.type !== "all" && property.type !== filters.type) return false
    if (filters.location && !property.address.toLowerCase().includes(filters.location.toLowerCase())) return false
    if (filters.priceMin && property.price < Number.parseInt(filters.priceMin)) return false
    if (filters.priceMax && property.price > Number.parseInt(filters.priceMax)) return false
    return true
  })

  const handleAddProperty = () => {
    const property = {
      ...newProperty,
      id: Date.now(),
      price: Number.parseInt(newProperty.price),
      sqft: Number.parseInt(newProperty.sqft),
      yearBuilt: Number.parseInt(newProperty.yearBuilt),
      status: "available",
      agent: "Agent Connecté", // À remplacer par l'agent connecté
      images: ["/placeholder.svg?height=300&width=400"],
      features: newProperty.features.filter((f) => f.trim() !== ""),
    }
    setProperties([...properties, property])
    setNewProperty({
      title: "",
      address: "",
      price: "",
      priceType: "sale",
      sqft: "",
      type: "",
      category: "commercial",
      description: "",
      features: [],
      yearBuilt: "",
      images: [],
      contact: { phone: "", email: "" },
    })
  }

  const getPriceDisplay = (property) => {
    switch (property.priceType) {
      case "sale":
        return `${property.price.toLocaleString()} €`
      case "rent":
        return `${property.price.toLocaleString()} €/mois`
      case "vacation":
        return `${property.price.toLocaleString()} €/nuit`
      default:
        return `${property.price.toLocaleString()} €`
    }
  }

  const getCategoryLabel = (category) => {
    switch (category) {
      case "commercial":
        return "Commercial"
      case "residential":
        return "Résidentiel"
      case "vacation":
        return "Vacances"
      default:
        return category
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "rented":
        return "bg-blue-100 text-blue-800"
      case "sold":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "available":
        return "Disponible"
      case "rented":
        return "Loué"
      case "sold":
        return "Vendu"
      case "pending":
        return "En cours"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">LoopNet</span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/property-management" className="text-blue-600 font-medium">
                  Gestion Propriétés
                </Link>
                <Link href="/agent-dashboard" className="text-gray-700 hover:text-blue-600">
                  Dashboard Agent
                </Link>
                <Link href="/leads" className="text-gray-700 hover:text-blue-600">
                  Leads
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter Propriété
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Ajouter une nouvelle propriété</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Titre de l'annonce</Label>
                        <Input
                          id="title"
                          value={newProperty.title}
                          onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
                          placeholder="Ex: Bureau moderne centre-ville"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Catégorie</Label>
                        <Select
                          value={newProperty.category}
                          onValueChange={(value) => setNewProperty({ ...newProperty, category: value, type: "" })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="commercial">Commercial</SelectItem>
                            <SelectItem value="residential">Résidentiel</SelectItem>
                            <SelectItem value="vacation">Vacances</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Adresse complète</Label>
                      <Input
                        id="address"
                        value={newProperty.address}
                        onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                        placeholder="123 Rue de la République, Lyon 69002"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="type">Type de bien</Label>
                        <Select
                          value={newProperty.type}
                          onValueChange={(value) => setNewProperty({ ...newProperty, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner..." />
                          </SelectTrigger>
                          <SelectContent>
                            {propertyTypes[newProperty.category]?.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="priceType">Type de prix</Label>
                        <Select
                          value={newProperty.priceType}
                          onValueChange={(value) => setNewProperty({ ...newProperty, priceType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sale">Vente</SelectItem>
                            <SelectItem value="rent">Location</SelectItem>
                            <SelectItem value="vacation">Location vacances</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="price">
                          Prix (
                          {newProperty.priceType === "sale"
                            ? "€"
                            : newProperty.priceType === "rent"
                              ? "€/mois"
                              : "€/nuit"}
                          )
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          value={newProperty.price}
                          onChange={(e) => setNewProperty({ ...newProperty, price: e.target.value })}
                          placeholder="2500000"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sqft">Surface (m²)</Label>
                        <Input
                          id="sqft"
                          type="number"
                          value={newProperty.sqft}
                          onChange={(e) => setNewProperty({ ...newProperty, sqft: e.target.value })}
                          placeholder="100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="yearBuilt">Année de construction</Label>
                        <Input
                          id="yearBuilt"
                          type="number"
                          value={newProperty.yearBuilt}
                          onChange={(e) => setNewProperty({ ...newProperty, yearBuilt: e.target.value })}
                          placeholder="2020"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProperty.description}
                        onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                        placeholder="Description détaillée du bien..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Téléphone de contact</Label>
                        <Input
                          id="phone"
                          value={newProperty.contact.phone}
                          onChange={(e) =>
                            setNewProperty({
                              ...newProperty,
                              contact: { ...newProperty.contact, phone: e.target.value },
                            })
                          }
                          placeholder="+33 6 12 34 56 78"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email de contact</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newProperty.contact.email}
                          onChange={(e) =>
                            setNewProperty({
                              ...newProperty,
                              contact: { ...newProperty.contact, email: e.target.value },
                            })
                          }
                          placeholder="contact@agence.fr"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Équipements et caractéristiques</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {[
                          "Climatisation",
                          "Parking",
                          "Ascenseur",
                          "Sécurité 24h",
                          "Balcon",
                          "Terrasse",
                          "Cave",
                          "Piscine",
                          "Jardin",
                          "Wifi",
                        ].map((feature) => (
                          <div key={feature} className="flex items-center space-x-2">
                            <Checkbox
                              id={feature}
                              checked={newProperty.features.includes(feature)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewProperty({
                                    ...newProperty,
                                    features: [...newProperty.features, feature],
                                  })
                                } else {
                                  setNewProperty({
                                    ...newProperty,
                                    features: newProperty.features.filter((f) => f !== feature),
                                  })
                                }
                              }}
                            />
                            <Label htmlFor={feature} className="text-sm">
                              {feature}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Glissez vos photos ici ou cliquez pour sélectionner</p>
                      <p className="text-sm text-gray-500">PNG, JPG jusqu'à 10MB</p>
                    </div>

                    <Button onClick={handleAddProperty} className="w-full">
                      Publier la propriété
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Propriétés</h1>
            <p className="text-gray-600">Gérez vos biens immobiliers : commercial, résidentiel et vacances</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{filteredProperties.length}</p>
            <p className="text-sm text-gray-600">propriétés disponibles</p>
          </div>
        </div>

        {/* Filtres */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <Label>Catégorie</Label>
                <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="residential">Résidentiel</SelectItem>
                    <SelectItem value="vacation">Vacances</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Transaction</Label>
                <Select
                  value={filters.priceType}
                  onValueChange={(value) => setFilters({ ...filters, priceType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="sale">Vente</SelectItem>
                    <SelectItem value="rent">Location</SelectItem>
                    <SelectItem value="vacation">Vacances</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Localisation</Label>
                <Input
                  placeholder="Ville, code postal..."
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>
              <div>
                <Label>Prix min</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.priceMin}
                  onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                />
              </div>
              <div>
                <Label>Prix max</Label>
                <Input
                  type="number"
                  placeholder="∞"
                  value={filters.priceMax}
                  onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      category: "all",
                      priceType: "all",
                      type: "all",
                      priceMin: "",
                      priceMax: "",
                      location: "",
                    })
                  }
                  className="w-full"
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des propriétés */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={property.images[0] || "/placeholder.svg"}
                  alt={property.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge className={getStatusColor(property.status)}>{getStatusLabel(property.status)}</Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-white">
                    {getCategoryLabel(property.category)}
                  </Badge>
                </div>
                <div className="absolute bottom-2 right-2">
                  <Badge className="bg-blue-600 text-white">{getPriceDisplay(property)}</Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline">{property.type}</Badge>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="font-semibold mb-2 line-clamp-2">{property.title}</h3>

                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.address}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                  <div>Surface: {property.sqft} m²</div>
                  <div>Année: {property.yearBuilt}</div>
                  {property.pricePerSqft && <div>Prix/m²: {property.pricePerSqft}€</div>}
                  {property.availability && <div>Dispo: {property.availability}</div>}
                </div>

                {property.features && property.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {property.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {property.features.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{property.features.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="text-sm text-gray-500 border-t pt-2 mb-3">Agent: {property.agent}</div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Phone className="h-3 w-3 mr-1" />
                    Appeler
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <Card className="p-8 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune propriété trouvée</h3>
            <p className="text-gray-600 mb-4">Modifiez vos filtres ou ajoutez une nouvelle propriété</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter votre première propriété
                </Button>
              </DialogTrigger>
            </Dialog>
          </Card>
        )}
      </div>
    </div>
  )
}
