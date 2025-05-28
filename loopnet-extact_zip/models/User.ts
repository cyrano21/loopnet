import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  password?: string
  role: "guest" | "user" | "premium" | "agent" | "admin"
  phone?: string
  bio?: string
  company?: string
  license?: string
  avatar?: string

  // Preferences
  preferences: {
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
    searchAlerts: boolean
    newsletter: boolean
  }

  // Verification
  isEmailVerified: boolean
  emailVerificationToken?: string

  // Subscription
  subscription: {
    plan: "basic" | "premium" | "enterprise"
    status: "active" | "inactive" | "cancelled" | "past_due"
    currentPeriodEnd?: Date
    stripeCustomerId?: string
    stripeSubscriptionId?: string
  }

  // OAuth
  googleId?: string
  facebookId?: string

  // Analytics
  lastLoginAt?: Date
  loginCount: number

  // Timestamps
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true, // Index unique ici seulement
      lowercase: true,
    },
    password: { type: String }, // Optional for OAuth users
    role: {
      type: String,
      enum: ["guest", "user", "premium", "agent", "admin"],
      default: "user",
    },
    phone: { type: String, trim: true },
    bio: { type: String, trim: true },
    company: { type: String, trim: true },
    license: { type: String, trim: true },
    avatar: { type: String },

    // Preferences with defaults
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
      },
      searchAlerts: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: false },
    },

    // Verification
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },

    // Subscription with defaults
    subscription: {
      plan: {
        type: String,
        enum: ["basic", "premium", "enterprise"],
        default: "basic",
      },
      status: {
        type: String,
        enum: ["active", "inactive", "cancelled", "past_due"],
        default: "active",
      },
      currentPeriodEnd: { type: Date },
      stripeCustomerId: { type: String },
      stripeSubscriptionId: { type: String },
    },

    // OAuth
    googleId: { type: String },
    facebookId: { type: String },

    // Analytics
    lastLoginAt: { type: Date },
    loginCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Index supplémentaires (sans email qui est déjà unique)
UserSchema.index({ role: 1 })
UserSchema.index({ "subscription.plan": 1 })
UserSchema.index({ googleId: 1 }, { sparse: true })
UserSchema.index({ facebookId: 1 }, { sparse: true })

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
