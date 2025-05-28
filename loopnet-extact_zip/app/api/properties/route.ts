import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAuthSession } from "@/lib/auth"
import { PropertySchema } from "@/lib/validators/property"
import { CacheService } from "@/lib/cache/redis-cache"
import { ObjectId } from "mongodb"

interface SessionUser {
  id: string
  email: string
  role: string
}

interface AuthSession {
  user: SessionUser
  expires: string
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)

    const search = url.searchParams.get("search")
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const filters = url.searchParams.get("filters") || ""

    // Générer la clé de cache
    const cacheKey = CacheService.generateSearchKey(search || "", filters, page, limit)

    // Vérifier le cache
    const cachedResults = await CacheService.getCachedSearchResults(cacheKey)
    if (cachedResults) {
      console.log("🚀 Cache hit for properties search")
      return NextResponse.json(cachedResults)
    }

    const skip = (page - 1) * limit

    // Utiliser l'interface Prisma compatible
    const properties = await prisma.property.findMany({
      where: {
        OR: [
          {
            title: {
              contains: search || "",
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search || "",
              mode: "insensitive",
            },
          },
          {
            location: {
              contains: search || "",
              mode: "insensitive",
            },
          },
        ],
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    })

    const count = await prisma.property.count({
      where: {
        OR: [
          {
            title: {
              contains: search || "",
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search || "",
              mode: "insensitive",
            },
          },
          {
            location: {
              contains: search || "",
              mode: "insensitive",
            },
          },
        ],
      },
    })

    const result = {
      data: properties,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    }

    // Mettre en cache les résultats
    await CacheService.cacheSearchResults(cacheKey, result, 1800) // 30 minutes

    return NextResponse.json(result)
  } catch (error) {
    console.error("Properties API Error:", error)
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession() as AuthSession | null

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = PropertySchema.parse(body)

    const property = await prisma.property.create({
      data: {
        ...validatedData,
        userId: new ObjectId(session.user.id),
        status: "active",
        views: 0,
        amenities: validatedData.amenities || [],
      },
    })

    return NextResponse.json({ success: true, data: property })
  } catch (error) {
    console.error("Create Property Error:", error)
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 })
  }
}
