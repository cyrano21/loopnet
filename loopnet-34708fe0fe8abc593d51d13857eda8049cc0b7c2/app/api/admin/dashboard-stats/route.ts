import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import Property from "@/models/Property"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Statistiques des utilisateurs
    const totalUsers = await User.countDocuments()
    const adminUsers = await User.countDocuments({ role: "admin" })
    const agentUsers = await User.countDocuments({ role: "agent" })
    const premiumUsers = await User.countDocuments({ role: "premium" })
    const simpleUsers = await User.countDocuments({ role: "simple" })
    const guestUsers = await User.countDocuments({ role: "guest" })

    // Statistiques des propriétés
    const totalProperties = await Property.countDocuments()
    const activeProperties = await Property.countDocuments({ status: "active" })
    const pendingProperties = await Property.countDocuments({ status: "pending" })

    // Activité du mois
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    })

    const propertiesAddedThisMonth = await Property.countDocuments({
      createdAt: { $gte: startOfMonth },
    })

    const stats = {
      users: {
        total: totalUsers,
        admin: adminUsers,
        agent: agentUsers,
        premium: premiumUsers,
        simple: simpleUsers,
        guest: guestUsers,
      },
      properties: {
        total: totalProperties,
        active: activeProperties,
        pending: pendingProperties,
      },
      revenue: {
        monthly: 12500, // À calculer avec Stripe
        yearly: 150000,
      },
      activity: {
        newUsersThisMonth,
        propertiesAddedThisMonth,
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des statistiques" }, { status: 500 })
  }
}
