import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Property from "@/models/Property"

export async function GET(request: NextRequest) {
  try {
    console.log("📋 API Properties - Début de la requête")
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit

    // Filters
    const filters: any = {}

    // Status filter
    const status = searchParams.get("status")
    if (status) {
      filters.status = status
    } else {
      filters.status = "active" // Only show active properties by default
    }

    // Transaction type
    const transactionType = searchParams.get("transactionType")
    if (transactionType) {
      filters.transactionType = transactionType
    }

    // Property type
    const propertyType = searchParams.get("propertyType")
    if (propertyType) {
      filters.propertyType = propertyType
    }

    // Location
    const city = searchParams.get("city")
    if (city) {
      filters.city = { $regex: city, $options: "i" }
    }

    // Price range
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    if (minPrice || maxPrice) {
      filters.price = {}
      if (minPrice) filters.price.$gte = Number.parseInt(minPrice)
      if (maxPrice) filters.price.$lte = Number.parseInt(maxPrice)
    }

    // Surface range
    const minSurface = searchParams.get("minSurface")
    const maxSurface = searchParams.get("maxSurface")
    if (minSurface || maxSurface) {
      filters.surface = {}
      if (minSurface) filters.surface.$gte = Number.parseInt(minSurface)
      if (maxSurface) filters.surface.$lte = Number.parseInt(maxSurface)
    }

    // Rooms
    const rooms = searchParams.get("rooms")
    if (rooms) {
      filters.rooms = Number.parseInt(rooms)
    }

    // Search query
    const q = searchParams.get("q")
    if (q) {
      filters.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { address: { $regex: q, $options: "i" } },
        { city: { $regex: q, $options: "i" } },
      ]
    }

    // Sorting
    const sort = searchParams.get("sort") || "newest"
    let sortQuery: any = {}

    switch (sort) {
      case "newest":
        sortQuery = { publishedAt: -1, createdAt: -1 }
        break
      case "oldest":
        sortQuery = { publishedAt: 1, createdAt: 1 }
        break
      case "price-asc":
        sortQuery = { price: 1 }
        break
      case "price-desc":
        sortQuery = { price: -1 }
        break
      case "surface-asc":
        sortQuery = { surface: 1 }
        break
      case "surface-desc":
        sortQuery = { surface: -1 }
        break
      case "popular":
        sortQuery = { views: -1, favorites: -1 }
        break
      default:
        sortQuery = { isFeatured: -1, publishedAt: -1 }
    }

    console.log("🔍 Filtres appliqués:", filters)
    console.log("📊 Tri appliqué:", sortQuery)

    // Execute query
    const [properties, total] = await Promise.all([
      Property.find(filters)
        .populate("owner", "name email company role")
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean(),
      Property.countDocuments(filters),
    ])

    console.log(`📋 ${properties.length} propriétés trouvées sur ${total} total`)

    // Calculate pagination
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    // Structure de réponse cohérente
    const response = {
      success: true,
      data: {
        properties,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      },
    }

    console.log("✅ Réponse API:", JSON.stringify(response, null, 2))

    return NextResponse.json(response)
  } catch (error) {
    console.error("❌ Properties API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch properties",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    // TODO: Get user from authentication
    const userId = body.userId || "507f1f77bcf86cd799439011" // Mock user ID

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "propertyType",
      "transactionType",
      "address",
      "city",
      "price",
      "surface",
    ]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `${field} is required` }, { status: 400 })
      }
    }

    // Create property
    const propertyData = {
      ...body,
      owner: userId,
      status: "pending", // Requires admin approval
      publishedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      views: 0,
      favorites: 0,
      inquiries: 0,
    }

    const property = new Property(propertyData)
    await property.save()

    // Populate owner info
    await property.populate("owner", "name email company role")

    return NextResponse.json(
      {
        success: true,
        data: property,
        message: "Property created successfully and is pending approval",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("❌ Create Property Error:", error)
    return NextResponse.json({ success: false, error: "Failed to create property" }, { status: 500 })
  }
}
