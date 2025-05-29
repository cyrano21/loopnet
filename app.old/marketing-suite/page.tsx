'use client'

import { useState } from 'react'
import {
  Camera,
  FileText,
  Share2,
  Download,
  Eye,
  Building2,
  Palette,
  Mail,
  BarChart3,
  Target,
  Zap
} from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { RoleGuard } from '@/components/role-guard'

export default function MarketingSuitePage () {
  const [selectedProperty, setSelectedProperty] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')

  // Marketing materials data
  const marketingMaterials = [
    {
      id: 1,
      name: 'Premium Brochure',
      type: 'brochure',
      property: 'Downtown Office Complex',
      status: 'ready',
      downloads: 45,
      views: 234,
      createdDate: '2024-01-15',
      thumbnail: '/placeholder.svg?height=120&width=160'
    },
    {
      id: 2,
      name: 'Virtual Tour',
      type: 'virtual_tour',
      property: 'Retail Shopping Center',
      status: 'processing',
      downloads: 0,
      views: 0,
      createdDate: '2024-01-20',
      thumbnail: '/placeholder.svg?height=120&width=160'
    },
    {
      id: 3,
      name: 'Social Media Package',
      type: 'social_media',
      property: 'Industrial Warehouse',
      status: 'ready',
      downloads: 23,
      views: 156,
      createdDate: '2024-01-18',
      thumbnail: '/placeholder.svg?height=120&width=160'
    },
    {
      id: 4,
      name: 'Email Campaign',
      type: 'email',
      property: 'Medical Office Building',
      status: 'sent',
      downloads: 0,
      views: 89,
      createdDate: '2024-01-12',
      thumbnail: '/placeholder.svg?height=120&width=160'
    }
  ]

  // Template options
  const templates = {
    brochure: [
      {
        id: 'modern',
        name: 'Modern Professional',
        preview: '/placeholder.svg?height=200&width=150'
      },
      {
        id: 'classic',
        name: 'Classic Elegant',
        preview: '/placeholder.svg?height=200&width=150'
      },
      {
        id: 'minimal',
        name: 'Minimal Clean',
        preview: '/placeholder.svg?height=200&width=150'
      }
    ],
    flyer: [
      {
        id: 'bold',
        name: 'Bold Impact',
        preview: '/placeholder.svg?height=200&width=150'
      },
      {
        id: 'corporate',
        name: 'Corporate Style',
        preview: '/placeholder.svg?height=200&width=150'
      },
      {
        id: 'creative',
        name: 'Creative Design',
        preview: '/placeholder.svg?height=200&width=150'
      }
    ],
    social: [
      {
        id: 'instagram',
        name: 'Instagram Story',
        preview: '/placeholder.svg?height=200&width=150'
      },
      {
        id: 'linkedin',
        name: 'LinkedIn Post',
        preview: '/placeholder.svg?height=200&width=150'
      },
      {
        id: 'facebook',
        name: 'Facebook Ad',
        preview: '/placeholder.svg?height=200&width=150'
      }
    ]
  }

  // Campaign performance data
  const campaignStats = {
    totalViews: 1247,
    totalDownloads: 89,
    emailOpens: 234,
    clickThrough: 45,
    socialShares: 67,
    leadGenerated: 12
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'brochure':
        return FileText
      case 'virtual_tour':
        return Camera
      case 'social_media':
        return Share2
      case 'email':
        return Mail
      default:
        return FileText
    }
  }

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
                    href='/marketing-suite'
                    className='text-blue-600 font-medium'
                  >
                    Marketing Suite
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
                <Badge className='bg-gradient-to-r from-purple-600 to-pink-600 text-white'>
                  <Zap className='h-3 w-3 mr-1' />
                  AI Powered
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <div className='container mx-auto px-4 py-6'>
          {/* Page Header */}
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h1 className='text-3xl font-bold'>Marketing Suite</h1>
              <p className='text-gray-600'>
                Create professional marketing materials with AI assistance
              </p>
            </div>
          </div>

          {/* Campaign Performance Overview */}
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8'>
            <Card>
              <CardContent className='p-4 text-center'>
                <Eye className='h-6 w-6 text-blue-600 mx-auto mb-2' />
                <p className='text-2xl font-bold'>
                  {campaignStats.totalViews.toLocaleString()}
                </p>
                <p className='text-xs text-gray-600'>Total Views</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-4 text-center'>
                <Download className='h-6 w-6 text-green-600 mx-auto mb-2' />
                <p className='text-2xl font-bold'>
                  {campaignStats.totalDownloads}
                </p>
                <p className='text-xs text-gray-600'>Downloads</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-4 text-center'>
                <Mail className='h-6 w-6 text-purple-600 mx-auto mb-2' />
                <p className='text-2xl font-bold'>{campaignStats.emailOpens}</p>
                <p className='text-xs text-gray-600'>Email Opens</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-4 text-center'>
                <Target className='h-6 w-6 text-orange-600 mx-auto mb-2' />
                <p className='text-2xl font-bold'>
                  {campaignStats.clickThrough}
                </p>
                <p className='text-xs text-gray-600'>Click Through</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-4 text-center'>
                <Share2 className='h-6 w-6 text-pink-600 mx-auto mb-2' />
                <p className='text-2xl font-bold'>
                  {campaignStats.socialShares}
                </p>
                <p className='text-xs text-gray-600'>Social Shares</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-4 text-center'>
                <BarChart3 className='h-6 w-6 text-indigo-600 mx-auto mb-2' />
                <p className='text-2xl font-bold'>
                  {campaignStats.leadGenerated}
                </p>
                <p className='text-xs text-gray-600'>Leads Generated</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue='materials' className='space-y-6'>
            <TabsList>
              <TabsTrigger value='materials'>Marketing Materials</TabsTrigger>
              <TabsTrigger value='create'>Create New</TabsTrigger>
              <TabsTrigger value='campaigns'>Email Campaigns</TabsTrigger>
              <TabsTrigger value='social'>Social Media</TabsTrigger>
              <TabsTrigger value='analytics'>Performance</TabsTrigger>
            </TabsList>

            <TabsContent value='materials' className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {marketingMaterials.map(material => {
                  const IconComponent = getTypeIcon(material.type)
                  return (
                    <Card
                      key={material.id}
                      className='hover:shadow-md transition-shadow'
                    >
                      <CardContent className='p-4'>
                        <div className='aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden'>
                          <img
                            src={material.thumbnail || '/placeholder.svg'}
                            alt={material.name}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div className='space-y-3'>
                          <div className='flex items-center justify-between'>
                            <h3 className='font-semibold'>{material.name}</h3>
                            <Badge className={getStatusColor(material.status)}>
                              {material.status}
                            </Badge>
                          </div>
                          <p className='text-sm text-gray-600'>
                            {material.property}
                          </p>
                          <div className='flex items-center gap-4 text-sm text-gray-500'>
                            <span className='flex items-center gap-1'>
                              <Eye className='h-3 w-3' />
                              {material.views}
                            </span>
                            <span className='flex items-center gap-1'>
                              <Download className='h-3 w-3' />
                              {material.downloads}
                            </span>
                          </div>
                          <div className='flex gap-2'>
                            <Button size='sm' className='flex-1'>
                              <Eye className='h-4 w-4 mr-1' />
                              Preview
                            </Button>
                            <Button size='sm' variant='outline'>
                              <Download className='h-4 w-4 mr-1' />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value='create' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Create New Marketing Material</CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-4'>
                      <div>
                        <Label htmlFor='property'>Select Property</Label>
                        <Select
                          value={selectedProperty}
                          onValueChange={setSelectedProperty}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Choose a property' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='downtown-office'>
                              Downtown Office Complex
                            </SelectItem>
                            <SelectItem value='retail-center'>
                              Retail Shopping Center
                            </SelectItem>
                            <SelectItem value='industrial-warehouse'>
                              Industrial Warehouse
                            </SelectItem>
                            <SelectItem value='medical-office'>
                              Medical Office Building
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor='material-type'>Material Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder='Choose material type' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='brochure'>
                              Property Brochure
                            </SelectItem>
                            <SelectItem value='flyer'>
                              Marketing Flyer
                            </SelectItem>
                            <SelectItem value='virtual-tour'>
                              Virtual Tour
                            </SelectItem>
                            <SelectItem value='social-media'>
                              Social Media Package
                            </SelectItem>
                            <SelectItem value='email-template'>
                              Email Template
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor='template'>Template Style</Label>
                        <Select
                          value={selectedTemplate}
                          onValueChange={setSelectedTemplate}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Choose template' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='modern'>
                              Modern Professional
                            </SelectItem>
                            <SelectItem value='classic'>
                              Classic Elegant
                            </SelectItem>
                            <SelectItem value='minimal'>
                              Minimal Clean
                            </SelectItem>
                            <SelectItem value='bold'>Bold Impact</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor='custom-message'>
                          Custom Message (Optional)
                        </Label>
                        <Textarea
                          id='custom-message'
                          placeholder='Add any specific messaging or highlights you want to include...'
                          rows={4}
                        />
                      </div>
                    </div>

                    <div className='space-y-4'>
                      <div>
                        <Label>Template Preview</Label>
                        <div className='aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center'>
                          {selectedTemplate ? (
                            <div className='text-center'>
                              <Palette className='w-12 h-12 text-gray-400 mx-auto mb-2' />
                              <p className='text-gray-600'>Template Preview</p>
                              <p className='text-sm text-gray-500'>
                                {selectedTemplate} style
                              </p>
                            </div>
                          ) : (
                            <div className='text-center'>
                              <FileText className='w-12 h-12 text-gray-400 mx-auto mb-2' />
                              <p className='text-gray-600'>
                                Select a template to preview
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <Label>AI Enhancement Options</Label>
                        <div className='space-y-2'>
                          <label className='flex items-center space-x-2'>
                            <input
                              type='checkbox'
                              className='rounded'
                              defaultChecked
                            />
                            <span className='text-sm'>
                              AI-generated property description
                            </span>
                          </label>
                          <label className='flex items-center space-x-2'>
                            <input
                              type='checkbox'
                              className='rounded'
                              defaultChecked
                            />
                            <span className='text-sm'>
                              Market analysis insights
                            </span>
                          </label>
                          <label className='flex items-center space-x-2'>
                            <input type='checkbox' className='rounded' />
                            <span className='text-sm'>
                              Investment highlights
                            </span>
                          </label>
                          <label className='flex items-center space-x-2'>
                            <input type='checkbox' className='rounded' />
                            <span className='text-sm'>
                              Neighborhood information
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex gap-4'>
                    <Button className='flex-1'>
                      <Zap className='h-4 w-4 mr-2' />
                      Generate with AI
                    </Button>
                    <Button variant='outline'>
                      <Eye className='h-4 w-4 mr-2' />
                      Preview First
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='campaigns' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Email Marketing Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {[
                      {
                        name: 'New Listing Announcement',
                        property: 'Downtown Office Complex',
                        sent: 245,
                        opened: 89,
                        clicked: 23,
                        status: 'sent'
                      },
                      {
                        name: 'Price Reduction Alert',
                        property: 'Retail Shopping Center',
                        sent: 156,
                        opened: 67,
                        clicked: 18,
                        status: 'sent'
                      },
                      {
                        name: 'Market Update Newsletter',
                        property: 'Multiple Properties',
                        sent: 0,
                        opened: 0,
                        clicked: 0,
                        status: 'draft'
                      }
                    ].map((campaign, index) => (
                      <div key={index} className='border rounded-lg p-4'>
                        <div className='flex items-center justify-between mb-3'>
                          <div>
                            <h3 className='font-semibold'>{campaign.name}</h3>
                            <p className='text-sm text-gray-600'>
                              {campaign.property}
                            </p>
                          </div>
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status.toUpperCase()}
                          </Badge>
                        </div>

                        {campaign.status === 'sent' && (
                          <div className='grid grid-cols-3 gap-4 text-sm'>
                            <div className='text-center'>
                              <p className='font-semibold'>{campaign.sent}</p>
                              <p className='text-gray-600'>Sent</p>
                            </div>
                            <div className='text-center'>
                              <p className='font-semibold'>{campaign.opened}</p>
                              <p className='text-gray-600'>Opened</p>
                            </div>
                            <div className='text-center'>
                              <p className='font-semibold'>
                                {campaign.clicked}
                              </p>
                              <p className='text-gray-600'>Clicked</p>
                            </div>
                          </div>
                        )}

                        <div className='flex gap-2 mt-3'>
                          <Button size='sm' variant='outline'>
                            <Eye className='h-4 w-4 mr-1' />
                            View
                          </Button>
                          <Button size='sm' variant='outline'>
                            <FileText className='h-4 w-4 mr-1' />
                            Edit
                          </Button>
                          {campaign.status === 'draft' && (
                            <Button size='sm'>
                              <Mail className='h-4 w-4 mr-1' />
                              Send
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='social' className='space-y-6'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Social Media Posts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      {[
                        {
                          platform: 'LinkedIn',
                          content:
                            '🏢 New Listing: Premium office space in downtown...',
                          engagement: { likes: 45, shares: 12, comments: 8 },
                          posted: '2 hours ago'
                        },
                        {
                          platform: 'Instagram',
                          content:
                            '✨ Virtual tour of our stunning retail space...',
                          engagement: { likes: 89, shares: 23, comments: 15 },
                          posted: '1 day ago'
                        },
                        {
                          platform: 'Facebook',
                          content:
                            '📈 Market update: Commercial real estate trends...',
                          engagement: { likes: 67, shares: 34, comments: 21 },
                          posted: '3 days ago'
                        }
                      ].map((post, index) => (
                        <div key={index} className='border rounded-lg p-4'>
                          <div className='flex items-center justify-between mb-2'>
                            <Badge variant='outline'>{post.platform}</Badge>
                            <span className='text-sm text-gray-500'>
                              {post.posted}
                            </span>
                          </div>
                          <p className='text-sm mb-3'>{post.content}</p>
                          <div className='flex gap-4 text-xs text-gray-600'>
                            <span>👍 {post.engagement.likes}</span>
                            <span>🔄 {post.engagement.shares}</span>
                            <span>💬 {post.engagement.comments}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Create Social Media Post</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div>
                      <Label htmlFor='platform'>Platform</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder='Choose platform' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='linkedin'>LinkedIn</SelectItem>
                          <SelectItem value='instagram'>Instagram</SelectItem>
                          <SelectItem value='facebook'>Facebook</SelectItem>
                          <SelectItem value='twitter'>Twitter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor='post-content'>Post Content</Label>
                      <Textarea
                        id='post-content'
                        placeholder='Write your post content or let AI generate it...'
                        rows={4}
                      />
                    </div>

                    <div className='flex gap-2'>
                      <Button className='flex-1'>
                        <Zap className='h-4 w-4 mr-2' />
                        Generate with AI
                      </Button>
                      <Button variant='outline'>
                        <Share2 className='h-4 w-4 mr-2' />
                        Schedule Post
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value='analytics' className='space-y-6'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Marketing Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='h-64 bg-gray-100 rounded-lg flex items-center justify-center'>
                      <div className='text-center'>
                        <BarChart3 className='w-12 h-12 text-gray-400 mx-auto mb-2' />
                        <p className='text-gray-600'>Performance Analytics</p>
                        <p className='text-sm text-gray-500'>
                          Campaign effectiveness over time
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Materials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      {[
                        {
                          name: 'Downtown Office Brochure',
                          views: 234,
                          downloads: 45,
                          conversion: '19.2%'
                        },
                        {
                          name: 'Retail Center Virtual Tour',
                          views: 189,
                          downloads: 23,
                          conversion: '12.2%'
                        },
                        {
                          name: 'Industrial Warehouse Flyer',
                          views: 156,
                          downloads: 18,
                          conversion: '11.5%'
                        }
                      ].map((material, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between p-3 border rounded-lg'
                        >
                          <div>
                            <h4 className='font-medium text-sm'>
                              {material.name}
                            </h4>
                            <p className='text-xs text-gray-600'>
                              {material.views} views • {material.downloads}{' '}
                              downloads
                            </p>
                          </div>
                          <Badge className='bg-green-100 text-green-800'>
                            {material.conversion}
                          </Badge>
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
