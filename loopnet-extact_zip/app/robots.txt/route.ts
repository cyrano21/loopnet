import { NextResponse } from "next/server"
import { SEOService } from "@/lib/seo/seo-config"

export async function GET() {
  const robotsTxt = SEOService.generateRobotsTxt()

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
