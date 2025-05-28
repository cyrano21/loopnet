import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Advertisement from "@/models/Advertisement"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const position = searchParams.get("position")
    const type = searchParams.get("type")
    const active = searchParams.get("active")

    const query: any = {}

    if (position) query.position = position
    if (type) query.type = type
    if (active !== null) query.isActive = active === "true"

    // Filtrer par dates actives
    const now = new Date()
    query.startDate = { $lte: now }
    query.endDate = { $gte: now }

    const advertisements = await Advertisement.find(query).sort({ priority: -1, createdAt: -1 }).lean()

    return NextResponse.json({
      success: true,
      advertisements,
      count: advertisements.length,
    })
  } catch (error) {
    console.error("Error fetching advertisements:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch advertisements" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const {
      title,
      description,
      type,
      position,
      imageUrl,
      targetUrl,
      startDate,
      endDate,
      budget,
      costPerClick,
      advertiser,
      priority,
    } = body

    // Validation
    if (!title || !type || !position || !imageUrl || !targetUrl || !startDate || !endDate) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const advertisement = new Advertisement({
      title,
      description,
      type,
      position,
      imageUrl,
      targetUrl,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      budget: budget || 0,
      costPerClick: costPerClick || 0,
      advertiser,
      priority: priority || 1,
    })

    await advertisement.save()

    return NextResponse.json(
      {
        success: true,
        advertisement,
        message: "Advertisement created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating advertisement:", error)
    return NextResponse.json({ success: false, error: "Failed to create advertisement" }, { status: 500 })
  }
}
