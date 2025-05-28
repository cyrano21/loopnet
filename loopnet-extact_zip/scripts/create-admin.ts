import bcrypt from "bcryptjs"
import connectDB from "../lib/mongodb"
import User from "../models/User"

async function createAdmin() {
  try {
    await connectDB()

    // Vos coordonnées admin
    const adminData = {
      name: "Louis Olivier",
      email: "louiscyrano@gmail.com",
      password: await bcrypt.hash("Figoro21", 12),
      role: "admin",
      isEmailVerified: true,
      phone: "", // Ajoutez votre téléphone si souhaité
      company: "LoopNet Admin",
      bio: "Administrateur principal de LoopNet",
    }

    // Créer ou mettre à jour l'admin
    const admin = await User.findOneAndUpdate({ email: adminData.email }, adminData, { upsert: true, new: true })

    console.log("✅ Admin créé avec succès:", admin.name, admin.email)
    console.log("🔑 Mot de passe:", "Figoro21")
    console.log("👑 Rôle:", admin.role)
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'admin:", error)
  }
}

createAdmin()
