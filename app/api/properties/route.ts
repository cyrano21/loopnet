import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET(request: NextRequest) {
  try {
    console.log("API Properties: Starting GET request");
    await connectDB();
    console.log("API Properties: Database connected");

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    console.log(`API Properties: Processing request with page=${page}, limit=${limit}`);

    // Construction des filtres
    const filters: any = {};

    // Filtre par type de transaction
    const transactionType = searchParams.get("transactionType");
    if (transactionType && transactionType !== "all") {
      filters.transactionType = transactionType;
    }

    // Filtre par type de propriété
    const propertyType = searchParams.get("propertyType");
    if (propertyType && propertyType !== "all") {
      filters.propertyType = propertyType;
    }

    // Filtre par source
    const source = searchParams.get("source");
    if (source && source !== "all") {
      if (source === "scraped") {
        filters["contactInfo.email"] = "scraped@system.com";
      } else if (source === "manual") {
        filters["contactInfo.email"] = { $ne: "scraped@system.com" };
      }
    }

    // Filtre par agent/propriétaire
    const agent = searchParams.get("agent");
    if (agent && agent !== "current") {
      filters.owner = agent;
    }
    // Note: "current" sera géré par l'authentification côté client

    // Filtre par ville
    const city = searchParams.get("city");
    if (city) {
      filters.city = { $regex: city, $options: "i" };
    }

    // Filtre par prix
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseInt(minPrice);
      if (maxPrice) filters.price.$lte = parseInt(maxPrice);
    }

    // Filtre par surface
    const minSurface = searchParams.get("minSurface");
    const maxSurface = searchParams.get("maxSurface");
    if (minSurface || maxSurface) {
      filters.surface = {};
      if (minSurface) filters.surface.$gte = parseInt(minSurface);
      if (maxSurface) filters.surface.$lte = parseInt(maxSurface);
    }

    // Filtre par nombre de pièces
    const rooms = searchParams.get("rooms");
    if (rooms) {
      filters.rooms = parseInt(rooms);
    }

    // Recherche textuelle
    const q = searchParams.get("q");
    if (q) {
      filters.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { address: { $regex: q, $options: "i" } },
      ];
    }

    console.log("API Properties: Applied filters:", JSON.stringify(filters));

    // Tri
    const sort = searchParams.get("sort") || "newest";
    let sortOptions: any = { createdAt: -1 };
    switch (sort) {
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "price_asc":
        sortOptions = { price: 1 };
        break;
      case "price_desc":
        sortOptions = { price: -1 };
        break;
      case "surface_asc":
        sortOptions = { surface: 1 };
        break;
      case "surface_desc":
        sortOptions = { surface: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    console.log("API Properties: Executing database query with sort:", JSON.stringify(sortOptions));

    const properties = await Property.find(filters)
      .sort(sortOptions)
      .limit(limit)
      .skip(skip)
      .populate("owner", "name email company role avatar phone")
      .lean();

    console.log(`API Properties: Found ${properties.length} properties`);

    const total = await Property.countDocuments(filters);
    console.log(`API Properties: Total count: ${total}`);

    return NextResponse.json({
      success: true,
      data: {
        properties,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error("Erreur récupération propriétés:", error);
    console.error("Stack trace:", error.stack);
    
    // Déterminer si l'erreur est liée à MongoDB
    const isMongoError = error.name === "MongoError" || 
                         error.name === "MongoServerError" || 
                         error.message?.includes("mongo") || 
                         error.message?.includes("Mongo");
    
    const errorMessage = isMongoError 
      ? "Erreur de connexion à la base de données" 
      : "Erreur lors de la récupération des propriétés";
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.message || "Aucun détail disponible",
        success: false 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("API Properties: Starting POST request");
    await connectDB();
    console.log("API Properties: Database connected");

    const body = await request.json();
    console.log("API Properties: Received body:", JSON.stringify(body));

    // Validation des données
    if (!body.title || !body.price || !body.location) {
      return NextResponse.json(
        { error: "Données manquantes (title, price, location requis)", success: false },
        { status: 400 }
      );
    }

    const property = new Property(body);
    await property.save();
    console.log(`API Properties: Created property with ID ${property._id}`);

    return NextResponse.json(
      {
        success: true,
        data: property,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur création propriété:", error);
    console.error("Stack trace:", error.stack);
    
    return NextResponse.json(
      { 
        error: "Erreur lors de la création de la propriété",
        details: error.message || "Aucun détail disponible",
        success: false 
      },
      { status: 500 }
    );
  }
}
