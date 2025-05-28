import mongoose, { Document, Schema } from 'mongoose'

export interface ICommission extends Document {
  agent: mongoose.Types.ObjectId
  property: mongoose.Types.ObjectId
  client: mongoose.Types.ObjectId
  transactionType: 'sale' | 'rent' | 'lease'
  transactionAmount: number
  commissionRate: number
  commissionAmount: number
  status: 'pending' | 'confirmed' | 'paid' | 'disputed' | 'cancelled'
  paymentStatus: 'unpaid' | 'partial' | 'paid'
  paymentDate?: Date
  paymentMethod?: string
  contractDate: Date
  closingDate?: Date
  description?: string
  documents?: {
    name: string
    url: string
    type: string
  }[]
  splits?: {
    agent: mongoose.Types.ObjectId
    percentage: number
    amount: number
  }[]
  expenses?: {
    description: string
    amount: number
    category: string
    date: Date
  }[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const CommissionSchema = new Schema<ICommission>(
  {
    agent: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    transactionType: {
      type: String,
      enum: ['sale', 'rent', 'lease'],
      required: true
    },
    transactionAmount: { type: Number, required: true, min: 0 },
    commissionRate: { type: Number, required: true, min: 0, max: 100 },
    commissionAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'paid', 'disputed', 'cancelled'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partial', 'paid'],
      default: 'unpaid'
    },
    paymentDate: Date,
    paymentMethod: String,
    contractDate: { type: Date, required: true },
    closingDate: Date,
    description: String,
    documents: [{
      name: { type: String, required: true },
      url: { type: String, required: true },
      type: { type: String, required: true }
    }],
    splits: [{
      agent: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      percentage: { type: Number, required: true, min: 0, max: 100 },
      amount: { type: Number, required: true, min: 0 }
    }],
    expenses: [{
      description: { type: String, required: true },
      amount: { type: Number, required: true, min: 0 },
      category: { type: String, required: true },
      date: { type: Date, required: true }
    }],
    notes: String
  },
  {
    timestamps: true
  }
)

// Indexes
CommissionSchema.index({ agent: 1, status: 1 })
CommissionSchema.index({ property: 1 })
CommissionSchema.index({ client: 1 })
CommissionSchema.index({ contractDate: -1 })
CommissionSchema.index({ paymentStatus: 1 })
CommissionSchema.index({ transactionType: 1 })

export default mongoose.models.Commission || mongoose.model('Commission', CommissionSchema)