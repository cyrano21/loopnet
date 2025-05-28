import mongoose, { Document, Schema } from 'mongoose'

export interface IPriceHistory extends Document {
  property: mongoose.Types.ObjectId
  price: number
  pricePerSqm: number
  changeType: 'initial' | 'increase' | 'decrease' | 'correction'
  changeAmount: number
  changePercentage: number
  reason?: string
  marketConditions?: {
    averageMarketPrice?: number
    marketTrend?: 'rising' | 'falling' | 'stable'
    competitionLevel?: 'low' | 'medium' | 'high'
  }
  source: 'owner' | 'agent' | 'market_analysis' | 'automated'
  recordedBy?: mongoose.Types.ObjectId
  isActive: boolean
  metadata?: {
    renovations?: boolean
    marketEvents?: string[]
    seasonalFactors?: string[]
    economicIndicators?: Record<string, number>
  }
  createdAt: Date
  updatedAt: Date
}

const PriceHistorySchema = new Schema<IPriceHistory>(
  {
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    price: { type: Number, required: true, min: 0 },
    pricePerSqm: { type: Number, required: true, min: 0 },
    changeType: {
      type: String,
      enum: ['initial', 'increase', 'decrease', 'correction'],
      required: true
    },
    changeAmount: { type: Number, default: 0 },
    changePercentage: { type: Number, default: 0 },
    reason: { type: String, trim: true },
    marketConditions: {
      averageMarketPrice: Number,
      marketTrend: {
        type: String,
        enum: ['rising', 'falling', 'stable']
      },
      competitionLevel: {
        type: String,
        enum: ['low', 'medium', 'high']
      }
    },
    source: {
      type: String,
      enum: ['owner', 'agent', 'market_analysis', 'automated'],
      required: true
    },
    recordedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
    metadata: {
      renovations: Boolean,
      marketEvents: [String],
      seasonalFactors: [String],
      economicIndicators: Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
)

// Indexes
PriceHistorySchema.index({ property: 1, createdAt: -1 })
PriceHistorySchema.index({ changeType: 1 })
PriceHistorySchema.index({ source: 1 })
PriceHistorySchema.index({ recordedBy: 1 })
PriceHistorySchema.index({ isActive: 1 })
PriceHistorySchema.index({ createdAt: -1 })

// Pre-save middleware to calculate change amount and percentage
PriceHistorySchema.pre('save', async function(next) {
  if (this.isNew && this.changeType !== 'initial') {
    // Find the previous price record for this property
    const previousRecord = await mongoose.model('PriceHistory')
      .findOne({ property: this.property, _id: { $ne: this._id } })
      .sort({ createdAt: -1 })
    
    if (previousRecord) {
      this.changeAmount = this.price - previousRecord.price
      this.changePercentage = ((this.price - previousRecord.price) / previousRecord.price) * 100
    }
  }
  next()
})

export default mongoose.models.PriceHistory || mongoose.model('PriceHistory', PriceHistorySchema)