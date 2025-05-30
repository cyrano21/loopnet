import mongoose, { Schema, type Document } from "mongoose"

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
  agent?: {
    name: string
    phone: string
    email: string
    company: string
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
    agent: {
      name: String,
      phone: String,
      email: String,
      company: String,
      image: String,
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

    // SEO
    slug: { type: String, unique: true, required: true },
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

// Indexes for performance (SANS slug car unique: true le crée déjà)
PropertySchema.index({ city: 1, propertyType: 1, transactionType: 1 })
PropertySchema.index({ price: 1 })
PropertySchema.index({ status: 1, publishedAt: -1 })
PropertySchema.index({ owner: 1 })
PropertySchema.index({ coordinates: "2dsphere" })

// Virtual for price per square meter
PropertySchema.virtual("pricePerSqm").get(function () {
  return this.surface ? Math.round(this.price / this.surface) : 0
})

// Pre-save middleware to generate slug
PropertySchema.pre("save", function (next) {
  if (this.isModified("title")) {
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

export default mongoose.models.Property || mongoose.model<IProperty>("Property", PropertySchema)
