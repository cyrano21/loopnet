import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  email: string
  password?: string
  name: string
  avatar?: string
  role: "user" | "agent" | "admin"

  // Profile
  phone?: string
  bio?: string
  company?: string
  license?: string

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

  // OAuth
  googleId?: string
  facebookId?: string

  // Verification
  isEmailVerified: boolean
  emailVerificationToken?: string

  // Password reset
  passwordResetToken?: string
  passwordResetExpires?: Date

  // Subscription
  subscription?: {
    plan: "free" | "basic" | "premium" | "enterprise"
    status: "active" | "canceled" | "expired"
    stripeCustomerId?: string
    stripeSubscriptionId?: string
    currentPeriodEnd?: Date
  }

  // Analytics
  lastLoginAt?: Date
  loginCount: number

  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: String,
    name: { type: String, required: true },
    avatar: String,
    role: { type: String, enum: ["user", "agent", "admin"], default: "user" },

    // Profile
    phone: String,
    bio: String,
    company: String,
    license: String,

    // Preferences
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
      },
      searchAlerts: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: false },
    },

    // OAuth
    googleId: String,
    facebookId: String,

    // Verification
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,

    // Password reset
    passwordResetToken: String,
    passwordResetExpires: Date,

    // Subscription
    subscription: {
      plan: { type: String, enum: ["free", "basic", "premium", "enterprise"], default: "free" },
      status: { type: String, enum: ["active", "canceled", "expired"], default: "active" },
      stripeCustomerId: String,
      stripeSubscriptionId: String,
      currentPeriodEnd: Date,
    },

    // Analytics
    lastLoginAt: Date,
    loginCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
)

// Indexes
UserSchema.index({ role: 1 })
UserSchema.index({ "subscription.plan": 1 })

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
