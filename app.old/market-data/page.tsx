import {
  TrendingUp,
  TrendingDown,
  Building2,
  MapPin,
  Calendar,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RoleGuard } from '@/components/role-guard'

export default function MarketDataPage () {
  const marketMetrics = [
    {
      title: 'Average Price per Sq Ft',
      value: '$245',
      change: '+5.2%',
      trend: 'up',
      period: 'vs last quarter'
    },
    {
      title: 'Vacancy Rate',
      value: '8.3%',
      change: '-1.1%',
      trend: 'down',
      period: 'vs last quarter'
    },
    {
      title: 'Average Days on Market',
      value: '127',
      change: '+12%',
      trend: 'up',
      period: 'vs last quarter'
    },
    {
      title: 'Total Transactions',
      value: '1,247',
      change: '+18.5%',
      trend: 'up',
      period: 'vs last quarter'
    }
  ]

  const topMarkets = [
    {
      city: 'San Francisco, CA',
      avgPrice: '$425/sq ft',
      vacancyRate: '6.2%',
      change: '+8.3%',
      trend: 'up'
    },
    {
      city: 'New York, NY',
      avgPrice: '$380/sq ft',
      vacancyRate: '7.1%',
      change: '+4.7%',
      trend: 'up'
    },
    {
      city: 'Los Angeles, CA',
      avgPrice: '$295/sq ft',
      vacancyRate: '9.4%',
      change: '+2.1%',
      trend: 'up'
    },
    {
      city: 'Seattle, WA',
      avgPrice: '$275/sq ft',
      vacancyRate: '8.8%',
      change: '-1.2%',
      trend: 'down'
    },
    {
      city: 'Austin, TX',
      avgPrice: '$185/sq ft',
      vacancyRate: '5.9%',
      change: '+12.4%',
      trend: 'up'
    }
  ]

  const recentTransactions = [
    {
      property: 'Financial District Office Tower',
      location: 'San Francisco, CA',
      price: '$45M',
      sqft: '125,000',
      pricePerSqft: '$360',
      date: '2024-01-18',
      type: 'Office'
    },
    {
      property: 'Retail Shopping Complex',
      location: 'Los Angeles, CA',
      price: '$28M',
      sqft: '85,000',
      pricePerSqft: '$329',
      date: '2024-01-15',
      type: 'Retail'
    },
    {
      property: 'Industrial Distribution Center',
      location: 'Phoenix, AZ',
      price: '$15M',
      sqft: '200,000',
      pricePerSqft: '$75',
      date: '2024-01-12',
      type: 'Industrial'
    },
    {
      property: 'Medical Office Building',
      location: 'Austin, TX',
      price: '$12M',
      sqft: '45,000',
      pricePerSqft: '$267',
      date: '2024-01-10',
      type: 'Medical'
    }
  ]

  return (
    <RoleGuard requiredRole='premium' redirectTo='/pricing'>
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
                    href='/properties'
                    className='text-gray-700 hover:text-blue-600'
                  >
                    Properties
                  </Link>
                  <Link
                    href='/market-data'
                    className='text-blue-600 font-medium'
                  >
                    Market Data
                  </Link>
                  <Link
                    href='/professionals'
                    className='text-gray-700 hover:text-blue-600'
                  >
                    Professionals
                  </Link>
                  <Link
                    href='/news'
                    className='text-gray-700 hover:text-blue-600'
                  >
                    News
                  </Link>
                </nav>
              </div>
              <div className='flex items-center space-x-4'>
                <Button variant='ghost'>Sign In</Button>
                <Button>List Property</Button>
              </div>
            </div>
          </div>
        </header>

        <div className='container mx-auto px-4 py-6'>
          {/* Page Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold mb-4'>
              Commercial Real Estate Market Data
            </h1>
            <p className='text-gray-600 mb-6'>
              Stay informed with the latest market trends, pricing data, and
              transaction insights
            </p>

            {/* Filters */}
            <div className='flex flex-wrap gap-4'>
              <Select defaultValue='all'>
                <SelectTrigger className='w-48'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Property Types</SelectItem>
                  <SelectItem value='office'>Office</SelectItem>
                  <SelectItem value='retail'>Retail</SelectItem>
                  <SelectItem value='industrial'>Industrial</SelectItem>
                  <SelectItem value='medical'>Medical</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue='national'>
                <SelectTrigger className='w-48'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='national'>National</SelectItem>
                  <SelectItem value='california'>California</SelectItem>
                  <SelectItem value='texas'>Texas</SelectItem>
                  <SelectItem value='florida'>Florida</SelectItem>
                  <SelectItem value='newyork'>New York</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue='q4-2024'>
                <SelectTrigger className='w-48'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='q4-2024'>Q4 2024</SelectItem>
                  <SelectItem value='q3-2024'>Q3 2024</SelectItem>
                  <SelectItem value='q2-2024'>Q2 2024</SelectItem>
                  <SelectItem value='q1-2024'>Q1 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Market Metrics */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            {marketMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between mb-2'>
                    <h3 className='text-sm font-medium text-gray-600'>
                      {metric.title}
                    </h3>
                    {metric.trend === 'up' ? (
                      <TrendingUp className='h-4 w-4 text-green-600' />
                    ) : (
                      <TrendingDown className='h-4 w-4 text-red-600' />
                    )}
                  </div>
                  <div className='text-2xl font-bold mb-1'>{metric.value}</div>
                  <div className='flex items-center text-sm'>
                    <span
                      className={
                        metric.trend === 'up'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {metric.change}
                    </span>
                    <span className='text-gray-500 ml-1'>{metric.period}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <Tabs defaultValue='overview' className='space-y-6'>
            <TabsList>
              <TabsTrigger value='overview'>Market Overview</TabsTrigger>
              <TabsTrigger value='transactions'>
                Recent Transactions
              </TabsTrigger>
              <TabsTrigger value='trends'>Price Trends</TabsTrigger>
              <TabsTrigger value='reports'>Market Reports</TabsTrigger>
            </TabsList>

            <TabsContent value='overview' className='space-y-6'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Top Markets */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Markets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      {topMarkets.map((market, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between p-3 border rounded-lg'
                        >
                          <div>
                            <div className='font-medium'>{market.city}</div>
                            <div className='text-sm text-gray-600'>
                              Avg: {market.avgPrice}
                            </div>
                            <div className='text-sm text-gray-600'>
                              Vacancy: {market.vacancyRate}
                            </div>
                          </div>
                          <div className='text-right'>
                            <div
                              className={`flex items-center ${
                                market.trend === 'up'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {market.trend === 'up' ? (
                                <TrendingUp className='h-4 w-4 mr-1' />
                              ) : (
                                <TrendingDown className='h-4 w-4 mr-1' />
                              )}
                              {market.change}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Market Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Price Trends by Property Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='h-64 bg-gray-100 rounded-lg flex items-center justify-center'>
                      <div className='text-center'>
                        <BarChart3 className='w-12 h-12 text-gray-400 mx-auto mb-2' />
                        <p className='text-gray-600'>
                          Interactive price trend chart
                        </p>
                        <p className='text-sm text-gray-500'>
                          Chart.js or D3.js integration
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value='transactions' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Major Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {recentTransactions.map((transaction, index) => (
                      <div key={index} className='border rounded-lg p-4'>
                        <div className='flex items-center justify-between mb-2'>
                          <div className='flex items-center gap-2'>
                            <h3 className='font-medium'>
                              {transaction.property}
                            </h3>
                            <Badge variant='outline'>{transaction.type}</Badge>
                          </div>
                          <div className='text-right'>
                            <div className='text-lg font-bold text-blue-600'>
                              {transaction.price}
                            </div>
                            <div className='text-sm text-gray-600'>
                              {transaction.pricePerSqft}/sq ft
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center justify-between text-sm text-gray-600'>
                          <div className='flex items-center gap-4'>
                            <div className='flex items-center'>
                              <MapPin className='w-4 h-4 mr-1' />
                              {transaction.location}
                            </div>
                            <div>{transaction.sqft} sq ft</div>
                          </div>
                          <div className='flex items-center'>
                            <Calendar className='w-4 h-4 mr-1' />
                            {transaction.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='trends' className='space-y-6'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Price Trends - Office</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='h-64 bg-gray-100 rounded-lg flex items-center justify-center'>
                      <div className='text-center'>
                        <TrendingUp className='w-12 h-12 text-gray-400 mx-auto mb-2' />
                        <p className='text-gray-600'>
                          Office price trend chart
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Price Trends - Retail</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='h-64 bg-gray-100 rounded-lg flex items-center justify-center'>
                      <div className='text-center'>
                        <TrendingUp className='w-12 h-12 text-gray-400 mx-auto mb-2' />
                        <p className='text-gray-600'>
                          Retail price trend chart
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value='reports' className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {[
                  {
                    title: 'Q4 2024 Market Report',
                    description:
                      'Comprehensive analysis of commercial real estate trends',
                    date: 'January 2024',
                    pages: '45 pages'
                  },
                  {
                    title: 'Office Market Outlook',
                    description:
                      'Future predictions for office space demand and pricing',
                    date: 'December 2023',
                    pages: '32 pages'
                  },
                  {
                    title: 'Industrial Real Estate Trends',
                    description:
                      'Analysis of warehouse and distribution center markets',
                    date: 'November 2023',
                    pages: '28 pages'
                  }
                ].map((report, index) => (
                  <Card key={index}>
                    <CardContent className='p-6'>
                      <h3 className='font-semibold mb-2'>{report.title}</h3>
                      <p className='text-sm text-gray-600 mb-4'>
                        {report.description}
                      </p>
                      <div className='flex justify-between items-center text-sm text-gray-500 mb-4'>
                        <span>{report.date}</span>
                        <span>{report.pages}</span>
                      </div>
                      <Button className='w-full' variant='outline'>
                        Download Report
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RoleGuard>
  )
}
