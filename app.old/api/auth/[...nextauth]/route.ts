import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"
import User from "@/models/User"
import connectDB from "@/lib/mongodb"
import type { NextAuthOptions } from "next-auth"
import type { JWT } from "next-auth/jwt"
import type { User as AuthUser, Account, Profile } from "next-auth"

const client = new MongoClient(process.env.MONGODB_URI!)

// cspell:ignore Liste Remplacez d'autres
// Liste des emails admin (ajoutez votre email ici)
const ADMIN_EMAILS = [
  "votre-email@gmail.com", // Remplacez par votre email Google
  "admin@loopnet.com",
  // Ajoutez d'autres emails admin ici
]

const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(client),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // cspell:ignore Permet comptes même
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
    strategy: "jwt" as const,
  },
  callbacks: {
    // cspell:ignore Vérifier être
    async signIn({ user, account, profile }: { 
      user: AuthUser | { email: string }; 
      account: Account | null; 
      profile?: Profile 
    }) {
      // Vérifier si l'utilisateur doit être admin
      if (user.email && ADMIN_EMAILS.includes(user.email)) {
        try {
          await connectDB()
          await User.findOneAndUpdate({ email: user.email }, { role: "admin" }, { upsert: true })
        } catch (error) {
          console.error("Error updating user role:", error)
        }
      }
      return true
    },
    async jwt({ token, user }: { 
      token: JWT; 
      user?: AuthUser | { role?: string }
    }) {
      if (user) {
        token.role = user.role
      }

      // cspell:ignore rôle depuis
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
    async session({ session, token }: { 
      session: any; 
      token: JWT
    }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string | null
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    // Note: signUp n'est pas une option valide dans next-auth v4
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
