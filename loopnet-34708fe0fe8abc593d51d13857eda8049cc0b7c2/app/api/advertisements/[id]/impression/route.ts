import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Advertisement from "@/models/Advertisement"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const advertisement = await Advertisement.findByIdAndUpdate(params.id, { $inc: { impressions: 1 } }, { new: true })

    if (!advertisement) {
      return NextResponse.json({ success: false, error: "Advertisement not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Impression tracked successfully",
    })
  } catch (error) {
    console.error("Error tracking impression:", error)
    return NextResponse.json({ success: false, error: "Failed to track impression" }, { status: 500 })
  }
}
