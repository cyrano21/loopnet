import { NextResponse } from "next/server"
import { sign } from "jsonwebtoken"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(request: Request) {
  try {
    await connectDB()

    const body = await request.json()
    const { email, password } = body

    console.log("🔐 Tentative de connexion pour:", email)

    // Admin credentials hardcodés
    if (email === "louiscyrano@gmail.com" && password === "Figoro21.") {
      const user = {
        id: "admin-1",
        email: "louiscyrano@gmail.com",
        name: "Louis Cyrano",
        role: "admin",
        company: "LoopNet Admin",
        verified: true,
        permissions: ["all"],
      }

      const token = sign(user, process.env.NEXTAUTH_SECRET || "your-secret-key", {
        expiresIn: "30d",
      })

      console.log("✅ Admin connecté:", user.name)

      return NextResponse.json({
        success: true,
        token,
        user,
      })
    }

    // Recherche de l'utilisateur dans la base
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      console.log("❌ Utilisateur non trouvé:", email)
      return NextResponse.json({ success: false, message: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // Vérification du mot de passe
    if (user.password) {
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        console.log("❌ Mot de passe incorrect pour:", email)
        return NextResponse.json({ success: false, message: "Email ou mot de passe incorrect" }, { status: 401 })
      }
    }

    // Création du token
    const userData = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      company: user.company,
      verified: user.isEmailVerified,
    }

    const token = sign(userData, process.env.NEXTAUTH_SECRET || "your-secret-key", {
      expiresIn: "7d",
    })

    console.log("✅ Utilisateur connecté:", userData.name, "- Rôle:", userData.role)

    // Mise à jour de la dernière connexion
    await User.findByIdAndUpdate(user._id, {
      lastLoginAt: new Date(),
      $inc: { loginCount: 1 },
    })

    return NextResponse.json({
      success: true,
      token,
      user: userData,
    })
  } catch (error) {
    console.error("❌ Erreur lors de la connexion:", error)
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  // Rediriger vers la page de connexion de l'app au lieu de retourner 405
  const { searchParams } = new URL(request.url)
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`, request.url))
}
