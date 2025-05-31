'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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
  Download
} from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { RoleGuard } from '@/components/role-guard'

// Import hooks for real data
import { useDashboardAnalytics } from '@/hooks/use-dashboard-analytics'
import { useProperties } from '@/hooks/use-properties'
import { useAuth } from '@/hooks/use-auth'

export default function AgentDashboardPage () {
  const [dateRange, setDateRange] = useState('30d')
  const [selectedProperty, setSelectedProperty] = useState('all')
  const { user } = useAuth()
  
  // Fetch real data using hooks
  const { analytics, loading: analyticsLoading } = useDashboardAnalytics(dateRange)
  const { properties, loading: propertiesLoading } = useProperties({
    limit: 5,
    sort: 'views:-1',
    agent: user?.id || '' // Use actual user ID instead of 'current'
  })

  // Prepare data for UI
  const agentStats = {
    totalListings: analytics?.totalProperties || 0,
    activeListings: analytics?.activeProperties || 0,
    totalViews: analytics?.totalViews || 0,
    totalInquiries: analytics?.totalInquiries || 0,
    conversionRate: analytics?.recentInquiries && analytics?.totalViews ? 
      ((analytics.recentInquiries / analytics.totalViews) * 100).toFixed(1) : 0,
    totalCommission: analytics?.monthlyRevenue || 0,
    avgDaysOnMarket: 45, // This could be calculated from property data
    clientSatisfaction: 4.8, // This might come from a different API
    monthlyGoal: 150000,
    goalProgress: analytics?.monthlyRevenue ? (analytics.monthlyRevenue / 150000) * 100 : 0
  }

  // Recent Activities from analytics
  const recentActivities = analytics?.recentActivities?.map(activity => ({
    id: activity.id,
    type: activity.type,
    title: activity.message,
    time: activity.time,
    priority: activity.priority,
    property: activity.user || 'Property'
  })) || []

  // Lead Pipeline - This could be from a CRM API
  const leadPipeline = [
    { stage: 'New Leads', count: 23, value: 2300000, color: 'bg-blue-500' },
    { stage: 'Qualified', count: 15, value: 1800000, color: 'bg-yellow-500' },
    {
      stage: 'Proposal Sent',
      count: 8,
      value: 1200000,
      color: 'bg-orange-500'
    },
    { stage: 'Negotiation', count: 5, value: 800000, color: 'bg-purple-500' },
    { stage: 'Closed Won', count: 3, value: 450000, color: 'bg-green-500' }
  ]

  // Top Properties Performance from real properties data
  const topProperties = properties?.map(property => ({
    id: property._id,
    title: property.title,
    address: `${property.address}, ${property.city}`,
    views: property.views || 0,
    inquiries: property.inquiries || 0,
    price: property.transactionType === 'rent' ? 
      `$${property.price}/month` : 
      `$${property.price.toLocaleString()}`,
    status: property.status,
    daysOnMarket: property.publishedAt ? 
      Math.ceil((new Date().getTime() - new Date(property.publishedAt).getTime()) / (1000 * 3600 * 24)) : 0,
    image: property.images && property.images.length > 0 ? 
      property.images[0].url : 
      '/placeholder.svg?height=80&width=120'
  })) || []

  // Upcoming Tasks
  const upcomingTasks = [
    {
      id: 1,
      title: 'Property showing with Mike Davis',
      time: 'Today, 2:00 PM',
      property: 'Downtown Office Complex',
      type: 'viewing'
    },
    {
      id: 2,
      title: 'Follow up with Sarah Johnson',
      time: 'Tomorrow, 10:00 AM',
      property: 'Retail Shopping Center',
      type: 'follow-up'
    },
    {
      id: 3,
      title: 'Prepare market analysis report',
      time: 'Friday, 9:00 AM',
      property: 'Industrial Warehouse',
      type: 'report'
    },
    {
      id: 4,
      title: 'Contract review meeting',
      time: 'Monday, 3:00 PM',
      property: 'Medical Office Building',
      type: 'meeting'
    }
  ]

  return (
    <RoleGuard requiredRole='agent' redirectTo='/pricing'>
      <div className='min-h-screen bg-background'>
        {/* Header */}
        <header className='border-b bg-white'>
          <div className='container mx-auto px-4'>
            <div className='flex items-center justify-between h-16'>
              <div className='flex items-center space-x-8'>
                <Link href='/' className='flex items-center space-x-2'>
                  <Building2 className='h-8 w-8 text-blue-600' />
                  <span className='text-2xl font-bold text-blue-600'>
                    LoopNet
                  </span>
                </Link>
                <nav className='hidden md:flex space-x-6'>
                  <Link
                    href='/agent-dashboard'
                    className='text-blue-600 font-medium'
                  >
                    Agent Dashboard
                  </Link>
                  <Link
                    href='/properties'
                    className='text-gray-700 hover:text-blue-600'
                  >
                    Properties
                  </Link>
                </nav>
              </div>

              <div className='flex items-center space-x-4'>
                <Button variant='outline' size='sm'>
                  <Plus className='h-4 w-4 mr-2' />
                  Add Property
                </Button>
                <Button size='sm'>Upgrade Plan</Button>
              </div>
            </div>
          </div>
        </header>

        <div className='container mx-auto px-4 py-8'>
          {/* Dashboard Controls */}
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
            <div>
              <h1 className='text-3xl font-bold'>Agent Dashboard</h1>
              <p className='text-gray-500'>Welcome back! Here's your performance overview</p>
            </div>

            <div className='flex flex-col sm:flex-row gap-3'>
              <Select
                value={dateRange}
                onValueChange={value => setDateRange(value)}
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Select period' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='7d'>Last 7 days</SelectItem>
                  <SelectItem value='30d'>Last 30 days</SelectItem>
                  <SelectItem value='90d'>Last 90 days</SelectItem>
                  <SelectItem value='1y'>Last year</SelectItem>
                </SelectContent>
              </Select>

              <Button variant='outline'>
                <Download className='h-4 w-4 mr-2' />
                Export Report
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-500'>
                  Total Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <div className='text-3xl font-bold'>{agentStats.totalListings}</div>
                  <div className='p-2 bg-blue-100 rounded-full'>
                    <Building2 className='h-5 w-5 text-blue-600' />
                  </div>
                </div>
                <p className='text-xs text-gray-500 mt-2'>
                  <span className='text-green-600 font-medium'>
                    {agentStats.activeListings} active
                  </span>{' '}
                  listings right now
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-500'>
                  Total Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <div className='text-3xl font-bold'>{agentStats.totalViews.toLocaleString()}</div>
                  <div className='p-2 bg-green-100 rounded-full'>
                    <Users className='h-5 w-5 text-green-600' />
                  </div>
                </div>
                <p className='text-xs text-gray-500 mt-2'>
                  <span className='text-green-600 font-medium'>+12%</span> from
                  last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-500'>
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <div className='text-3xl font-bold'>{agentStats.conversionRate}%</div>
                  <div className='p-2 bg-yellow-100 rounded-full'>
                    <TrendingUp className='h-5 w-5 text-yellow-600' />
                  </div>
                </div>
                <p className='text-xs text-gray-500 mt-2'>
                  <span className='text-green-600 font-medium'>{agentStats.totalInquiries}</span> total
                  inquiries
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-500'>
                  Commission Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <div className='text-3xl font-bold'>
                    ${agentStats.totalCommission.toLocaleString()}
                  </div>
                  <div className='p-2 bg-purple-100 rounded-full'>
                    <DollarSign className='h-5 w-5 text-purple-600' />
                  </div>
                </div>
                <div className='mt-2'>
                  <div className='flex items-center justify-between text-xs mb-1'>
                    <span>Goal: ${agentStats.monthlyGoal.toLocaleString()}</span>
                    <span className='font-medium'>
                      {Math.round(agentStats.goalProgress)}%
                    </span>
                  </div>
                  <Progress value={agentStats.goalProgress} className='h-1' />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Left Column */}
            <div className='lg:col-span-2 space-y-8'>
              {/* Lead Pipeline */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-xl'>Lead Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {leadPipeline.map(stage => (
                      <div key={stage.stage} className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center'>
                            <div
                              className={`w-3 h-3 rounded-full ${stage.color} mr-2`}
                            />
                            <span>{stage.stage}</span>
                          </div>
                          <div className='text-sm font-medium'>
                            {stage.count} leads · ${stage.value.toLocaleString()}
                          </div>
                        </div>
                        <Progress
                          value={
                            (stage.value /
                              leadPipeline.reduce(
                                (acc, curr) => acc + curr.value,
                                0
                              )) *
                            100
                          }
                          className={`h-2 ${stage.color}`}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Properties */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between'>
                  <CardTitle className='text-xl'>Top Performing Properties</CardTitle>
                  <Select
                    value={selectedProperty}
                    onValueChange={setSelectedProperty}
                  >
                    <SelectTrigger className='w-[150px]'>
                      <SelectValue placeholder='Filter' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Properties</SelectItem>
                      <SelectItem value='active'>Active Only</SelectItem>
                      <SelectItem value='pending'>Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent>
                  <div className='space-y-6'>
                    {propertiesLoading ? (
                      <div className="text-center py-4">Loading properties...</div>
                    ) : topProperties.length > 0 ? (
                      topProperties.map(property => (
                        <div
                          key={property.id}
                          className='flex items-start space-x-4 pb-4 border-b last:border-0'
                        >
                          <div className='flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden'>
                            <Image
                              src={property.image}
                              alt={property.title}
                              fill
                              className='object-cover'
                            />
                          </div>
                          <div className='flex-grow min-w-0'>
                            <div className='flex items-center justify-between'>
                              <h3 className='font-medium truncate'>
                                {property.title}
                              </h3>
                              <Badge
                                variant={
                                  property.status === 'active'
                                    ? 'default'
                                    : property.status === 'pending'
                                    ? 'secondary'
                                    : 'outline'
                                }
                              >
                                {property.status}
                              </Badge>
                            </div>
                            <div className='flex items-center text-sm text-gray-500 mt-1'>
                              <MapPin className='h-3 w-3 mr-1' />
                              <span className='truncate'>{property.address}</span>
                            </div>
                            <div className='flex items-center justify-between mt-2 text-sm'>
                              <div className='space-x-3'>
                                <span className='inline-flex items-center'>
                                  <Users className='h-3 w-3 mr-1 text-blue-500' />
                                  {property.views} views
                                </span>
                                <span className='inline-flex items-center'>
                                  <MessageSquare className='h-3 w-3 mr-1 text-green-500' />
                                  {property.inquiries} inquiries
                                </span>
                              </div>
                              <div className='font-medium'>{property.price}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">No properties found</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className='space-y-8'>
              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-xl'>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {analyticsLoading ? (
                      <div className="text-center py-4">Loading activities...</div>
                    ) : recentActivities.length > 0 ? (
                      recentActivities.map(activity => (
                        <div
                          key={activity.id}
                          className='flex items-start space-x-3 pb-4 border-b last:border-0'
                        >
                          <div
                            className={`p-2 rounded-full flex-shrink-0 ${
                              activity.type === 'inquiry'
                                ? 'bg-blue-100'
                                : activity.type === 'viewing'
                                ? 'bg-green-100'
                                : activity.type === 'offer'
                                ? 'bg-purple-100'
                                : 'bg-yellow-100'
                            }`}
                          >
                            {activity.type === 'inquiry' ? (
                              <MessageSquare
                                className='h-4 w-4 text-blue-600'
                                strokeWidth={2}
                              />
                            ) : activity.type === 'viewing' ? (
                              <Calendar
                                className='h-4 w-4 text-green-600'
                                strokeWidth={2}
                              />
                            ) : activity.type === 'offer' ? (
                              <DollarSign
                                className='h-4 w-4 text-purple-600'
                                strokeWidth={2}
                              />
                            ) : (
                              <Building2
                                className='h-4 w-4 text-yellow-600'
                                strokeWidth={2}
                              />
                            )}
                          </div>
                          <div className='flex-grow'>
                            <p className='text-sm'>{activity.title}</p>
                            <div className='flex items-center justify-between mt-1'>
                              <span className='text-xs text-gray-500'>
                                {activity.property}
                              </span>
                              <span className='text-xs text-gray-500'>
                                {activity.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">No recent activities</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-xl'>Upcoming Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {upcomingTasks.map(task => (
                      <div
                        key={task.id}
                        className='flex items-start space-x-3 pb-4 border-b last:border-0'
                      >
                        <div
                          className={`p-2 rounded-full flex-shrink-0 ${
                            task.type === 'viewing'
                              ? 'bg-blue-100'
                              : task.type === 'follow-up'
                              ? 'bg-yellow-100'
                              : task.type === 'report'
                              ? 'bg-green-100'
                              : 'bg-purple-100'
                          }`}
                        >
                          {task.type === 'viewing' ? (
                            <Users
                              className='h-4 w-4 text-blue-600'
                              strokeWidth={2}
                            />
                          ) : task.type === 'follow-up' ? (
                            <MessageSquare
                              className='h-4 w-4 text-yellow-600'
                              strokeWidth={2}
                            />
                          ) : task.type === 'report' ? (
                            <BarChart3
                              className='h-4 w-4 text-green-600'
                              strokeWidth={2}
                            />
                          ) : (
                            <Calendar
                              className='h-4 w-4 text-purple-600'
                              strokeWidth={2}
                            />
                          )}
                        </div>
                        <div className='flex-grow'>
                          <p className='text-sm font-medium'>{task.title}</p>
                          <div className='flex items-center justify-between mt-1'>
                            <span className='text-xs text-gray-500'>
                              {task.property}
                            </span>
                            <span className='text-xs flex items-center text-gray-500'>
                              <Clock className='h-3 w-3 mr-1' />
                              {task.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-xl'>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <div className='p-2 bg-blue-100 rounded-full mr-3'>
                          <Clock className='h-4 w-4 text-blue-600' />
                        </div>
                        <span>Avg. Days on Market</span>
                      </div>
                      <span className='font-medium'>{agentStats.avgDaysOnMarket} days</span>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <div className='p-2 bg-green-100 rounded-full mr-3'>
                          <Target className='h-4 w-4 text-green-600' />
                        </div>
                        <span>Closing Ratio</span>
                      </div>
                      <span className='font-medium'>32%</span>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <div className='p-2 bg-yellow-100 rounded-full mr-3'>
                          <Star className='h-4 w-4 text-yellow-600' />
                        </div>
                        <span>Client Satisfaction</span>
                      </div>
                      <div className='flex items-center'>
                        <span className='font-medium mr-1'>{agentStats.clientSatisfaction}</span>
                        <Star className='h-3 w-3 fill-yellow-500 text-yellow-500' />
                      </div>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <div className='p-2 bg-purple-100 rounded-full mr-3'>
                          <Award className='h-4 w-4 text-purple-600' />
                        </div>
                        <span>Agent Ranking</span>
                      </div>
                      <span className='font-medium'>Top 10%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}
