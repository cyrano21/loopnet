import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Advertisement from "@/models/Advertisement"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const advertisement = await Advertisement.findByIdAndUpdate(params.id, { $inc: { clicks: 1 } }, { new: true })

    if (!advertisement) {
      return NextResponse.json({ success: false, error: "Advertisement not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Click tracked successfully",
      targetUrl: advertisement.targetUrl,
    })
  } catch (error) {
    console.error("Error tracking click:", error)
    return NextResponse.json({ success: false, error: "Failed to track click" }, { status: 500 })
  }
}
