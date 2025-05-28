import mongoose, { Document, Schema } from 'mongoose'

export interface IAdvertisement extends Document {
  title: string
  description?: string
  type: 'banner' | 'sidebar' | 'popup' | 'inline' | 'video' | 'native'
  position: 'homepage' | 'properties' | 'property-details' | 'search-results' | 'sidebar' | 'footer' | 'header'
  imageUrl: string
  targetUrl: string
  isActive: boolean
  startDate: Date
  endDate: Date
  impressions: number
  clicks: number
  budget: number
  costPerClick: number
  costPerImpression: number
  advertiser: {
    name: string
    email: string
    company?: string
    phone?: string
  }
  targeting?: {
    locations?: string[]
    propertyTypes?: string[]
    userRoles?: string[]
    ageRange?: {
      min: number
      max: number
    }
    interests?: string[]
  }
  priority: number
  dimensions?: {
    width: number
    height: number
  }
  analytics: {
    ctr: number // Click-through rate
    cpm: number // Cost per mille
    conversions: number
    revenue: number
  }
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'paused' | 'completed'
  rejectionReason?: string
  approvedBy?: mongoose.Types.ObjectId
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const AdvertisementSchema = new Schema<IAdvertisement>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: {
      type: String,
      enum: ['banner', 'sidebar', 'popup', 'inline', 'video', 'native'],
      required: true
    },
    position: {
      type: String,
      enum: ['homepage', 'properties', 'property-details', 'search-results', 'sidebar', 'footer', 'header'],
      required: true
    },
    imageUrl: { type: String, required: true },
    targetUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    budget: { type: Number, default: 0, min: 0 },
    costPerClick: { type: Number, default: 0, min: 0 },
    costPerImpression: { type: Number, default: 0, min: 0 },
    advertiser: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      company: String,
      phone: String
    },
    targeting: {
      locations: [String],
      propertyTypes: [String],
      userRoles: [String],
      ageRange: {
        min: Number,
        max: Number
      },
      interests: [String]
    },
    priority: { type: Number, default: 1, min: 1, max: 10 },
    dimensions: {
      width: Number,
      height: Number
    },
    analytics: {
      ctr: { type: Number, default: 0 },
      cpm: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 }
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected', 'paused', 'completed'],
      default: 'draft'
    },
    rejectionReason: String,
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: true
  }
)

// Indexes
AdvertisementSchema.index({ isActive: 1, startDate: 1, endDate: 1 })
AdvertisementSchema.index({ position: 1, priority: -1 })
AdvertisementSchema.index({ type: 1 })
AdvertisementSchema.index({ status: 1 })
AdvertisementSchema.index({ createdBy: 1 })
AdvertisementSchema.index({ 'advertiser.email': 1 })
AdvertisementSchema.index({ createdAt: -1 })

// Pre-save middleware to calculate analytics
AdvertisementSchema.pre('save', function(next) {
  if (this.impressions > 0) {
    this.analytics.ctr = (this.clicks / this.impressions) * 100
  }
  if (this.impressions > 0 && this.budget > 0) {
    this.analytics.cpm = (this.budget / this.impressions) * 1000
  }
  next()
})

export default mongoose.models.Advertisement || mongoose.model('Advertisement', AdvertisementSchema)