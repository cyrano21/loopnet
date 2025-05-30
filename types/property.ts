export interface PropertyLocation {
  address: string
  city: string
  postalCode: string
  country: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface PropertyImage {
  url: string
  publicId: string
  alt?: string
  isPrimary?: boolean
}

export interface PropertyContact {
  name: string
  email: string
  phone: string
}

export interface Property {
  _id: string
  title: string
  description: string
  propertyType: string
  transactionType: "sale" | "rent" | "vacation"
  
  // Location
  address: string
  city: string
  postalCode: string
  country: string
  coordinates?: {
    lat: number
    lng: number
  }

  // Details
  price: number
  surface: number
  rooms?: number
  bedrooms?: number
  bathrooms?: number
  yearBuilt?: number
  floor?: number
  totalFloors?: number

  // Features
  features: string[]
  energyClass?: string
  heating?: string
  parking?: string

  // Images
  images: PropertyImage[]

  // Owner/Agent
  owner: string | {
    _id: string
    name: string
    email: string
    company?: string
    role: string
    avatar?: string
    phone?: string
  } // ID de l'utilisateur ou objet populé
  ownerType: "individual" | "agent" | "agency"
  contactInfo: PropertyContact
  agent?: {
    name: string
    phone?: string
    email: string
    company?: string
    image?: string
  }

  // Status
  status: "draft" | "pending" | "active" | "sold" | "rented" | "expired" | "suspended"
  publishedAt?: Date
  expiresAt?: Date

  // Analytics
  views: number
  favorites: number
  inquiries: number

  // SEO
  slug: string
  metaTitle?: string
  metaDescription?: string

  // Availability
  availableFrom?: Date
  visitSchedule?: string

  // Premium features
  isPremium: boolean
  premiumUntil?: Date
  isFeatured: boolean

  // Timestamps
  createdAt: Date
  updatedAt: Date
}
