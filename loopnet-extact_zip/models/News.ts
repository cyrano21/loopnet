import mongoose, { Schema, type Document } from "mongoose"

export interface INews extends Document {
  title: string
  slug: string
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
  metaTitle?: string
  metaDescription?: string
  createdAt: Date
  updatedAt: Date
}

const NewsSchema = new Schema<INews>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true }, // Index unique automatique, pas besoin de schema.index()
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    featured: { type: Boolean, default: false },
    image: { type: String },
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: { type: Date },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    readTime: { type: Number, default: 1 },
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Fonction pour générer un slug à partir du titre
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
    .replace(/[^a-z0-9\s-]/g, "") // Garder seulement lettres, chiffres, espaces et tirets
    .trim()
    .replace(/\s+/g, "-") // Remplacer espaces par tirets
    .replace(/-+/g, "-") // Éviter les tirets multiples
}

// Middleware pour générer automatiquement le slug avant sauvegarde
NewsSchema.pre("save", async function (next) {
  if (!this.slug || this.isModified("title")) {
    const baseSlug = generateSlug(this.title)
    let slug = baseSlug
    let counter = 1

    // Vérifier l'unicité du slug
    while (await mongoose.models.News.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    this.slug = slug
    console.log(`📰 Slug généré pour "${this.title}": ${this.slug}`)
  }
  next()
})

// Index pour les recherches (pas de slug car déjà unique)
NewsSchema.index({ status: 1, publishedAt: -1 })
NewsSchema.index({ category: 1 })
NewsSchema.index({ featured: 1, publishedAt: -1 })
NewsSchema.index({ author: 1 })
NewsSchema.index({ tags: 1 })

export default mongoose.models.News || mongoose.model<INews>("News", NewsSchema)
