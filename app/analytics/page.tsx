"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Eye, Users, DollarSign, Building2, Calendar, BarChart3 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d")
  const [propertyFilter, setPropertyFilter] = useState("all")

  const overviewStats = [
    {
      title: "Total Views",
      value: "12,847",
      change: "+15.3%",
      trend: "up",
      icon: Eye,
      color: "text-blue-600",
    },
    {
      title: "Unique Visitors",
      value: "3,421",
      change: "+8.7%",
      trend: "up",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Inquiries",
      value: "247",
      change: "+23.1%",
      trend: "up",
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      title: "Conversion Rate",
      value: "7.2%",
      change: "-2.1%",
      trend: "down",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  const topProperties = [
    {
      id: 1,
      title: "Downtown Office Complex",
      views: 1247,
      inquiries: 23,
      conversionRate: "1.8%",
      revenue: "$45,000",
      trend: "up",
    },
    {
      id: 2,
      title: "Retail Shopping Center",
      views: 892,
      inquiries: 18,
      conversionRate: "2.0%",
      revenue: "$32,000",
      trend: "up",
    },
    {
      id: 3,
      title: "Industrial Warehouse",
      views: 634,
      inquiries: 12,
      conversionRate: "1.9%",
      revenue: "$28,000",
      trend: "down",
    },
    {
      id: 4,
      title: "Medical Office Building",
      views: 523,
      inquiries: 15,
      conversionRate: "2.9%",
      revenue: "$35,000",
      trend: "up",
    },
  ]

  const trafficSources = [
    { source: "Direct", visitors: 1247, percentage: 36.4 },
    { source: "Google Search", visitors: 892, percentage: 26.1 },
    { source: "Social Media", visitors: 634, percentage: 18.5 },
    { source: "Email", visitors: 423, percentage: 12.4 },
    { source: "Referrals", visitors: 225, percentage: 6.6 },
  ]

  const inquiryTrends = [
    { month: "Jan", inquiries: 45, conversions: 8 },
    { month: "Feb", inquiries: 52, conversions: 12 },
    { month: "Mar", inquiries: 48, conversions: 9 },
    { month: "Apr", inquiries: 61, conversions: 15 },
    { month: "May", inquiries: 58, conversions: 13 },
    { month: "Jun", inquiries: 67, conversions: 18 },
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
                <Link href="/properties" className="text-gray-700 hover:text-blue-600">
                  Properties
                </Link>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link href="/analytics" className="text-blue-600 font-medium">
                  Analytics
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
              <BarChart3 className="h-8 w-8 text-blue-600" />
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">Track your property performance and market insights</p>
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
            <Select value={propertyFilter} onValueChange={setPropertyFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                    </div>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Property Performance</TabsTrigger>
            <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiry Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Views Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Views Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Views trend chart</p>
                      <p className="text-sm text-gray-500">Chart.js integration</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conversion Funnel */}
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Property Views</span>
                      <span className="text-lg font-bold">12,847</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Detail Page Views</span>
                      <span className="text-lg font-bold">3,421</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">Contact Inquiries</span>
                      <span className="text-lg font-bold">247</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium">Qualified Leads</span>
                      <span className="text-lg font-bold">89</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{property.title}</h3>
                        <Badge
                          className={
                            property.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }
                        >
                          {property.trend === "up" ? "↗" : "↘"} Trending {property.trend}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Views</div>
                          <div className="font-semibold">{property.views.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Inquiries</div>
                          <div className="font-semibold">{property.inquiries}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Conversion</div>
                          <div className="font-semibold">{property.conversionRate}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Revenue</div>
                          <div className="font-semibold">{property.revenue}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trafficSources.map((source, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          <span className="font-medium">{source.source}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{source.visitors.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">{source.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Geographic map</p>
                      <p className="text-sm text-gray-500">Map visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inquiries" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inquiry Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Inquiry trend chart</p>
                      <p className="text-sm text-gray-500">Monthly inquiry analysis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inquiry Response Times</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Average Response Time</span>
                      <span className="font-bold text-green-600">2.3 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Response Rate</span>
                      <span className="font-bold text-blue-600">94.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Follow-up Rate</span>
                      <span className="font-bold text-purple-600">78.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Conversion to Meeting</span>
                      <span className="font-bold text-orange-600">36.1%</span>
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
