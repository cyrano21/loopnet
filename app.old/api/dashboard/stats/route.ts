import { NextResponse } from "next/server"

export async function GET() {
  // Mock dashboard stats - in real app, this would call your NestJS API
  const stats = {
    totalProperties: 24,
    totalViews: 1247,
    totalInquiries: 89,
    totalRevenue: 125000,
    recentActivity: [
      {
        type: "inquiry",
        message: "New inquiry for Downtown Office Complex",
        timestamp: "2024-01-20T10:30:00Z",
      },
      {
        type: "view",
        message: "Property viewed 15 times today",
        timestamp: "2024-01-20T09:15:00Z",
      },
      {
        type: "listing",
        message: "New property listing approved",
        timestamp: "2024-01-19T16:45:00Z",
      },
    ],
  }

  return NextResponse.json(stats)
}
