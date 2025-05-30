import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"
import User from "@/models/User"
import { connectToDatabase } from "@/lib/mongodb"
import type { NextAuthOptions } from "next-auth"

// Vérifier les variables d'environnement requises
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set')
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is not set')
}

const client = new MongoClient(process.env.MONGODB_URI!)

// List of admin emails
const ADMIN_EMAILS = ["louiscyrano@gmail.com", "admin@loopnet.com"]

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(client),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true, // Permet la liaison de comptes avec la même adresse email
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
          await connectToDatabase()
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
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (user.email && ADMIN_EMAILS.includes(user.email)) {
          await connectToDatabase()
          await User.findOneAndUpdate(
            { email: user.email },
            {
              role: "admin",
              name: user.email === "louiscyrano@gmail.com" ? "Louis Olivier" : user.name,
            },
            { upsert: true },
          )
        }
        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return true // Ne pas bloquer la connexion à cause d'une erreur DB
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }

      if (token.email) {
        try {
          await connectToDatabase()
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
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error("NextAuth Error:", code, metadata)
    },
    warn(code) {
      console.warn("NextAuth Warning:", code)
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === "development") {
        console.log("NextAuth Debug:", code, metadata)
      }
    },
  },
}
