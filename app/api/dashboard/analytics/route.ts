import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Property from "@/models/Property"
import Inquiry from "@/models/Inquiry"
import mongoose from "mongoose"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30d"

    // TODO: Récupérer l'utilisateur authentifié
    const userId = "507f1f77bcf86cd799439011" // Mock pour l'instant

    // Calculer la date de début selon la période
    const now = new Date()
    const startDate = new Date()

    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Récupérer les propriétés de l'utilisateur
    const userProperties = await Property.find({ owner: userId }).select("_id price views favorites inquiries status")

    const propertyIds = userProperties.map((p) => p._id)

    // Calculer les statistiques
    const [
      totalProperties,
      activeProperties,
      pendingProperties,
      totalViews,
      totalFavorites,
      totalInquiries,
      recentInquiries,
      monthlyRevenue,
    ] = await Promise.all([
      Property.countDocuments({ owner: userId }),
      Property.countDocuments({ owner: userId, status: "active" }),
      Property.countDocuments({ owner: userId, status: "pending" }),
      Property.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, total: { $sum: "$views" } } },
      ]),
      Property.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, total: { $sum: "$favorites" } } },
      ]),
      Property.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, total: { $sum: "$inquiries" } } },
      ]),
      Inquiry.countDocuments({
        property: { $in: propertyIds },
        createdAt: { $gte: startDate },
      }),
      Property.aggregate([
        {
          $match: {
            owner: new mongoose.Types.ObjectId(userId),
            status: { $in: ["active", "sold", "rented"] },
          },
        },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
    ])

    // Propriétés les plus performantes
    const topProperties = await Property.find({ owner: userId })
      .sort({ views: -1, inquiries: -1 })
      .limit(5)
      .select("title views inquiries favorites price images")
      .lean()

    // Activités récentes
    const recentActivities = await Inquiry.find({ property: { $in: propertyIds } })
      .populate("property", "title")
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    // Calculer le taux d'occupation (simulation)
    const occupancyRate = activeProperties > 0 ? (activeProperties / totalProperties) * 100 : 0

    // Calculer la croissance mensuelle (simulation basée sur les données)
    const monthlyGrowth = recentInquiries > 0 ? Math.min((recentInquiries / totalProperties) * 10, 25) : 0

    const stats = {
      totalProperties,
      activeProperties,
      pendingProperties,
      totalViews: totalViews[0]?.total || 0,
      totalFavorites: totalFavorites[0]?.total || 0,
      totalInquiries: totalInquiries[0]?.total || 0,
      recentInquiries,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      occupancyRate: Math.round(occupancyRate * 100) / 100,
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
      topProperties,
      recentActivities: recentActivities.map((activity) => ({
        id: activity._id,
        type: "inquiry",
        message: `Nouvelle demande pour ${activity.property?.title}`,
        user: activity.user?.name,
        time: activity.createdAt,
        priority: "medium",
      })),
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Dashboard Analytics Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 })
  }
}
