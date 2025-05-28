'use client'

import { useState } from 'react'
import {
  Users,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Filter,
  Search,
  MoreHorizontal,
  Star,
  Building2,
  DollarSign,
  Clock,
  Target,
  UserPlus
} from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { RoleGuard } from '@/components/role-guard'

export default function LeadsPage () {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')

  // Lead data with scoring and detailed information
  const leads = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@techcorp.com',
      phone: '(555) 123-4567',
      company: 'TechCorp Solutions',
      status: 'hot',
      score: 95,
      source: 'website',
      property: 'Downtown Office Complex',
      budget: '$2.5M - $3M',
      timeline: '30 days',
      lastContact: '2 hours ago',
      notes:
        'Looking for 15,000 sq ft office space. Decision maker. Ready to move quickly.',
      avatar: '/placeholder.svg?height=40&width=40',
      activities: [
        {
          type: 'email',
          date: '2 hours ago',
          description: 'Sent property brochure'
        },
        {
          type: 'call',
          date: '1 day ago',
          description: 'Initial consultation call'
        },
        {
          type: 'visit',
          date: '3 days ago',
          description: 'Website visit - property page'
        }
      ]
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'm.chen@retailgroup.com',
      phone: '(555) 234-5678',
      company: 'Retail Group Inc',
      status: 'warm',
      score: 78,
      source: 'referral',
      property: 'Shopping Center Plaza',
      budget: '$18-22/sq ft',
      timeline: '60 days',
      lastContact: '1 day ago',
      notes: 'Expanding retail chain. Needs 5,000 sq ft in high-traffic area.',
      avatar: '/placeholder.svg?height=40&width=40',
      activities: [
        {
          type: 'meeting',
          date: '1 day ago',
          description: 'Site visit scheduled'
        },
        {
          type: 'email',
          date: '3 days ago',
          description: 'Follow-up email sent'
        }
      ]
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily@startupventures.com',
      phone: '(555) 345-6789',
      company: 'Startup Ventures',
      status: 'cold',
      score: 45,
      source: 'social_media',
      property: 'Flexible Office Space',
      budget: '$25-35/sq ft',
      timeline: '90+ days',
      lastContact: '1 week ago',
      notes: 'Early stage startup. Budget constraints but growth potential.',
      avatar: '/placeholder.svg?height=40&width=40',
      activities: [
        {
          type: 'email',
          date: '1 week ago',
          description: 'Initial inquiry response'
        }
      ]
    },
    {
      id: 4,
      name: 'David Park',
      email: 'd.park@manufacturing.com',
      phone: '(555) 456-7890',
      company: 'Park Manufacturing',
      status: 'qualified',
      score: 88,
      source: 'cold_call',
      property: 'Industrial Warehouse',
      budget: '$1.8M - $2.2M',
      timeline: '45 days',
      lastContact: '3 hours ago',
      notes: 'Needs 50,000 sq ft warehouse with loading docks. Serious buyer.',
      avatar: '/placeholder.svg?height=40&width=40',
      activities: [
        {
          type: 'call',
          date: '3 hours ago',
          description: 'Negotiation discussion'
        },
        {
          type: 'meeting',
          date: '2 days ago',
          description: 'Property tour completed'
        },
        { type: 'email', date: '5 days ago', description: 'Proposal sent' }
      ]
    }
  ]

  // Lead statistics
  const leadStats = {
    total: leads.length,
    hot: leads.filter(l => l.status === 'hot').length,
    warm: leads.filter(l => l.status === 'warm').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    cold: leads.filter(l => l.status === 'cold').length,
    avgScore: Math.round(
      leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length
    ),
    totalValue: '$8.3M',
    conversionRate: '12.5%'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot':
        return 'bg-red-100 text-red-800'
      case 'warm':
        return 'bg-orange-100 text-orange-800'
      case 'qualified':
        return 'bg-green-100 text-green-800'
      case 'cold':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter
    return matchesSearch && matchesStatus && matchesSource
  })

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
                  <Link href='/leads' className='text-blue-600 font-medium'>
                    Leads
                  </Link>
                  <Link
                    href='/properties'
                    className='text-gray-700 hover:text-blue-600'
                  >
                    Properties
                  </Link>
                  <Link
                    href='/analytics'
                    className='text-gray-700 hover:text-blue-600'
                  >
                    Analytics
                  </Link>
                </nav>
              </div>
              <div className='flex items-center space-x-4'>
                <Button>
                  <UserPlus className='h-4 w-4 mr-2' />
                  Add Lead
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className='container mx-auto px-4 py-6'>
          {/* Page Header */}
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h1 className='text-3xl font-bold'>Lead Management</h1>
              <p className='text-gray-600'>
                Track and manage your sales pipeline
              </p>
            </div>
          </div>

          {/* Lead Statistics */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Total Leads
                    </p>
                    <p className='text-2xl font-bold'>{leadStats.total}</p>
                    <p className='text-xs text-green-600'>+8 this week</p>
                  </div>
                  <Users className='h-8 w-8 text-blue-600' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Hot Leads
                    </p>
                    <p className='text-2xl font-bold'>{leadStats.hot}</p>
                    <p className='text-xs text-red-600'>High priority</p>
                  </div>
                  <Target className='h-8 w-8 text-red-600' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Pipeline Value
                    </p>
                    <p className='text-2xl font-bold'>{leadStats.totalValue}</p>
                    <p className='text-xs text-green-600'>+15% this month</p>
                  </div>
                  <DollarSign className='h-8 w-8 text-green-600' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>
                      Conversion Rate
                    </p>
                    <p className='text-2xl font-bold'>
                      {leadStats.conversionRate}
                    </p>
                    <p className='text-xs text-orange-600'>Industry avg: 8%</p>
                  </div>
                  <TrendingUp className='h-8 w-8 text-orange-600' />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className='mb-6'>
            <CardContent className='p-6'>
              <div className='flex flex-col md:flex-row gap-4'>
                <div className='flex-1'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                    <Input
                      placeholder='Search leads by name, company, or email...'
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                      className='pl-10'
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className='w-40'>
                    <SelectValue placeholder='Status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Status</SelectItem>
                    <SelectItem value='hot'>Hot</SelectItem>
                    <SelectItem value='warm'>Warm</SelectItem>
                    <SelectItem value='qualified'>Qualified</SelectItem>
                    <SelectItem value='cold'>Cold</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className='w-40'>
                    <SelectValue placeholder='Source' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Sources</SelectItem>
                    <SelectItem value='website'>Website</SelectItem>
                    <SelectItem value='referral'>Referral</SelectItem>
                    <SelectItem value='cold_call'>Cold Call</SelectItem>
                    <SelectItem value='social_media'>Social Media</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant='outline'>
                  <Filter className='h-4 w-4 mr-2' />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Leads List */}
          <Tabs defaultValue='list' className='space-y-6'>
            <TabsList>
              <TabsTrigger value='list'>List View</TabsTrigger>
              <TabsTrigger value='kanban'>Kanban Board</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value='list' className='space-y-4'>
              {filteredLeads.map(lead => (
                <Card
                  key={lead.id}
                  className='hover:shadow-md transition-shadow'
                >
                  <CardContent className='p-6'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4 flex-1'>
                        <Avatar className='h-12 w-12'>
                          <AvatarImage
                            src={lead.avatar || '/placeholder.svg'}
                            alt={lead.name}
                          />
                          <AvatarFallback>
                            {lead.name
                              .split(' ')
                              .map(n => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>

                        <div className='flex-1'>
                          <div className='flex items-center gap-3 mb-2'>
                            <h3 className='font-semibold text-lg'>
                              {lead.name}
                            </h3>
                            <Badge className={getStatusColor(lead.status)}>
                              {lead.status.toUpperCase()}
                            </Badge>
                            <div className='flex items-center gap-1'>
                              <Star className='h-4 w-4 text-yellow-500' />
                              <span
                                className={`font-semibold ${getScoreColor(
                                  lead.score
                                )}`}
                              >
                                {lead.score}
                              </span>
                            </div>
                          </div>

                          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600'>
                            <div>
                              <p className='font-medium'>{lead.company}</p>
                              <p className='flex items-center gap-1'>
                                <Mail className='h-3 w-3' />
                                {lead.email}
                              </p>
                            </div>
                            <div>
                              <p className='font-medium'>Property Interest</p>
                              <p>{lead.property}</p>
                            </div>
                            <div>
                              <p className='font-medium'>Budget</p>
                              <p>{lead.budget}</p>
                            </div>
                            <div>
                              <p className='font-medium'>Timeline</p>
                              <p>{lead.timeline}</p>
                            </div>
                          </div>

                          <div className='mt-3 flex items-center gap-4 text-sm'>
                            <span className='flex items-center gap-1 text-gray-500'>
                              <Clock className='h-3 w-3' />
                              Last contact: {lead.lastContact}
                            </span>
                            <span className='text-gray-400'>•</span>
                            <span className='text-gray-600'>{lead.notes}</span>
                          </div>
                        </div>
                      </div>

                      <div className='flex items-center gap-2'>
                        <Button size='sm' variant='outline'>
                          <Phone className='h-4 w-4 mr-1' />
                          Call
                        </Button>
                        <Button size='sm' variant='outline'>
                          <Mail className='h-4 w-4 mr-1' />
                          Email
                        </Button>
                        <Button size='sm' variant='outline'>
                          <Calendar className='h-4 w-4 mr-1' />
                          Schedule
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size='sm' variant='outline'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                            <DropdownMenuItem>Add Note</DropdownMenuItem>
                            <DropdownMenuItem>
                              Convert to Client
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value='kanban' className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                {['cold', 'warm', 'hot', 'qualified'].map(status => (
                  <Card key={status}>
                    <CardHeader>
                      <CardTitle className='flex items-center justify-between'>
                        <span className='capitalize'>{status} Leads</span>
                        <Badge variant='outline'>
                          {leads.filter(l => l.status === status).length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-3'>
                      {leads
                        .filter(lead => lead.status === status)
                        .map(lead => (
                          <Card
                            key={lead.id}
                            className='p-3 cursor-pointer hover:shadow-md transition-shadow'
                          >
                            <div className='space-y-2'>
                              <div className='flex items-center justify-between'>
                                <h4 className='font-medium text-sm'>
                                  {lead.name}
                                </h4>
                                <span
                                  className={`text-xs font-semibold ${getScoreColor(
                                    lead.score
                                  )}`}
                                >
                                  {lead.score}
                                </span>
                              </div>
                              <p className='text-xs text-gray-600'>
                                {lead.company}
                              </p>
                              <p className='text-xs text-gray-500'>
                                {lead.budget}
                              </p>
                            </div>
                          </Card>
                        ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value='analytics' className='space-y-6'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      {[
                        { source: 'Website', count: 12, percentage: 40 },
                        { source: 'Referrals', count: 8, percentage: 27 },
                        { source: 'Cold Calls', count: 6, percentage: 20 },
                        { source: 'Social Media', count: 4, percentage: 13 }
                      ].map(item => (
                        <div
                          key={item.source}
                          className='flex items-center justify-between'
                        >
                          <span className='text-sm'>{item.source}</span>
                          <div className='flex items-center gap-2'>
                            <div className='w-20 bg-gray-200 rounded-full h-2'>
                              <div
                                className='bg-blue-600 h-2 rounded-full'
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                            <span className='text-sm font-medium'>
                              {item.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Funnel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      {[
                        {
                          stage: 'Initial Contact',
                          count: 30,
                          percentage: 100
                        },
                        { stage: 'Qualified', count: 18, percentage: 60 },
                        { stage: 'Proposal Sent', count: 12, percentage: 40 },
                        { stage: 'Negotiation', count: 6, percentage: 20 },
                        { stage: 'Closed Won', count: 3, percentage: 10 }
                      ].map(item => (
                        <div
                          key={item.stage}
                          className='flex items-center justify-between'
                        >
                          <span className='text-sm'>{item.stage}</span>
                          <div className='flex items-center gap-2'>
                            <div className='w-20 bg-gray-200 rounded-full h-2'>
                              <div
                                className='bg-green-600 h-2 rounded-full'
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                            <span className='text-sm font-medium'>
                              {item.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RoleGuard>
  )
}
