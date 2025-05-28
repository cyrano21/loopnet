import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sort = searchParams.get("sort") || "date-added"
  const userId = searchParams.get("userId") || "1" // Mock user ID

  // Mock favorites data - in real app, this would come from your NestJS backend
  const favorites = [
    {
      id: "1",
      userId: "1",
      propertyId: "1",
      dateAdded: "2024-01-20T10:00:00Z",
      property: {
        id: "1",
        title: "Prime Office Building - Downtown Financial District",
        address: "123 Business District, San Francisco, CA 94105",
        price: "$2,500,000",
        sqft: "15,000",
        type: "Office",
        status: "For Sale",
        image: "/placeholder.svg?height=250&width=400",
      },
    },
    {
      id: "2",
      userId: "1",
      propertyId: "2",
      dateAdded: "2024-01-19T15:30:00Z",
      property: {
        id: "2",
        title: "Modern Retail Space in Shopping Center",
        address: "456 Shopping Center, Los Angeles, CA 90210",
        price: "$18/sq ft/year",
        sqft: "8,500",
        type: "Retail",
        status: "For Lease",
        image: "/placeholder.svg?height=250&width=400",
      },
    },
    {
      id: "3",
      userId: "1",
      propertyId: "3",
      dateAdded: "2024-01-18T09:15:00Z",
      property: {
        id: "3",
        title: "Luxury Hotel Property - Waterfront Location",
        address: "555 Ocean View Blvd, Miami, FL 33101",
        price: "$15,000,000",
        sqft: "30,000",
        type: "Hospitality",
        status: "For Sale",
        image: "/placeholder.svg?height=250&width=400",
      },
    },
  ]

  // Sort favorites
  switch (sort) {
    case "date-added":
      favorites.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      break
    case "price-low":
      favorites.sort((a, b) => {
        const priceA = Number.parseFloat(a.property.price.replace(/[^0-9]/g, ""))
        const priceB = Number.parseFloat(b.property.price.replace(/[^0-9]/g, ""))
        return priceA - priceB
      })
      break
    case "price-high":
      favorites.sort((a, b) => {
        const priceA = Number.parseFloat(a.property.price.replace(/[^0-9]/g, ""))
        const priceB = Number.parseFloat(b.property.price.replace(/[^0-9]/g, ""))
        return priceB - priceA
      })
      break
    case "size":
      favorites.sort((a, b) => {
        const sizeA = Number.parseInt(a.property.sqft.replace(/[^0-9]/g, ""))
        const sizeB = Number.parseInt(b.property.sqft.replace(/[^0-9]/g, ""))
        return sizeB - sizeA
      })
      break
    case "type":
      favorites.sort((a, b) => a.property.type.localeCompare(b.property.type))
      break
  }

  // Transform data for frontend
  const transformedFavorites = favorites.map((fav) => ({
    id: fav.property.id,
    title: fav.property.title,
    address: fav.property.address,
    price: fav.property.price,
    sqft: fav.property.sqft,
    type: fav.property.type,
    status: fav.property.status,
    image: fav.property.image,
    dateAdded: fav.dateAdded,
  }))

  return NextResponse.json({
    favorites: transformedFavorites,
    total: transformedFavorites.length,
  })
}

export async function POST(request: Request) {
  const body = await request.json();
  const { propertyId, userId = "1" } = body;

  // Mock adding to favorites - in real app, this would save to your NestJS backend
  const favorite = {
    id: Date.now().toString(),
    userId,
    propertyId,
    dateAdded: new Date().toISOString(),
  };

  console.log("Adding to favorites:", favorite);

  return NextResponse.json({
    success: true,
    message: "Propriété ajoutée aux favoris",
    favorite,
  });
}
