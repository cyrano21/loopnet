import mongoose, { Document, Schema } from 'mongoose'

export interface IReport extends Document {
  user: mongoose.Types.ObjectId
  title: string
  type: 'market_analysis' | 'property_valuation' | 'commission_summary' | 'performance' | 'client_activity' | 'custom'
  description?: string
  parameters: {
    dateRange?: {
      start: Date
      end: Date
    }
    location?: {
      city?: string
      postalCode?: string
      radius?: number
    }
    propertyTypes?: string[]
    transactionTypes?: string[]
    priceRange?: {
      min?: number
      max?: number
    }
    customFilters?: Record<string, any>
  }
  data: {
    summary?: Record<string, any>
    charts?: {
      type: string
      title: string
      data: any[]
      config?: Record<string, any>
    }[]
    tables?: {
      title: string
      headers: string[]
      rows: any[][]
    }[]
    insights?: string[]
    recommendations?: string[]
  }
  status: 'generating' | 'completed' | 'failed' | 'expired'
  format: 'pdf' | 'excel' | 'json' | 'html'
  fileUrl?: string
  fileSize?: number
  generatedAt?: Date
  expiresAt?: Date
  isPublic: boolean
  shareToken?: string
  downloadCount: number
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

const ReportSchema = new Schema<IReport>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['market_analysis', 'property_valuation', 'commission_summary', 'performance', 'client_activity', 'custom'],
      required: true
    },
    description: { type: String, trim: true },
    parameters: {
      dateRange: {
        start: Date,
        end: Date
      },
      location: {
        city: String,
        postalCode: String,
        radius: Number
      },
      propertyTypes: [String],
      transactionTypes: [String],
      priceRange: {
        min: Number,
        max: Number
      },
      customFilters: Schema.Types.Mixed
    },
    data: {
      summary: Schema.Types.Mixed,
      charts: [{
        type: { type: String, required: true },
        title: { type: String, required: true },
        data: [Schema.Types.Mixed],
        config: Schema.Types.Mixed
      }],
      tables: [{
        title: { type: String, required: true },
        headers: [String],
        rows: [[Schema.Types.Mixed]]
      }],
      insights: [String],
      recommendations: [String]
    },
    status: {
      type: String,
      enum: ['generating', 'completed', 'failed', 'expired'],
      default: 'generating'
    },
    format: {
      type: String,
      enum: ['pdf', 'excel', 'json', 'html'],
      default: 'pdf'
    },
    fileUrl: String,
    fileSize: Number,
    generatedAt: Date,
    expiresAt: Date,
    isPublic: { type: Boolean, default: false },
    shareToken: String,
    downloadCount: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }]
  },
  {
    timestamps: true
  }
)

// Indexes
ReportSchema.index({ user: 1, status: 1 })
ReportSchema.index({ type: 1 })
ReportSchema.index({ generatedAt: -1 })
ReportSchema.index({ expiresAt: 1 })
ReportSchema.index({ shareToken: 1 })
ReportSchema.index({ isPublic: 1 })
ReportSchema.index({ createdAt: -1 })

export default mongoose.models.Report || mongoose.model('Report', ReportSchema)