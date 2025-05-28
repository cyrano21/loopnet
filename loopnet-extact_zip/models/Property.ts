import mongoose, { Schema, type Document } from "mongoose"
import type { ObjectId } from "mongodb"

export interface Property {
  _id?: ObjectId
  title: string
  description: string
  location: string
  price: number
  propertyType: string
  bedrooms?: number
  bathrooms?: number
  squareFootage?: number
  lotSize?: number
  yearBuilt?: number
  imageUrl?: string
  amenities: string[]
  status: string
  views: number
  userId: ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface User {
  _id?: ObjectId
  email: string
  name?: string
  image?: string
  role: string
  company?: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

export interface Favorite {
  _id?: ObjectId
  userId: ObjectId
  propertyId: ObjectId
  createdAt: Date
}

export interface Inquiry {
  _id?: ObjectId
  message: string
  email: string
  phone?: string
  name: string
  status: string
  userId: ObjectId
  propertyId: ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface IProperty extends Document {
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
  images: {
    url: string
    publicId: string
    alt?: string
    isPrimary?: boolean
  }[]

  // Owner/Agent
  owner: mongoose.Types.ObjectId
  ownerType: "individual" | "agent" | "agency"
  contactInfo: {
    name: string
    email: string
    phone: string
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

  createdAt: Date
  updatedAt: Date
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    propertyType: { type: String, required: true },
    transactionType: { type: String, enum: ["sale", "rent", "vacation"], required: true },

    // Location
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "France" },
    coordinates: {
      lat: Number,
      lng: Number,
    },

    // Details
    price: { type: Number, required: true },
    surface: { type: Number, required: true },
    rooms: Number,
    bedrooms: Number,
    bathrooms: Number,
    yearBuilt: Number,
    floor: Number,
    totalFloors: Number,

    // Features
    features: [String],
    energyClass: String,
    heating: String,
    parking: String,

    // Images
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        alt: String,
        isPrimary: { type: Boolean, default: false },
      },
    ],

    // Owner/Agent
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ownerType: { type: String, enum: ["individual", "agent", "agency"], default: "individual" },
    contactInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },

    // Status
    status: {
      type: String,
      enum: ["draft", "pending", "active", "sold", "rented", "expired", "suspended"],
      default: "draft",
    },
    publishedAt: Date,
    expiresAt: Date,

    // Analytics
    views: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },

    // SEO - slug maintenant optionnel avec génération automatique
    slug: { type: String, unique: true },
    metaTitle: String,
    metaDescription: String,

    // Availability
    availableFrom: Date,
    visitSchedule: String,

    // Premium features
    isPremium: { type: Boolean, default: false },
    premiumUntil: Date,
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes pour la performance
PropertySchema.index({ city: 1, propertyType: 1, transactionType: 1 })
PropertySchema.index({ price: 1 })
PropertySchema.index({ status: 1, publishedAt: -1 })
PropertySchema.index({ owner: 1 })
PropertySchema.index({ coordinates: "2dsphere" })

// Virtual pour le prix au m²
PropertySchema.virtual("pricePerSqm").get(function () {
  return this.surface ? Math.round(this.price / this.surface) : 0
})

// Pre-save middleware pour générer le slug automatiquement
PropertySchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      this._id
  }
  next()
})

const Property = mongoose.models.Property || mongoose.model<IProperty>("Property", PropertySchema)

// Export par défaut
export default Property

// Export nommé requis

// Export de l'interface
export type { IProperty }
