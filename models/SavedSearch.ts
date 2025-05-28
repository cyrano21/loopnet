import mongoose, { Document, Schema } from 'mongoose'

export interface ISavedSearch extends Document {
  user: mongoose.Types.ObjectId
  name: string
  searchCriteria: {
    query?: string
    location?: {
      city?: string
      postalCode?: string
      radius?: number
    }
    propertyType?: string
    transactionType?: 'sale' | 'rent' | 'vacation'
    priceRange?: {
      min?: number
      max?: number
    }
    surfaceRange?: {
      min?: number
      max?: number
    }
    rooms?: number
    bedrooms?: number
    bathrooms?: number
    features?: string[]
    energyClass?: string
  }
  alertsEnabled: boolean
  alertFrequency: 'immediate' | 'daily' | 'weekly'
  lastNotified?: Date
  resultsCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const SavedSearchSchema = new Schema<ISavedSearch>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    searchCriteria: {
      query: String,
      location: {
        city: String,
        postalCode: String,
        radius: { type: Number, default: 10 }
      },
      propertyType: String,
      transactionType: { type: String, enum: ['sale', 'rent', 'vacation'] },
      priceRange: {
        min: Number,
        max: Number
      },
      surfaceRange: {
        min: Number,
        max: Number
      },
      rooms: Number,
      bedrooms: Number,
      bathrooms: Number,
      features: [String],
      energyClass: String
    },
    alertsEnabled: { type: Boolean, default: true },
    alertFrequency: { type: String, enum: ['immediate', 'daily', 'weekly'], default: 'daily' },
    lastNotified: Date,
    resultsCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
)

// Indexes
SavedSearchSchema.index({ user: 1, isActive: 1 })
SavedSearchSchema.index({ alertsEnabled: 1, alertFrequency: 1 })
SavedSearchSchema.index({ createdAt: -1 })

export default mongoose.models.SavedSearch || mongoose.model('SavedSearch', SavedSearchSchema)