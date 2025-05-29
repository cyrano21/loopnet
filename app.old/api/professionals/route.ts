import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Professional from "@/models/Professional"

export async function GET(request: Request) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const specialty = searchParams.get("specialty")
    const location = searchParams.get("location")
    const sortBy = searchParams.get("sortBy") || "rating"
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")

    // Build query
    const query: any = { isActive: true }

    if (specialty && specialty !== "all") {
      query.specialties = { $in: [specialty] }
    }

    if (location && location !== "all") {
      query["location.city"] = { $regex: location, $options: "i" }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
      ]
    }

    // Build sort
    let sort: any = {}
    switch (sortBy) {
      case "rating":
        sort = { rating: -1, reviews: -1 }
        break
      case "experience":
        sort = { yearsExperience: -1 }
        break
      case "transactions":
        sort = { totalTransactions: -1 }
        break
      case "volume":
        sort = { totalVolume: -1 }
        break
      default:
        sort = { rating: -1 }
    }

    const skip = (page - 1) * limit

    const [professionals, total] = await Promise.all([
      Professional.find(query).sort(sort).skip(skip).limit(limit),
      Professional.countDocuments(query),
    ])

    return NextResponse.json({
      professionals,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    })
  } catch (error) {
    console.error("Error fetching professionals:", error)
    return NextResponse.json({ error: "Failed to fetch professionals" }, { status: 500 })
  }
}
