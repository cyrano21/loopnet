import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function POST() {
  try {
    await connectDB()

    // Vos coordonnées admin - Louis Olivier
    const adminData = {
      name: "Louis Olivier",
      email: "louiscyrano@gmail.com",
      password: await bcrypt.hash("Figoro21", 12),
      role: "admin",
      isEmailVerified: true,
      phone: "",
      company: "LoopNet Admin",
      bio: "Administrateur principal de LoopNet",
      preferences: {
        notifications: {
          email: true,
          sms: true,
          push: true,
        },
        searchAlerts: true,
        newsletter: true,
      },
    }

    // Créer ou mettre à jour l'admin
    const admin = await User.findOneAndUpdate({ email: adminData.email }, adminData, { upsert: true, new: true })

    return NextResponse.json({
      success: true,
      message: "Admin Louis Olivier créé avec succès",
      admin: {
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error("Erreur création admin:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la création de l'admin" }, { status: 500 })
  }
}
