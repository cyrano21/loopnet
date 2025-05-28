import mongoose, { Document, Schema } from 'mongoose'

export interface IMarketAnalysis extends Document {
  location: {
    city: string
    postalCode?: string
    region?: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  period: {
    start: Date
    end: Date
  }
  propertyType: string
  transactionType: 'sale' | 'rent'
  metrics: {
    averagePrice: number
    medianPrice: number
    pricePerSqm: number
    totalTransactions: number
    averageDaysOnMarket: number
    priceGrowth: {
      monthly: number
      quarterly: number
      yearly: number
    }
    inventory: {
      totalListings: number
      newListings: number
      soldListings: number
      activeListings: number
    }
    demandSupply: {
      demandIndex: number
      supplyIndex: number
      competitionLevel: 'low' | 'medium' | 'high'
    }
  }
  priceDistribution: {
    range: string
    count: number
    percentage: number
  }[]
  comparableProperties: {
    property: mongoose.Types.ObjectId
    price: number
    pricePerSqm: number
    similarity: number
  }[]
  trends: {
    date: Date
    averagePrice: number
    transactionCount: number
    daysOnMarket: number
  }[]
  insights: {
    type: 'price_trend' | 'market_condition' | 'investment_opportunity' | 'risk_factor'
    title: string
    description: string
    confidence: number
    impact: 'positive' | 'negative' | 'neutral'
  }[]
  forecast: {
    period: '3_months' | '6_months' | '1_year'
    priceChange: number
    confidence: number
    factors: string[]
  }[]
  generatedBy: mongoose.Types.ObjectId
  isPublic: boolean
  accuracy?: number
  dataSource: string[]
  lastUpdated: Date
  createdAt: Date
  updatedAt: Date
}

const MarketAnalysisSchema = new Schema<IMarketAnalysis>(
  {
    location: {
      city: { type: String, required: true },
      postalCode: String,
      region: String,
      country: { type: String, default: 'France' },
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    period: {
      start: { type: Date, required: true },
      end: { type: Date, required: true }
    },
    propertyType: { type: String, required: true },
    transactionType: {
      type: String,
      enum: ['sale', 'rent'],
      required: true
    },
    metrics: {
      averagePrice: { type: Number, required: true },
      medianPrice: { type: Number, required: true },
      pricePerSqm: { type: Number, required: true },
      totalTransactions: { type: Number, required: true },
      averageDaysOnMarket: { type: Number, required: true },
      priceGrowth: {
        monthly: Number,
        quarterly: Number,
        yearly: Number
      },
      inventory: {
        totalListings: Number,
        newListings: Number,
        soldListings: Number,
        activeListings: Number
      },
      demandSupply: {
        demandIndex: Number,
        supplyIndex: Number,
        competitionLevel: {
          type: String,
          enum: ['low', 'medium', 'high']
        }
      }
    },
    priceDistribution: [{
      range: { type: String, required: true },
      count: { type: Number, required: true },
      percentage: { type: Number, required: true }
    }],
    comparableProperties: [{
      property: { type: Schema.Types.ObjectId, ref: 'Property' },
      price: { type: Number, required: true },
      pricePerSqm: { type: Number, required: true },
      similarity: { type: Number, required: true, min: 0, max: 1 }
    }],
    trends: [{
      date: { type: Date, required: true },
      averagePrice: { type: Number, required: true },
      transactionCount: { type: Number, required: true },
      daysOnMarket: { type: Number, required: true }
    }],
    insights: [{
      type: {
        type: String,
        enum: ['price_trend', 'market_condition', 'investment_opportunity', 'risk_factor'],
        required: true
      },
      title: { type: String, required: true },
      description: { type: String, required: true },
      confidence: { type: Number, required: true, min: 0, max: 1 },
      impact: {
        type: String,
        enum: ['positive', 'negative', 'neutral'],
        required: true
      }
    }],
    forecast: [{
      period: {
        type: String,
        enum: ['3_months', '6_months', '1_year'],
        required: true
      },
      priceChange: { type: Number, required: true },
      confidence: { type: Number, required: true, min: 0, max: 1 },
      factors: [String]
    }],
    generatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublic: { type: Boolean, default: false },
    accuracy: { type: Number, min: 0, max: 1 },
    dataSource: [String],
    lastUpdated: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
)

// Indexes
MarketAnalysisSchema.index({ 'location.city': 1, propertyType: 1, transactionType: 1 })
MarketAnalysisSchema.index({ 'period.start': 1, 'period.end': 1 })
MarketAnalysisSchema.index({ generatedBy: 1 })
MarketAnalysisSchema.index({ isPublic: 1 })
MarketAnalysisSchema.index({ lastUpdated: -1 })
MarketAnalysisSchema.index({ createdAt: -1 })

export default mongoose.models.MarketAnalysis || mongoose.model('MarketAnalysis', MarketAnalysisSchema)