import mongoose from "mongoose"

const AdvertisementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ["banner", "sidebar", "popup", "inline"],
      required: true,
    },
    position: {
      type: String,
      enum: ["homepage", "properties", "property-details", "search-results", "sidebar"],
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    targetUrl: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    budget: {
      type: Number,
      default: 0,
    },
    costPerClick: {
      type: Number,
      default: 0,
    },
    advertiser: {
      name: String,
      email: String,
      company: String,
    },
    priority: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Advertisement || mongoose.model("Advertisement", AdvertisementSchema)
