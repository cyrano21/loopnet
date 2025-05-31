import mongoose, { Schema, type Document } from "mongoose"

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[]
  property?: mongoose.Types.ObjectId
  lastMessage?: mongoose.Types.ObjectId
  unreadCount: {
    [key: string]: number
  }
  isArchived: {
    [key: string]: boolean
  }
  title?: string
  createdAt: Date
  updatedAt: Date
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    property: { type: Schema.Types.ObjectId, ref: "Property" },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    unreadCount: { type: Map, of: Number, default: {} },
    isArchived: { type: Map, of: Boolean, default: {} },
    title: { type: String },
  },
  {
    timestamps: true,
  },
)

// Indexes
ConversationSchema.index({ participants: 1 })
ConversationSchema.index({ property: 1 })
ConversationSchema.index({ updatedAt: -1 })

export default mongoose.models.Conversation || mongoose.model<IConversation>("Conversation", ConversationSchema)