import mongoose, { Document, Schema } from 'mongoose'

export interface INotification extends Document {
  user: mongoose.Types.ObjectId
  type: 'system' | 'property' | 'message' | 'payment' | 'alert' | 'reminder' | 'marketing'
  category: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  data?: {
    propertyId?: mongoose.Types.ObjectId
    userId?: mongoose.Types.ObjectId
    commissionId?: mongoose.Types.ObjectId
    taskId?: mongoose.Types.ObjectId
    url?: string
    actionType?: string
    metadata?: Record<string, any>
  }
  channels: {
    inApp: {
      enabled: boolean
      sent: boolean
      sentAt?: Date
      read: boolean
      readAt?: Date
    }
    email: {
      enabled: boolean
      sent: boolean
      sentAt?: Date
      opened?: boolean
      openedAt?: Date
    }
    sms: {
      enabled: boolean
      sent: boolean
      sentAt?: Date
      delivered?: boolean
      deliveredAt?: Date
    }
    push: {
      enabled: boolean
      sent: boolean
      sentAt?: Date
      clicked?: boolean
      clickedAt?: Date
    }
  }
  priority: 'low' | 'normal' | 'high' | 'urgent'
  scheduledFor?: Date
  expiresAt?: Date
  isArchived: boolean
  template?: string
  templateData?: Record<string, any>
  batchId?: string
  source: 'system' | 'user' | 'automation' | 'api'
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['system', 'property', 'message', 'payment', 'alert', 'reminder', 'marketing'],
      required: true
    },
    category: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    data: {
      propertyId: { type: Schema.Types.ObjectId, ref: 'Property' },
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      commissionId: { type: Schema.Types.ObjectId, ref: 'Commission' },
      taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
      url: String,
      actionType: String,
      metadata: Schema.Types.Mixed
    },
    channels: {
      inApp: {
        enabled: { type: Boolean, default: true },
        sent: { type: Boolean, default: false },
        sentAt: Date,
        read: { type: Boolean, default: false },
        readAt: Date
      },
      email: {
        enabled: { type: Boolean, default: false },
        sent: { type: Boolean, default: false },
        sentAt: Date,
        opened: { type: Boolean, default: false },
        openedAt: Date
      },
      sms: {
        enabled: { type: Boolean, default: false },
        sent: { type: Boolean, default: false },
        sentAt: Date,
        delivered: { type: Boolean, default: false },
        deliveredAt: Date
      },
      push: {
        enabled: { type: Boolean, default: false },
        sent: { type: Boolean, default: false },
        sentAt: Date,
        clicked: { type: Boolean, default: false },
        clickedAt: Date
      }
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    },
    scheduledFor: Date,
    expiresAt: Date,
    isArchived: { type: Boolean, default: false },
    template: String,
    templateData: Schema.Types.Mixed,
    batchId: String,
    source: {
      type: String,
      enum: ['system', 'user', 'automation', 'api'],
      default: 'system'
    }
  },
  {
    timestamps: true
  }
)

// Indexes
NotificationSchema.index({ user: 1, 'channels.inApp.read': 1 })
NotificationSchema.index({ user: 1, type: 1 })
NotificationSchema.index({ user: 1, category: 1 })
NotificationSchema.index({ priority: 1, scheduledFor: 1 })
NotificationSchema.index({ expiresAt: 1 })
NotificationSchema.index({ batchId: 1 })
NotificationSchema.index({ isArchived: 1 })
NotificationSchema.index({ createdAt: -1 })

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema)