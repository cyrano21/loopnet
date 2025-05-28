"use client"

import { RoleGuard } from "@/components/role-guard"
import { useState } from "react"
import {
  Building2,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  MessageSquare,
  Target,
  Award,
  BarChart3,
  Clock,
  MapPin,
  Star,
  Download,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

function AgentDashboardContent() {
  const [dateRange, setDateRange] = useState("30d")
  const [selectedProperty, setSelectedProperty] = useState("all")

  // Agent Performance Metrics
  const agentStats = {
    totalListings: 24,
    activeListings: 18,
    totalViews: 12847,
    totalInquiries: 247,
    conversionRate: 7.2,
    totalCommission: 125000,
    avgDaysOnMarket: 45,
    clientSatisfaction: 4.8,
    monthlyGoal: 150000,
    goalProgress: 83.3,
  }

  // Recent Activities
  const recentActivities = [
    {
      id: 1,
      type: "inquiry",
      title: "New inquiry from Sarah Johnson",
      property: "Downtown Office Complex",
      time: "2 hours ago",
      priority: "high",
    },
    {
      id: 2,
      type: "viewing",
      title: "Property viewing scheduled",
      property: "Retail Shopping Center",
      time: "4 hours ago",
      priority: "medium",
    },
    {
      id: 3,
      type: "offer",
      title: "Offer received - $2.3M",
      property: "Industrial Warehouse",
      time: "1 day ago",
      priority: "high",
    },
    {
      id: 4,
      type: "listing",
      title: "New listing approved",
      property: "Medical Office Building",
      time: "2 days ago",
      priority: "low",
    },
  ]

  // Lead Pipeline
  const leadPipeline = [
    { stage: "New Leads", count: 23, value: 2300000, color: "bg-blue-500" },
    { stage: "Qualified", count: 15, value: 1800000, color: "bg-yellow-500" },
    { stage: "Proposal Sent", count: 8, value: 1200000, color: "bg-orange-500" },
    { stage: "Negotiation", count: 5, value: 800000, color: "bg-purple-500" },
    { stage: "Closed Won", count: 3, value: 450000, color: "bg-green-500" },
  ]

  // Top Properties Performance
  const topProperties = [
    {
      id: 1,
      title: "Downtown Office Complex",
      address: "123 Business St, San Francisco",
      views: 1247,
      inquiries: 23,
      price: "$2,500,000",
      status: "Active",
      daysOnMarket: 15,
      image: "/placeholder.svg?height=80&width=120",
    },
    {
      id: 2,
      title: "Retail Shopping Center",
      address: "456 Commerce Ave, Los Angeles",
      views: 892,
      inquiries: 18,
      price: "$18/sq ft/year",
      status: "Active",
      daysOnMarket: 8,
      image: "/placeholder.svg?height=80&width=120",
    },
    {
      id: 3,
      title: "Industrial Warehouse",
      address: "789 Industrial Blvd, Phoenix",
      views: 634,
      inquiries: 12,
      price: "$1,800,000",
      status: "Under Contract",
      daysOnMarket: 32,
      image: "/placeholder.svg?height=80&width=120",
    },
  ]

  // Upcoming Tasks
  const upcomingTasks = [
    {
      id: 1,
      title: "Property showing with Mike Davis",
      time: "Today, 2:00 PM",
      property: "Downtown Office Complex",
      type: "viewing",
    },
    {
      id: 2,
      title: "Follow up with Sarah Johnson",
      time: "Tomorrow, 10:00 AM",
      property: "Retail Shopping Center",
      type: "follow-up",
    },
    {
      id: 3,
      title: "Prepare market analysis report",
      time: "Friday, 9:00 AM",
      property: "Industrial Warehouse",
      type: "report",
    },
    {
      id: 4,
      title: "Contract review meeting",
      time: "Monday, 3:00 PM",
      property: "Medical Office Building",
      type: "meeting",
    },
  ]

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
                <Link href="/agent-dashboard" className="text-blue-600 font-medium">
                  Agent Dashboard
                </Link>
                <Link href="/properties" className="text-gray-700 hover:text-blue-600">
                  Properties
                </Link>
                <Link href="/leads" className="text-gray-700 hover:text-blue-600">
                  Leads
                </Link>
                <Link href="/analytics" className="text-gray-700 hover:text-blue-600">
                  Analytics
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Listing
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Agent Dashboard</h1>
            <p className="text-gray-600">Welcome back, John Smith - Track your performance and manage your listings</p>
          </div>
          <div className="flex gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold">{agentStats.activeListings}</p>
                  <p className="text-xs text-gray-500">of {agentStats.totalListings} total</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                  <p className="text-2xl font-bold">{agentStats.totalInquiries}</p>
                  <p className="text-xs text-green-600">+15.3% from last month</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Commission Earned</p>
                  <p className="text-2xl font-bold">${agentStats.totalCommission.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+23.1% from last month</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold">{agentStats.conversionRate}%</p>
                  <p className="text-xs text-orange-600">-2.1% from last month</p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Goal Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Monthly Goal Progress</span>
              <Badge className="bg-green-100 text-green-800">
                ${agentStats.totalCommission.toLocaleString()} / ${agentStats.monthlyGoal.toLocaleString()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress: {agentStats.goalProgress}%</span>
                <span>${(agentStats.monthlyGoal - agentStats.totalCommission).toLocaleString()} remaining</span>
              </div>
              <Progress value={agentStats.goalProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leads">Lead Pipeline</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="tasks">Tasks & Calendar</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activities */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              activity.priority === "high"
                                ? "bg-red-500"
                                : activity.priority === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                          />
                          <div>
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-gray-600">{activity.property}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{activity.time}</p>
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg. Days on Market</span>
                    <span className="font-semibold">{agentStats.avgDaysOnMarket} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Client Satisfaction</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{agentStats.clientSatisfaction}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Views</span>
                    <span className="font-semibold">{agentStats.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="font-semibold">2.3 hours</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {leadPipeline.map((stage, index) => (
                    <Card key={index} className="border-2">
                      <CardContent className="p-4">
                        <div className={`w-full h-2 ${stage.color} rounded-full mb-3`} />
                        <h3 className="font-semibold text-sm mb-2">{stage.stage}</h3>
                        <div className="space-y-1">
                          <p className="text-2xl font-bold">{stage.count}</p>
                          <p className="text-xs text-gray-600">${(stage.value / 1000000).toFixed(1)}M value</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProperties.map((property) => (
                    <div key={property.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={property.image || "/placeholder.svg"}
                          alt={property.title}
                          className="w-20 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{property.title}</h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {property.address}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span>Views: {property.views}</span>
                            <span>Inquiries: {property.inquiries}</span>
                            <span>Days: {property.daysOnMarket}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{property.price}</p>
                          <Badge
                            className={
                              property.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : property.status === "Under Contract"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          >
                            {property.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-gray-600">{task.property}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{task.time}</p>
                          <Badge variant="outline" className="text-xs">
                            {task.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Calendar Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Calendar view</p>
                      <p className="text-sm text-gray-500">Google Calendar integration</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Performance chart</p>
                      <p className="text-sm text-gray-500">Monthly trends and analytics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Achievement Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Award className="h-8 w-8 text-gold-500 mx-auto mb-2" />
                      <p className="font-semibold text-sm">Top Performer</p>
                      <p className="text-xs text-gray-600">This Month</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Star className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <p className="font-semibold text-sm">5-Star Rating</p>
                      <p className="text-xs text-gray-600">Client Reviews</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="font-semibold text-sm">Growth Leader</p>
                      <p className="text-xs text-gray-600">Q4 2024</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <p className="font-semibold text-sm">Goal Achiever</p>
                      <p className="text-xs text-gray-600">3 Months</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function AgentDashboardPage() {
  return (
    <RoleGuard allowedRoles={["admin", "agent"]} redirectTo="/pricing?upgrade=agent">
      <AgentDashboardContent />
    </RoleGuard>
  )
}
