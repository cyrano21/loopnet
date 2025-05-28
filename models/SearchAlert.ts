import mongoose, { Document, Schema } from 'mongoose'

export interface ISearchAlert extends Document {
  user: mongoose.Types.ObjectId
  savedSearch: mongoose.Types.ObjectId
  property: mongoose.Types.ObjectId
  alertType: 'new_property' | 'price_change' | 'status_change' | 'similar_property'
  title: string
  message: string
  isRead: boolean
  isEmailSent: boolean
  isSMSSent: boolean
  isPushSent: boolean
  metadata?: {
    oldPrice?: number
    newPrice?: number
    oldStatus?: string
    newStatus?: string
    similarity?: number
  }
  createdAt: Date
  updatedAt: Date
}

const SearchAlertSchema = new Schema<ISearchAlert>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    savedSearch: { type: Schema.Types.ObjectId, ref: 'SavedSearch', required: true },
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    alertType: {
      type: String,
      enum: ['new_property', 'price_change', 'status_change', 'similar_property'],
      required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    isEmailSent: { type: Boolean, default: false },
    isSMSSent: { type: Boolean, default: false },
    isPushSent: { type: Boolean, default: false },
    metadata: {
      oldPrice: Number,
      newPrice: Number,
      oldStatus: String,
      newStatus: String,
      similarity: Number
    }
  },
  {
    timestamps: true
  }
)

// Indexes
SearchAlertSchema.index({ user: 1, isRead: 1 })
SearchAlertSchema.index({ savedSearch: 1 })
SearchAlertSchema.index({ property: 1 })
SearchAlertSchema.index({ alertType: 1 })
SearchAlertSchema.index({ createdAt: -1 })

export default mongoose.models.SearchAlert || mongoose.model('SearchAlert', SearchAlertSchema)