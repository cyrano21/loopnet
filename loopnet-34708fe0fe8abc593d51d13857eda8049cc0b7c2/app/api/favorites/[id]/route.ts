import { NextResponse } from "next/server"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const propertyId = params.id

  // Mock removing from favorites - in real app, this would delete from your NestJS backend
  console.log(`Removing property ${propertyId} from favorites`)

  return NextResponse.json({
    success: true,
    message: "Propriété supprimée des favoris",
  })
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const propertyId = params.id

  // Check if property is in favorites
  const isFavorite = true // Mock check

  return NextResponse.json({
    isFavorite,
    propertyId,
  })
}
