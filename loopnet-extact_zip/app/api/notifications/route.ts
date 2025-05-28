import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filter = searchParams.get("filter") || "all"
  const unreadOnly = searchParams.get("unread") === "true"

  // Mock notifications - in real app, this would come from your NestJS backend
  const notifications = [
    {
      id: "1",
      type: "inquiry",
      title: "New Property Inquiry",
      message: "Sarah Johnson is interested in your Downtown Office Complex listing",
      timestamp: "2024-01-20T10:30:00Z",
      read: false,
      actionUrl: "/dashboard?tab=inquiries",
      metadata: { propertyId: "123", inquirerName: "Sarah Johnson" },
    },
    {
      id: "2",
      type: "view",
      title: "Property Viewed",
      message: "Your Retail Shopping Center listing has been viewed 25 times today",
      timestamp: "2024-01-20T09:15:00Z",
      read: false,
      actionUrl: "/property/456",
      metadata: { propertyId: "456", viewCount: 25 },
    },
    // ... more notifications
  ]

  let filteredNotifications = notifications

  if (unreadOnly) {
    filteredNotifications = filteredNotifications.filter((n) => !n.read)
  }

  if (filter !== "all") {
    filteredNotifications = filteredNotifications.filter((n) => n.type === filter)
  }

  return NextResponse.json({
    notifications: filteredNotifications,
    unreadCount: notifications.filter((n) => !n.read).length,
  })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { notificationId, action } = body

  // Mock notification update - in real app, this would update in your NestJS backend
  console.log(`${action} notification ${notificationId}`)

  return NextResponse.json({
    success: true,
    message: `Notification ${action} successfully`,
  })
}
