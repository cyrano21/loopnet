import mongoose from "mongoose"

const ProfessionalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: {
      address: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: String,
    },
    specialties: [{ type: String, required: true }],
    certifications: [String],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    yearsExperience: { type: Number, required: true },
    totalTransactions: { type: Number, default: 0 },
    totalVolume: { type: Number, default: 0 },
    image: String,
    bio: String,
    languages: [String],
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    socialLinks: {
      linkedin: String,
      website: String,
    },
  },
  {
    timestamps: true,
  },
)

ProfessionalSchema.index({ location: "2dsphere" })
ProfessionalSchema.index({ specialties: 1 })
ProfessionalSchema.index({ rating: -1 })

export default mongoose.models.Professional || mongoose.model("Professional", ProfessionalSchema)
