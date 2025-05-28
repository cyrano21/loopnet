import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ActivityLog from "@/models/ActivityLog"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()

    const activityData = {
      ...body,
      ipAddress: request.ip || request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      timestamp: new Date(),
    }

    const activity = new ActivityLog(activityData)
    await activity.save()

    return NextResponse.json({ success: true, activity })
  } catch (error) {
    console.error("Erreur log activité:", error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'enregistrement de l'activité" },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const userRole = searchParams.get("userRole")
    const action = searchParams.get("action")

    const query: any = {}
    if (userRole) query.userRole = userRole
    if (action) query.action = action

    const activities = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip((page - 1) * limit)

    const total = await ActivityLog.countDocuments(query)

    return NextResponse.json({
      success: true,
      activities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Erreur récupération activités:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la récupération des activités" }, { status: 500 })
  }
}
