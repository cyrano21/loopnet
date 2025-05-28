"use client"

import { useState, useEffect } from "react"
import { Bell, Check, X, Mail, Phone, Eye, Building2, Calendar, Filter } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Notification {
  id: string
  type: "inquiry" | "view" | "listing" | "system" | "market"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  metadata?: any
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    // Mock notifications data - in real app, this would come from your NestJS API
    const mockNotifications: Notification[] = [
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
      {
        id: "3",
        type: "listing",
        title: "Listing Approved",
        message: "Your Industrial Warehouse listing has been approved and is now live",
        timestamp: "2024-01-19T16:45:00Z",
        read: true,
        actionUrl: "/property/789",
        metadata: { propertyId: "789" },
      },
      {
        id: "4",
        type: "system",
        title: "Account Verification",
        message: "Your professional certification has been verified",
        timestamp: "2024-01-19T14:20:00Z",
        read: true,
      },
      {
        id: "5",
        type: "market",
        title: "Market Update",
        message: "Office prices in San Francisco increased by 5.2% this quarter",
        timestamp: "2024-01-18T11:00:00Z",
        read: false,
        actionUrl: "/market-data",
      },
      {
        id: "6",
        type: "inquiry",
        title: "Follow-up Reminder",
        message: "Remember to follow up with Mike Davis about the warehouse inquiry",
        timestamp: "2024-01-18T08:30:00Z",
        read: true,
        metadata: { inquirerName: "Mike Davis" },
      },
    ]

    setNotifications(mockNotifications)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "inquiry":
        return <Mail className="w-5 h-5 text-blue-600" />
      case "view":
        return <Eye className="w-5 h-5 text-green-600" />
      case "listing":
        return <Building2 className="w-5 h-5 text-purple-600" />
      case "system":
        return <Bell className="w-5 h-5 text-orange-600" />
      case "market":
        return <Calendar className="w-5 h-5 text-indigo-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "inquiry":
        return "bg-blue-100 text-blue-800"
      case "view":
        return "bg-green-100 text-green-800"
      case "listing":
        return "bg-purple-100 text-purple-800"
      case "system":
        return "bg-orange-100 text-orange-800"
      case "market":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "all") return true
    if (filter === "unread") return !notif.read
    return notif.type === filter
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">LoopNet</span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/properties" className="text-gray-700 hover:text-blue-600">
                  Properties
                </Link>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link href="/notifications" className="text-blue-600 font-medium">
                  Notifications
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Profile</Button>
              <Button>Sign Out</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bell className="h-8 w-8 text-blue-600" />
              Notifications
              {unreadCount > 0 && <Badge className="bg-red-600 text-white">{unreadCount} unread</Badge>}
            </h1>
            <p className="text-gray-600">Stay updated with your property activities and market insights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="unread">Unread Only</SelectItem>
              <SelectItem value="inquiry">Inquiries</SelectItem>
              <SelectItem value="view">Property Views</SelectItem>
              <SelectItem value="listing">Listings</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="market">Market Updates</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                <p className="text-gray-600">
                  {filter === "unread" ? "You're all caught up!" : "No notifications match your current filter."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  !notification.read ? "border-l-4 border-l-blue-600 bg-blue-50/30" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                            {notification.title}
                          </h3>
                          <Badge variant="outline" className={getTypeColor(notification.type)}>
                            {notification.type}
                          </Badge>
                          {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                        </div>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{new Date(notification.timestamp).toLocaleString()}</span>
                          {notification.actionUrl && (
                            <Link
                              href={notification.actionUrl}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View Details →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Notification Settings */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Property Inquiries</h4>
                  <p className="text-sm text-gray-600">Get notified when someone inquires about your properties</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4 mr-1" />
                    SMS
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Property Views</h4>
                  <p className="text-sm text-gray-600">Daily summary of property view activity</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Market Updates</h4>
                  <p className="text-sm text-gray-600">Weekly market trends and insights</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
