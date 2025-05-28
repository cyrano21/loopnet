import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Property from "@/models/Property"
import mongoose from "mongoose"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const { id } = await params

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid property ID" }, { status: 400 })
    }

    // Find property and populate owner
    const property = await Property.findById(id).populate("owner", "name email company role avatar").lean()

    if (!property) {
      return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 })
    }

    // Increment view count
    await Property.findByIdAndUpdate(id, { $inc: { views: 1 } })

    return NextResponse.json({
      success: true,
      data: property,
    })
  } catch (error) {
    console.error("Property Detail API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch property" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const { id } = await params
    const body = await request.json()

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid property ID" }, { status: 400 })
    }

    // TODO: Add authentication check - user should own this property or be admin

    // Update property
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).populate("owner", "name email company role")

    if (!updatedProperty) {
      return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedProperty,
      message: "Property updated successfully",
    })
  } catch (error) {
    console.error("Property Update API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to update property" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const { id } = await params

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid property ID" }, { status: 400 })
    }

    // TODO: Add authentication check - user should own this property or be admin

    // Find and delete property
    const deletedProperty = await Property.findByIdAndDelete(id)

    if (!deletedProperty) {
      return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 })
    }

    // TODO: Delete images from Cloudinary
    // for (const image of deletedProperty.images) {
    //   await deleteFromCloudinary(image.publicId)
    // }

    return NextResponse.json({
      success: true,
      message: "Property deleted successfully",
    })
  } catch (error) {
    console.error("Property Delete API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete property" }, { status: 500 })
  }
}
