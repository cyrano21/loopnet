import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"
import User from "@/models/User"
import connectDB from "@/lib/mongodb"
import type { NextAuthOptions } from "next-auth"

const client = new MongoClient(process.env.MONGODB_URI!)

// Liste des emails admin
const ADMIN_EMAILS = ["louiscyrano@gmail.com", "admin@loopnet.com"]

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(client),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          await connectDB()
          const user = await User.findOne({ email: credentials.email })

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (user.email && ADMIN_EMAILS.includes(user.email)) {
        try {
          await connectDB()
          await User.findOneAndUpdate(
            { email: user.email },
            {
              role: "admin",
              name: user.email === "louiscyrano@gmail.com" ? "Louis Olivier" : user.name,
            },
            { upsert: true },
          )
        } catch (error) {
          console.error("Error updating user role:", error)
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }

      if (token.email) {
        try {
          await connectDB()
          const dbUser = await User.findOne({ email: token.email })
          if (dbUser) {
            token.role = dbUser.role
          }
        } catch (error) {
          console.error("Error fetching user role:", error)
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },
}
