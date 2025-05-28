import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { SecurityMonitor } from "@/lib/security/security-monitor"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    switch (action) {
      case "stats":
        const stats = SecurityMonitor.getStatistics()
        return NextResponse.json(stats)

      case "events":
        const limit = Number.parseInt(searchParams.get("limit") || "50")
        const events = SecurityMonitor.getRecentEvents(limit)
        return NextResponse.json(events)

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Security API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { action, ip } = body

    switch (action) {
      case "block_ip":
        SecurityMonitor.blockIP(ip)
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Security API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
