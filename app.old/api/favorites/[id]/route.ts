import { NextResponse } from "next/server"

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: propertyId } = await params

  // Mock removing from favorites - in real app, this would delete from your NestJS backend
  console.log(`Removing property ${propertyId} from favorites`)

  return NextResponse.json({
    success: true,
    message: "Propriété supprimée des favoris",
  })
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: propertyId } = await params

  // Check if property is in favorites
  const isFavorite = true // Mock check

  return NextResponse.json({
    isFavorite,
    propertyId,
  })
}
