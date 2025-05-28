import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Advertisement from "@/models/Advertisement"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const advertisement = await Advertisement.findById(params.id).lean()

    if (!advertisement) {
      return NextResponse.json({ success: false, error: "Advertisement not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      advertisement,
    })
  } catch (error) {
    console.error("Error fetching advertisement:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch advertisement" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const body = await request.json()

    const advertisement = await Advertisement.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true },
    )

    if (!advertisement) {
      return NextResponse.json({ success: false, error: "Advertisement not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      advertisement,
      message: "Advertisement updated successfully",
    })
  } catch (error) {
    console.error("Error updating advertisement:", error)
    return NextResponse.json({ success: false, error: "Failed to update advertisement" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const advertisement = await Advertisement.findByIdAndDelete(params.id)

    if (!advertisement) {
      return NextResponse.json({ success: false, error: "Advertisement not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Advertisement deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting advertisement:", error)
    return NextResponse.json({ success: false, error: "Failed to delete advertisement" }, { status: 500 })
  }
}
