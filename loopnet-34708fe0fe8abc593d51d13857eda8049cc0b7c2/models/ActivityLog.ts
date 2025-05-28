import mongoose, { Schema, type Document } from "mongoose"

export interface IActivityLog extends Document {
  userId: string
  userEmail: string
  userName: string
  userRole: string
  action: string
  description: string
  details: any
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    userRole: { type: String, required: true },
    action: { type: String, required: true },
    description: { type: String, required: true },
    details: { type: Schema.Types.Mixed },
    ipAddress: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
)

// Index pour les requêtes fréquentes
ActivityLogSchema.index({ timestamp: -1 })
ActivityLogSchema.index({ userId: 1, timestamp: -1 })
ActivityLogSchema.index({ userRole: 1, timestamp: -1 })

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema)
