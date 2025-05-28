'use client'

import { useState } from 'react'
import {
  DollarSign,
  TrendingUp,
  FileText,
  Download,
  Building2,
  Target,
  Award,
  Clock,
  CheckCircle,
  AlertCircle
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

// Default commission data structure
const defaultCommissionData = {
  earned: 0,
  pending: 0,
  projected: 0,
  goal: 50000
}

export default function CommissionTrackerPage () {
  const [timeframe, setTimeframe] = useState('current_month')

  // Commission data with fallbacks
  const commissionData = {
    current_month: {
      earned: 45000,
      pending: 23000,
      projected: 68000,
      goal: 75000
    },
    ytd: {
      earned: 425000,
      pending: 89000,
      projected: 514000,
      goal: 600000
    },
    last_month: {
      earned: 52000,
      pending: 0,
      projected: 52000,
      goal: 50000
    }
  }

  // Recent transactions
  const transactions = [
    {
      id: 1,
      property: 'Downtown Office Complex',
      client: 'TechCorp Solutions',
      salePrice: 2500000,
      commissionRate: 2.5,
      commissionAmount: 62500,
      status: 'paid',
      closingDate: '2024-01-15',
      paymentDate: '2024-01-20',
      type: 'sale'
    },
    {
      id: 2,
      property: 'Retail Shopping Center',
      client: 'Retail Group Inc',
      salePrice: 1800000,
      commissionRate: 3.0,
      commissionAmount: 54000,
      status: 'pending',
      closingDate: '2024-01-28',
      paymentDate: null,
      type: 'sale'
    },
    {
      id: 3,
      property: 'Industrial Warehouse',
      client: 'Park Manufacturing',
      salePrice: 0, // Lease
      monthlyRent: 15000,
      commissionRate: 6.0, // 6 months rent
      commissionAmount: 90000,
      status: 'pending',
      closingDate: '2024-02-01',
      paymentDate: null,
      type: 'lease'
    },
    {
      id: 4,
      property: 'Medical Office Building',
      client: 'Healthcare Partners',
      salePrice: 3200000,
      commissionRate: 2.0,
      commissionAmount: 64000,
      status: 'processing',
      closingDate: '2024-01-10',
      paymentDate: null,
      type: 'sale'
    }
  ]

  // Commission goals and achievements
  const achievements = [
    {
      title: 'Top Performer Q4',
      description: 'Exceeded quarterly goal by 125%',
      icon: Award,
      color: 'text-yellow-600',
      earned: true
    },
    {
      title: 'Million Dollar Club',
      description: 'Generated $1M+ in commissions this year',
      icon: Target,
      color: 'text-purple-600',
      earned: true
    },
    {
      title: 'Consistency Award',
      description: 'Met monthly goals for 6 consecutive months',
      icon: TrendingUp,
      color: 'text-green-600',
      earned: false,
      progress: 83
    },
    {
      title: 'Client Satisfaction',
      description: 'Maintained 4.8+ star rating',
      icon: CheckCircle,
      color: 'text-blue-600',
      earned: true
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Safe data access with fallback
  const currentData =
    commissionData[timeframe as keyof typeof commissionData] ||
    defaultCommissionData
  const goalProgress =
    currentData.goal > 0 ? (currentData.earned / currentData.goal) * 100 : 0

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
                    className='text-gray-700 hover:text-blue-600'
                  >
                    Dashboard
                  </Link>
                  <Link
                    href='/commission-tracker'
                    className='text-blue-600 font-medium'
                  >
                    Commissions
                  </Link>
                  <Link
                    href='/leads'
                    className='text-gray-700 hover:text-blue-600'
                  >
                    Leads
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
                <Button variant='outline'>
                  <Download className='h-4 w-4 mr-2' />
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className='container mx-auto px-4 py-6'>
          {/* Page Header */}
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h1 className='text-3xl font-bold'>Commission Tracker</h1>
              <p className='text-gray-600'>
                Track your earnings, goals, and payment status
              </p>
            </div>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className='w-48'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='current_month'>Current Month</SelectItem>
                <SelectItem value='last_month'>Last Month</SelectItem>
                <SelectItem value='ytd'>Year to Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Commission Overview */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Earned</p>
                    <p className='text-2xl font-bold'>
                      ${(currentData.earned || 0).toLocaleString()}
                    </p>
                    <p className='text-xs text-green-600'>Paid commissions</p>
                  </div>
                  <DollarSign className='h-8 w-8 text-green-600' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Pending</p>
                    <p className='text-2xl font-bold'>
                      ${(currentData.pending || 0).toLocaleString()}
                    </p>
                    <p className='text-xs text-yellow-600'>Awaiting payment</p>
                  </div>
                  <Clock className='h-8 w-8 text-yellow-600' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Projected
                    </p>
                    <p className='text-2xl font-bold'>
                      ${(currentData.projected || 0).toLocaleString()}
                    </p>
                    <p className='text-xs text-blue-600'>Total expected</p>
                  </div>
                  <TrendingUp className='h-8 w-8 text-blue-600' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Goal Progress
                    </p>
                    <p className='text-2xl font-bold'>
                      {goalProgress.toFixed(1)}%
                    </p>
                    <p className='text-xs text-purple-600'>
                      ${(currentData.goal || 0).toLocaleString()} goal
                    </p>
                  </div>
                  <Target className='h-8 w-8 text-purple-600' />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goal Progress */}
          <Card className='mb-8'>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <span>Goal Progress</span>
                <Badge
                  className={
                    goalProgress >= 100
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }
                >
                  ${(currentData.earned || 0).toLocaleString()} / $
                  {(currentData.goal || 0).toLocaleString()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span>Progress: {goalProgress.toFixed(1)}%</span>
                  <span>
                    $
                    {Math.max(
                      0,
                      (currentData.goal || 0) - (currentData.earned || 0)
                    ).toLocaleString()}{' '}
                    remaining
                  </span>
                </div>
                <Progress value={Math.min(100, goalProgress)} className='h-3' />
                {goalProgress >= 100 && (
                  <p className='text-sm text-green-600 font-medium'>
                    🎉 Congratulations! You've exceeded your goal!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Tabs defaultValue='transactions' className='space-y-6'>
            <TabsList>
              <TabsTrigger value='transactions'>Transactions</TabsTrigger>
              <TabsTrigger value='achievements'>Achievements</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              <TabsTrigger value='tax-docs'>Tax Documents</TabsTrigger>
            </TabsList>

            <TabsContent value='transactions' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {transactions.map(transaction => (
                      <div
                        key={transaction.id}
                        className='border rounded-lg p-4'
                      >
                        <div className='flex items-center justify-between mb-3'>
                          <div>
                            <h3 className='font-semibold'>
                              {transaction.property}
                            </h3>
                            <p className='text-sm text-gray-600'>
                              {transaction.client}
                            </p>
                          </div>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status.toUpperCase()}
                          </Badge>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 text-sm'>
                          <div>
                            <p className='font-medium text-gray-700'>
                              Transaction Type
                            </p>
                            <p className='capitalize'>{transaction.type}</p>
                          </div>
                          <div>
                            <p className='font-medium text-gray-700'>
                              {transaction.type === 'sale'
                                ? 'Sale Price'
                                : 'Monthly Rent'}
                            </p>
                            <p>
                              {transaction.type === 'sale'
                                ? `$${transaction.salePrice.toLocaleString()}`
                                : `$${transaction.monthlyRent?.toLocaleString()}/month`}
                            </p>
                          </div>
                          <div>
                            <p className='font-medium text-gray-700'>
                              Commission
                            </p>
                            <p className='font-semibold text-green-600'>
                              ${transaction.commissionAmount.toLocaleString()}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {transaction.commissionRate}% rate
                            </p>
                          </div>
                          <div>
                            <p className='font-medium text-gray-700'>
                              Closing Date
                            </p>
                            <p>
                              {new Date(
                                transaction.closingDate
                              ).toLocaleDateString()}
                            </p>
                            {transaction.paymentDate && (
                              <p className='text-xs text-gray-500'>
                                Paid:{' '}
                                {new Date(
                                  transaction.paymentDate
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='achievements' className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {achievements.map((achievement, index) => (
                  <Card
                    key={index}
                    className={`border-2 ${
                      achievement.earned
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <CardContent className='p-6'>
                      <div className='flex items-center gap-4 mb-4'>
                        <achievement.icon
                          className={`h-10 w-10 ${achievement.color}`}
                        />
                        <div className='flex-1'>
                          <h3 className='font-semibold text-lg'>
                            {achievement.title}
                          </h3>
                          <p className='text-gray-600 text-sm'>
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.earned ? (
                          <CheckCircle className='h-6 w-6 text-green-600' />
                        ) : (
                          <AlertCircle className='h-6 w-6 text-gray-400' />
                        )}
                      </div>

                      {!achievement.earned && achievement.progress && (
                        <div className='space-y-2'>
                          <div className='flex justify-between text-sm'>
                            <span>Progress</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <Progress
                            value={achievement.progress}
                            className='h-2'
                          />
                        </div>
                      )}

                      {achievement.earned && (
                        <Badge className='bg-green-100 text-green-800'>
                          ✓ Achieved
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value='analytics' className='space-y-6'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Commission Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='h-64 bg-gray-100 rounded-lg flex items-center justify-center'>
                      <div className='text-center'>
                        <TrendingUp className='w-12 h-12 text-gray-400 mx-auto mb-2' />
                        <p className='text-gray-600'>Commission trend chart</p>
                        <p className='text-sm text-gray-500'>
                          Monthly performance over time
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Commission by Property Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      {[
                        { type: 'Office', amount: 185000, percentage: 45 },
                        { type: 'Retail', amount: 123000, percentage: 30 },
                        { type: 'Industrial', amount: 82000, percentage: 20 },
                        { type: 'Mixed Use', amount: 21000, percentage: 5 }
                      ].map(item => (
                        <div
                          key={item.type}
                          className='flex items-center justify-between'
                        >
                          <span className='text-sm font-medium'>
                            {item.type}
                          </span>
                          <div className='flex items-center gap-3'>
                            <div className='w-24 bg-gray-200 rounded-full h-2'>
                              <div
                                className='bg-blue-600 h-2 rounded-full'
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                            <span className='text-sm font-semibold w-20 text-right'>
                              ${item.amount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value='tax-docs' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Tax Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {[
                      {
                        year: '2024',
                        type: '1099-MISC',
                        status: 'Available',
                        date: '2024-01-31'
                      },
                      {
                        year: '2023',
                        type: '1099-MISC',
                        status: 'Available',
                        date: '2023-01-31'
                      },
                      {
                        year: '2023',
                        type: 'Commission Summary',
                        status: 'Available',
                        date: '2023-12-31'
                      },
                      {
                        year: '2022',
                        type: '1099-MISC',
                        status: 'Available',
                        date: '2022-01-31'
                      }
                    ].map((doc, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between p-4 border rounded-lg'
                      >
                        <div className='flex items-center gap-3'>
                          <FileText className='h-8 w-8 text-blue-600' />
                          <div>
                            <h4 className='font-medium'>
                              {doc.type} - {doc.year}
                            </h4>
                            <p className='text-sm text-gray-600'>
                              Generated: {doc.date}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center gap-3'>
                          <Badge className='bg-green-100 text-green-800'>
                            {doc.status}
                          </Badge>
                          <Button size='sm' variant='outline'>
                            <Download className='h-4 w-4 mr-1' />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RoleGuard>
  )
}
