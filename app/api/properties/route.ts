import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Property from "@/models/Property"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const properties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()

    const total = await Property.countDocuments()

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
    })
  } catch (error) {
    console.error("Erreur récupération propriétés:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des propriétés" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    // Validation des données
    if (!body.title || !body.price || !body.location) {
      return NextResponse.json(
        { error: "Données manquantes (title, price, location requis)" },
        { status: 400 },
      )
    }

    const property = new Property(body)
    await property.save()

    return NextResponse.json(
      {
        success: true,
        data: property,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erreur création propriété:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de la propriété" },
      { status: 500 },
    )
  }
}
