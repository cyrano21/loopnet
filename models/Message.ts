import mongoose, { Schema, type Document } from "mongoose"

export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId
  sender: mongoose.Types.ObjectId
  recipient: mongoose.Types.ObjectId
  content: string
  attachments?: Array<{
    url: string
    type: string
    name: string
    size?: number
  }>
  isRead: boolean
  readAt?: Date
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    attachments: [
      {
        url: { type: String, required: true },
        type: { type: String, required: true },
        name: { type: String, required: true },
        size: { type: Number },
      },
    ],
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
  },
  {
    timestamps: true,
  },
)

// Indexes
MessageSchema.index({ conversation: 1, createdAt: -1 })
MessageSchema.index({ sender: 1 })
MessageSchema.index({ recipient: 1 })
MessageSchema.index({ isRead: 1 })

export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema)