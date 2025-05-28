import mongoose, { Document, Schema } from 'mongoose'

export interface IFavorite extends Document {
  user: mongoose.Types.ObjectId
  property: mongoose.Types.ObjectId
  notes?: string
  tags?: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    notes: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
)

// Indexes
FavoriteSchema.index({ user: 1, isActive: 1 })
FavoriteSchema.index({ property: 1 })
FavoriteSchema.index({ user: 1, property: 1 }, { unique: true })
FavoriteSchema.index({ createdAt: -1 })

export default mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema)