import mongoose, { Schema, type Document } from "mongoose"

export interface IInquiry extends Document {
  property: mongoose.Types.ObjectId
  inquirer: mongoose.Types.ObjectId
  owner: mongoose.Types.ObjectId

  message: string
  contactMethod: "email" | "phone" | "both"

  inquirerInfo: {
    name: string
    email: string
    phone?: string
  }

  status: "new" | "read" | "replied" | "closed"

  // Visit request
  visitRequested: boolean
  preferredVisitDate?: Date

  // Response
  ownerResponse?: string
  respondedAt?: Date

  createdAt: Date
  updatedAt: Date
}

const InquirySchema = new Schema<IInquiry>(
  {
    property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    inquirer: { type: Schema.Types.ObjectId, ref: "User" },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },

    message: { type: String, required: true },
    contactMethod: { type: String, enum: ["email", "phone", "both"], default: "email" },

    inquirerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: String,
    },

    status: { type: String, enum: ["new", "read", "replied", "closed"], default: "new" },

    visitRequested: { type: Boolean, default: false },
    preferredVisitDate: Date,

    ownerResponse: String,
    respondedAt: Date,
  },
  {
    timestamps: true,
  },
)

// Indexes
InquirySchema.index({ property: 1, createdAt: -1 })
InquirySchema.index({ owner: 1, status: 1 })
InquirySchema.index({ inquirer: 1 })

export default mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema)
