import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Professional from "@/models/Professional"

export async function GET(request: Request) {
  try {
    console.log("🔍 GET /api/professionals - Début")
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const specialty = searchParams.get("specialty")
    const location = searchParams.get("location")
    const sortBy = searchParams.get("sortBy") || "rating"
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")

    console.log("📊 Paramètres de recherche:", { specialty, location, sortBy, search, page, limit })

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

    console.log("🔍 Query MongoDB:", JSON.stringify(query, null, 2))

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

    console.log("📈 Sort:", sort)

    const skip = (page - 1) * limit

    const [professionals, total] = await Promise.all([
      Professional.find(query).sort(sort).skip(skip).limit(limit),
      Professional.countDocuments(query),
    ])

    console.log("✅ Professionnels trouvés:", professionals.length, "sur", total)

    return NextResponse.json({
      professionals,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    })
  } catch (error) {
    console.error("❌ Erreur GET /api/professionals:", error)
    return NextResponse.json({ error: "Failed to fetch professionals" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    console.log("📝 POST /api/professionals - Début")
    await connectToDatabase()

    // Logs détaillés des headers
    const contentType = request.headers.get("content-type")
    const contentLength = request.headers.get("content-length")
    console.log("📋 Headers:", { contentType, contentLength })

    // Vérifier le Content-Type
    if (!contentType || !contentType.includes("application/json")) {
      console.error("❌ Content-Type invalide:", contentType)
      return NextResponse.json(
        {
          error: "Content-Type must be application/json",
          received: contentType,
        },
        { status: 400 },
      )
    }

    // Lire le body comme texte d'abord
    const text = await request.text()
    console.log("📄 Body reçu (longueur):", text.length)
    console.log("📄 Body reçu (contenu):", text.substring(0, 500) + (text.length > 500 ? "..." : ""))

    if (!text || text.trim() === "") {
      console.error("❌ Body vide")
      return NextResponse.json(
        {
          error: "Request body is empty",
          received: text,
        },
        { status: 400 },
      )
    }

    // Parser le JSON
    let body
    try {
      body = JSON.parse(text)
      console.log("✅ JSON parsé avec succès")
      console.log("📊 Données reçues:", JSON.stringify(body, null, 2))
    } catch (parseError) {
      console.error("❌ Erreur de parsing JSON:", parseError)
      console.error("📄 Texte qui a causé l'erreur:", text)
      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
          details: parseError.message,
          received: text.substring(0, 200),
        },
        { status: 400 },
      )
    }

    // Vérifier que body est un objet
    if (!body || typeof body !== "object") {
      console.error("❌ Body n'est pas un objet:", typeof body)
      return NextResponse.json(
        {
          error: "Request body must be an object",
          received: typeof body,
        },
        { status: 400 },
      )
    }

    // Vérifier les champs requis
    const requiredFields = ["name", "email", "company"]
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      console.error("❌ Champs requis manquants:", missingFields)
      return NextResponse.json(
        {
          error: "Missing required fields",
          missing: missingFields,
          received: Object.keys(body),
        },
        { status: 400 },
      )
    }

    console.log("📝 Création d'un professionnel avec les données:", body)

    const professional = await Professional.create(body)

    console.log("✅ Professionnel créé avec succès:", professional._id)

    return NextResponse.json({
      success: true,
      professional,
    })
  } catch (error) {
    console.error("❌ Erreur POST /api/professionals:", error)
    console.error("📋 Stack trace:", error.stack)

    // Erreur de validation Mongoose
    if (error.name === "ValidationError") {
      console.error("❌ Erreurs de validation:", error.errors)
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to create professional",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
