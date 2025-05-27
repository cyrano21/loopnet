import mongoose, { Schema, type Document } from "mongoose"

export interface INews extends Document {
  title: string
  excerpt: string
  content: string
  category: string
  author: mongoose.Types.ObjectId
  featured: boolean
  image?: string
  tags: string[]
  status: "draft" | "published" | "archived"
  publishedAt?: Date
  views: number
  likes: number
  readTime: number
  slug: string
  metaTitle?: string
  metaDescription?: string
  createdAt: Date
  updatedAt: Date
}

const NewsSchema = new Schema<INews>(
  {
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    featured: { type: Boolean, default: false },
    image: String,
    tags: [String],
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    publishedAt: Date,
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    readTime: { type: Number, required: true }, // en minutes
    slug: { type: String, unique: true, required: true },
    metaTitle: String,
    metaDescription: String,
  },
  {
    timestamps: true,
  },
)

// Indexes
NewsSchema.index({ category: 1, status: 1 })
NewsSchema.index({ publishedAt: -1 })
NewsSchema.index({ featured: -1, publishedAt: -1 })

// Pre-save middleware pour générer le slug
NewsSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      this._id
  }
  next()
})

export default mongoose.models.News || mongoose.model<INews>("News", NewsSchema)
