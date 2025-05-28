import mongoose, { Document, Schema } from 'mongoose'

export interface ITask extends Document {
  user: mongoose.Types.ObjectId
  title: string
  description?: string
  category: 'follow_up' | 'viewing' | 'documentation' | 'marketing' | 'administrative' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled'
  dueDate?: Date
  completedAt?: Date
  relatedProperty?: mongoose.Types.ObjectId
  relatedClient?: mongoose.Types.ObjectId
  relatedCommission?: mongoose.Types.ObjectId
  assignedTo?: mongoose.Types.ObjectId
  tags?: string[]
  attachments?: {
    name: string
    url: string
    type: string
  }[]
  reminders?: {
    date: Date
    type: 'email' | 'sms' | 'push'
    sent: boolean
  }[]
  subtasks?: {
    title: string
    completed: boolean
    completedAt?: Date
  }[]
  timeTracking?: {
    estimatedHours?: number
    actualHours?: number
    startTime?: Date
    endTime?: Date
  }
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const TaskSchema = new Schema<ITask>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      enum: ['follow_up', 'viewing', 'documentation', 'marketing', 'administrative', 'other'],
      default: 'other'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'completed', 'cancelled'],
      default: 'todo'
    },
    dueDate: Date,
    completedAt: Date,
    relatedProperty: { type: Schema.Types.ObjectId, ref: 'Property' },
    relatedClient: { type: Schema.Types.ObjectId, ref: 'User' },
    relatedCommission: { type: Schema.Types.ObjectId, ref: 'Commission' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    tags: [{ type: String, trim: true }],
    attachments: [{
      name: { type: String, required: true },
      url: { type: String, required: true },
      type: { type: String, required: true }
    }],
    reminders: [{
      date: { type: Date, required: true },
      type: { type: String, enum: ['email', 'sms', 'push'], required: true },
      sent: { type: Boolean, default: false }
    }],
    subtasks: [{
      title: { type: String, required: true },
      completed: { type: Boolean, default: false },
      completedAt: Date
    }],
    timeTracking: {
      estimatedHours: Number,
      actualHours: Number,
      startTime: Date,
      endTime: Date
    },
    notes: String
  },
  {
    timestamps: true
  }
)

// Indexes
TaskSchema.index({ user: 1, status: 1 })
TaskSchema.index({ assignedTo: 1, status: 1 })
TaskSchema.index({ dueDate: 1 })
TaskSchema.index({ priority: 1, status: 1 })
TaskSchema.index({ category: 1 })
TaskSchema.index({ relatedProperty: 1 })
TaskSchema.index({ relatedClient: 1 })
TaskSchema.index({ createdAt: -1 })

export default mongoose.models.Task || mongoose.model('Task', TaskSchema)