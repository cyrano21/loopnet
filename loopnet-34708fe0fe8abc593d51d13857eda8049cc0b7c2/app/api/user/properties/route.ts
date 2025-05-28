import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Property from "@/models/Property"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)

    // TODO: Get user ID from authentication
    const userId = searchParams.get("userId") || "507f1f77bcf86cd799439011"

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const status = searchParams.get("status")

    // Build filters
    const filters: any = { owner: userId }
    if (status && status !== "all") {
      filters.status = status
    }

    // Get properties with pagination
    const [properties, total] = await Promise.all([
      Property.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Property.countDocuments(filters),
    ])

    // Calculate stats
    const stats = await Property.aggregate([
      { $match: { owner: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalViews: { $sum: "$views" },
          totalFavorites: { $sum: "$favorites" },
          totalInquiries: { $sum: "$inquiries" },
        },
      },
    ])

    const formattedStats = {
      total: total,
      active: 0,
      pending: 0,
      sold: 0,
      rented: 0,
      expired: 0,
      totalViews: 0,
      totalFavorites: 0,
      totalInquiries: 0,
    }

    stats.forEach((stat) => {
      formattedStats[stat._id] = stat.count
      formattedStats.totalViews += stat.totalViews
      formattedStats.totalFavorites += stat.totalFavorites
      formattedStats.totalInquiries += stat.totalInquiries
    })

    return NextResponse.json({
      success: true,
      data: {
        properties,
        stats: formattedStats,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error("User Properties API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch user properties" }, { status: 500 })
  }
}
