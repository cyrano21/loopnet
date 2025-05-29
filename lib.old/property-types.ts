export const PROPERTY_TYPES = {
  residential: {
    label: "Résidentiel",
    icon: "🏠",
    types: [
      { value: "apartment", label: "Appartement", icon: "🏠" },
      { value: "house", label: "Maison", icon: "🏡" },
      { value: "studio", label: "Studio", icon: "🏢" },
      { value: "duplex", label: "Duplex", icon: "🏘️" },
      { value: "villa", label: "Villa", icon: "🏖️" },
      { value: "penthouse", label: "Penthouse", icon: "🏙️" },
      { value: "loft", label: "Loft", icon: "🏭" },
      { value: "townhouse", label: "Maison de ville", icon: "🏘️" },
    ],
  },
  commercial: {
    label: "Commercial",
    icon: "🏢",
    types: [
      { value: "office", label: "Bureau", icon: "🏢" },
      { value: "retail", label: "Commerce", icon: "🏪" },
      { value: "restaurant", label: "Restaurant", icon: "🍽️" },
      { value: "hotel", label: "Hôtel", icon: "🏨" },
      { value: "shopping-center", label: "Centre commercial", icon: "🛍️" },
      { value: "showroom", label: "Showroom", icon: "🚗" },
      { value: "coworking", label: "Espace de coworking", icon: "💼" },
      { value: "medical", label: "Cabinet médical", icon: "🏥" },
    ],
  },
  industrial: {
    label: "Industriel",
    icon: "🏭",
    types: [
      { value: "warehouse", label: "Entrepôt", icon: "📦" },
      { value: "factory", label: "Usine", icon: "🏭" },
      { value: "workshop", label: "Atelier", icon: "🔧" },
      { value: "logistics", label: "Plateforme logistique", icon: "🚛" },
      { value: "cold-storage", label: "Entrepôt frigorifique", icon: "❄️" },
      { value: "data-center", label: "Data center", icon: "💻" },
    ],
  },
  land: {
    label: "Terrain",
    icon: "🌍",
    types: [
      { value: "building-land", label: "Terrain constructible", icon: "🏗️" },
      { value: "agricultural", label: "Terrain agricole", icon: "🌾" },
      { value: "forest", label: "Terrain forestier", icon: "🌲" },
      { value: "commercial-land", label: "Terrain commercial", icon: "🏢" },
      { value: "industrial-land", label: "Terrain industriel", icon: "🏭" },
    ],
  },
  special: {
    label: "Spécialisé",
    icon: "🎯",
    types: [
      { value: "parking", label: "Parking", icon: "🅿️" },
      { value: "garage", label: "Garage", icon: "🚗" },
      { value: "storage", label: "Box de stockage", icon: "📦" },
      { value: "gas-station", label: "Station-service", icon: "⛽" },
      { value: "farm", label: "Exploitation agricole", icon: "🚜" },
      { value: "vineyard", label: "Vignoble", icon: "🍇" },
      { value: "marina", label: "Port de plaisance", icon: "⛵" },
      { value: "cemetery", label: "Concession funéraire", icon: "⚱️" },
    ],
  },
  investment: {
    label: "Investissement",
    icon: "💰",
    types: [
      { value: "building", label: "Immeuble de rapport", icon: "🏢" },
      { value: "portfolio", label: "Portefeuille immobilier", icon: "📊" },
      { value: "reit", label: "SCPI", icon: "💼" },
      { value: "development", label: "Projet de développement", icon: "🏗️" },
    ],
  },
}

export const TRANSACTION_TYPES = [
  { value: "sale", label: "Vente", icon: "💰", color: "bg-green-100 text-green-800" },
  { value: "rent", label: "Location", icon: "🏠", color: "bg-blue-100 text-blue-800" },
  { value: "vacation", label: "Location saisonnière", icon: "🏖️", color: "bg-purple-100 text-purple-800" },
  { value: "lease", label: "Bail commercial", icon: "📋", color: "bg-orange-100 text-orange-800" },
  { value: "investment", label: "Investissement", icon: "📈", color: "bg-yellow-100 text-yellow-800" },
  { value: "auction", label: "Vente aux enchères", icon: "🔨", color: "bg-red-100 text-red-800" },
]

export const PROPERTY_STATUS = [
  { value: "draft", label: "Brouillon", color: "bg-gray-100 text-gray-800" },
  { value: "pending", label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
  { value: "sold", label: "Vendu", color: "bg-blue-100 text-blue-800" },
  { value: "rented", label: "Loué", color: "bg-purple-100 text-purple-800" },
  { value: "expired", label: "Expirée", color: "bg-orange-100 text-orange-800" },
  { value: "suspended", label: "Suspendue", color: "bg-red-100 text-red-800" },
]

export function getAllPropertyTypes() {
  return Object.values(PROPERTY_TYPES).flatMap((category) =>
    category.types.map((type) => ({
      ...type,
      category: Object.keys(PROPERTY_TYPES).find((key) => PROPERTY_TYPES[key] === category),
    })),
  )
}

export function getPropertyTypeByValue(value: string) {
  return getAllPropertyTypes().find((type) => type.value === value)
}

export function getTransactionTypeByValue(value: string) {
  return TRANSACTION_TYPES.find((type) => type.value === value)
}

export function getStatusByValue(value: string) {
  return PROPERTY_STATUS.find((status) => status.value === value)
}
