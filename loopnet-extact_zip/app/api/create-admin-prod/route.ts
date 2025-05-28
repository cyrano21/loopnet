import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password, secretKey } = await request.json()

    // Clé secrète pour sécuriser la création d'admin en production
    const ADMIN_SECRET = process.env.ADMIN_CREATION_SECRET || "loopnet-admin-2024"

    if (secretKey !== ADMIN_SECRET) {
      console.log("🚫 Tentative de création d'admin avec mauvaise clé secrète")
      return NextResponse.json({ error: "Clé secrète invalide" }, { status: 403 })
    }

    await connectDB()

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      // Mettre à jour le rôle vers admin
      existingUser.role = "admin"
      await existingUser.save()

      console.log(`✅ Utilisateur ${email} mis à jour vers admin`)
      return NextResponse.json({
        success: true,
        message: "Utilisateur mis à jour vers admin",
        user: { email: existingUser.email, role: existingUser.role },
      })
    }

    // Créer un nouvel admin
    const hashedPassword = await bcrypt.hash(password, 12)

    const adminUser = new User({
      name: "Admin System",
      email,
      password: hashedPassword,
      role: "admin",
      subscription: {
        plan: "enterprise",
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
      },
      profile: {
        company: "LoopNet Admin",
        phone: "+33 1 00 00 00 00",
        bio: "Administrateur système",
      },
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        privacy: {
          profileVisible: false,
          contactInfoVisible: false,
        },
      },
    })

    await adminUser.save()

    console.log(`✅ Admin créé avec succès: ${email}`)
    return NextResponse.json({
      success: true,
      message: "Administrateur créé avec succès",
      user: { email: adminUser.email, role: adminUser.role },
    })
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'admin:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la création de l'administrateur",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    )
  }
}
