import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import News from "@/models/News"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")

    const skip = (page - 1) * limit

    // Construire les filtres
    const filters: any = { status: "published" }

    if (category && category !== "all") {
      filters.category = category
    }

    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ]
    }

    if (featured === "true") {
      filters.featured = true
    }

    // Récupérer les articles
    const [articles, total] = await Promise.all([
      News.find(filters)
        .populate("author", "name avatar")
        .sort({ featured: -1, publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      News.countDocuments(filters),
    ])

    // Calculer la pagination
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        articles,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    })
  } catch (error) {
    console.error("News API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch news" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    // TODO: Récupérer l'utilisateur authentifié
    const authorId = "507f1f77bcf86cd799439011" // Mock pour l'instant

    const newsData = {
      ...body,
      author: authorId,
      publishedAt: new Date(),
      views: 0,
      likes: 0,
    }

    const news = new News(newsData)
    await news.save()

    await news.populate("author", "name avatar")

    return NextResponse.json(
      {
        success: true,
        data: news,
        message: "Article créé avec succès",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create News Error:", error)
    return NextResponse.json({ success: false, error: "Failed to create news" }, { status: 500 })
  }
}
