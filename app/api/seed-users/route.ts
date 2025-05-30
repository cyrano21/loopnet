import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    await connectToDatabase()

    console.log("👥 Vérification et création des utilisateurs de test...")

    const users = [
      {
        name: "Jean Dupont",
        email: "jean.dupont@example.com",
        password: "password123",
        role: "user",
        phone: "+33 1 23 45 67 89",
        bio: "Investisseur immobilier spécialisé dans le commercial",
        company: "Dupont Investissements",
        subscription: { plan: "premium", status: "active" },
      },
      {
        name: "Marie Martin",
        email: "marie.martin@realestate.com",
        password: "password123",
        role: "agent",
        phone: "+33 6 78 90 12 34",
        bio: "Agent immobilier commercial avec 15 ans d'expérience",
        company: "Martin & Associés",
        subscription: { plan: "enterprise", status: "active" },
      },
      {
        name: "Admin System",
        email: "admin@loopnet.com",
        password: "admin123",
        role: "admin",
        phone: "+33 1 00 00 00 00",
        bio: "Administrateur système",
        company: "LoopNet",
        subscription: { plan: "enterprise", status: "active" },
      },
    ]

    const results = {
      created: [] as any[],
      skipped: [] as any[],
      errors: [] as any[],
    }

    // Traiter chaque utilisateur individuellement
    for (const userData of users) {
      try {
        console.log(`🔍 Vérification utilisateur: ${userData.email}`)

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email: userData.email })

        if (existingUser) {
          console.log(`⚠️ Utilisateur déjà existant: ${userData.email} (${existingUser.role})`)
          results.skipped.push({
            email: userData.email,
            name: userData.name,
            reason: "Email déjà utilisé",
            existingRole: existingUser.role,
            existingId: existingUser._id,
          })
          continue
        }

        // Créer le nouvel utilisateur
        console.log(`➕ Création utilisateur: ${userData.email}`)
        const hashedPassword = await bcrypt.hash(userData.password, 12)

        const newUser = await User.create({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          phone: userData.phone,
          bio: userData.bio,
          company: userData.company,
          preferences: {
            notifications: { email: true, sms: false, push: true },
            searchAlerts: true,
            newsletter: true,
          },
          subscription: {
            plan: userData.subscription.plan,
            status: userData.subscription.status,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
          isEmailVerified: true,
          loginCount: 0,
          lastLoginAt: new Date(),
        })

        console.log(`✅ Utilisateur créé: ${newUser.email} (${newUser.role})`)
        results.created.push({
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          plan: newUser.subscription.plan,
        })
      } catch (error) {
        console.error(`❌ Erreur création utilisateur ${userData.email}:`, error)
        results.errors.push({
          email: userData.email,
          name: userData.name,
          error: error instanceof Error ? error.message : "Erreur inconnue",
        })
      }
    }

    const message = `Traitement terminé: ${results.created.length} créés, ${results.skipped.length} ignorés, ${results.errors.length} erreurs`
    console.log(`📊 ${message}`)

    return NextResponse.json({
      success: true,
      message,
      results,
      summary: {
        total: users.length,
        created: results.created.length,
        skipped: results.skipped.length,
        errors: results.errors.length,
      },
    })
  } catch (error) {
    console.error("Erreur globale lors de la création des utilisateurs:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la création des utilisateurs",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    )
  }
}
