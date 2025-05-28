'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Building2,
  TrendingUp,
  Users,
  Clock,
  ChevronDown,
  Heart,
  Star,
  Gavel
} from 'lucide-react'
import { SafeImage } from '@/components/ui/safe-image'
import { getPlaceholderImage } from '@/lib/image-utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PropertyCard } from '@/components/property-card'
import { useProperties } from '@/hooks/use-properties'

export default function HomePage () {
  const [searchType, setSearchType] = useState('forLease')
  const [selectedPropertyType, setSelectedPropertyType] = useState('')
  const [trendingTab, setTrendingTab] = useState('ForLease')
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30
  })
  const [searchQuery, setSearchQuery] = useState('')

  const router = useRouter()
  const { properties, loading } = useProperties({ page: 1, limit: 8 })

  // Countdown timer for auctions
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Company logos for carousel
  const companyLogos = [
    'Amazon',
    'Google',
    'Goldman Sachs',
    'IBM',
    'Netflix',
    'Blackstone',
    'Intel',
    'Starbucks',
    '3M',
    'Pfizer',
    'Target',
    'Walmart',
    'Adobe',
    'Disney',
    'FedEx',
    'Home Depot',
    'Microsoft',
    'Apple'
  ]

  // Property types with icons
  const propertyTypes = [
    { id: 8, name: 'Office', icon: '🏢' },
    { id: 16, name: 'Retail', icon: '🏪' },
    { id: 2, name: 'Industrial', icon: '🏭' },
    { id: 32, name: 'Flex', icon: '🏗️' },
    { id: 8192, name: 'Coworking', icon: '💼' },
    { id: 512, name: 'Medical', icon: '🏥' },
    { id: 4, name: 'Land', icon: '🌍' },
    { id: 4096, name: 'Restaurant', icon: '🍽️' }
  ]

  // Define property interface
  interface Property {
    id: number
    type: string
    title: string
    price: string
    address: string
    size: string
    image: string
  }

  // Trending properties with static images
  const trendingProperties: { [key: string]: Property[] } = {
    ForLease: [
      {
        id: 1,
        type: 'Office',
        title: 'Office Space for Lease',
        price: 'From $25.50 SF/YR',
        address: '800 Fairway Dr, Deerfield Beach, FL 33441',
        size: 'Up to 56,900 SF',
        image: '/images/properties/office.jpg'
      },
      {
        id: 2,
        type: 'Coworking',
        title: 'Coworking Space',
        price: 'From $40 SF/YR',
        address: '8230 210th St S, Boca Raton, FL 33433',
        size: 'Up to 1,000 SF',
        image: '/images/properties/coworking.jpg'
      },
      {
        id: 3,
        type: 'Retail',
        title: 'Retail Space',
        price: 'From $13 SF/YR',
        address: '450 Amwell Rd, Hillsborough, NJ 08844',
        size: 'Up to 4,100 SF',
        image: '/images/properties/retail.jpg'
      },
      {
        id: 4,
        type: 'Restaurant',
        title: 'Restaurant Space',
        price: 'From $39 SF/YR',
        address: 'Rainbow Blvd, Las Vegas, NV 89178',
        size: 'Up to 16,800 SF',
        image: '/images/properties/restaurant.jpg'
      }
    ],
    ForSale: [
      {
        id: 5,
        type: 'Office',
        title: 'Office Building for Sale',
        price: '$1,875,000',
        address: '800 Fairway Dr, Deerfield Beach, FL 33441',
        size: '56,900 SF',
        image: '/images/properties/office-building.jpg'
      },
      {
        id: 6,
        type: 'Industrial',
        title: 'Industrial Space',
        price: '$1,200,000',
        address: '450 Amwell Rd, Hillsborough, NJ 08844',
        size: '24,000 SF',
        image: '/images/properties/industrial.jpg'
      },
      {
        id: 7,
        type: 'Auction',
        title: 'Property at Auction',
        price: 'Auction',
        address: 'Rainbow Blvd, Las Vegas, NV 89178',
        size: '16,800 SF',
        image: '/images/properties/auction.jpg'
      }
    ]
  }

  // Popular cities with fallback to placeholder
  const popularCities = [
    { name: 'New York City', id: 'nyc' },
    { name: 'London', id: 'london' },
    { name: 'Paris', id: 'paris' },
    { name: 'Los Angeles', id: 'la' },
    { name: 'Chicago', id: 'chicago' },
    { name: 'Miami', id: 'miami' }
  ].map(city => ({
    ...city,
    // Use the city image if available, otherwise fallback to default city placeholder
    image: getPlaceholderImage('city', city.id)
  }))

  // Educational articles
  const educationalArticles = [
    {
      title: 'Commercial Real Estate Leasing Terms You Need to Know',
      description:
        'Understand the essential terms when leasing commercial space, including Letter of Intent, Tenant Improvements and more.',
      image: '/images/articles/leasing-terms.jpg'
    },
    {
      title: '10 Reasons to Hire a Commercial Real Estate Broker',
      description:
        'A Tenant Rep Can Help Your Business Find and Execute the Perfect Lease',
      image: '/images/articles/cre-broker.jpg'
    },
    {
      title: 'Commercial Real Estate Investment Strategies',
      description:
        'Essential Guidelines for Success in Commercial Property Investment',
      image: '/images/articles/investment-strategies.jpg'
    }
  ]

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery)}`)
    } else {
      const params = new URLSearchParams()
      if (searchType) params.set('type', searchType)
      if (selectedPropertyType) params.set('propertyType', selectedPropertyType)
      router.push(`/properties?${params.toString()}`)
    }
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section with Advanced Search */}
      <section className='relative bg-gradient-to-r from-blue-600/90 to-blue-800/90 text-white py-16 overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <SafeImage
            src='/images/backgrounds/city-skyline.jpg'
            alt='City skyline'
            fill
            className='object-cover'
            priority
            fallbackSrc={getPlaceholderImage('background')}
          />
          <div className='absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-800/80'></div>
        </div>
        <div className='relative z-10'>
          <div className='container mx-auto px-4'>
            <div className='max-w-4xl mx-auto text-center'>
              <h1 className='text-4xl md:text-6xl font-bold mb-6'>
                The World's #1 Commercial Real Estate Marketplace
              </h1>

              {/* Advanced Search Form */}
              <Card className='bg-white text-gray-900 p-6'>
                {/* Search Type Tabs */}
                <div className='flex flex-wrap justify-center mb-4 border-b'>
                  {[
                    { key: 'forLease', label: 'For Lease' },
                    { key: 'forSale', label: 'For Sale' },
                    { key: 'auctions', label: 'Auctions' },
                    { key: 'businesses', label: 'Businesses For Sale' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setSearchType(tab.key)
                        router.push(`/properties?type=${tab.key}`)
                      }}
                      className={`px-4 py-2 font-medium ${
                        searchType === tab.key
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Property Type Icons Carousel */}
                <div className='flex overflow-x-auto space-x-4 mb-6 pb-2'>
                  {propertyTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedPropertyType(type.id.toString())
                        router.push(
                          `/properties?propertyType=${type.id}&name=${type.name}`
                        )
                      }}
                      className={`flex-shrink-0 flex flex-col items-center p-3 rounded-lg transition-colors ${
                        selectedPropertyType === type.id.toString()
                          ? 'bg-blue-100 text-blue-600'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className='text-2xl mb-1'>{type.icon}</span>
                      <span className='text-sm font-medium'>{type.name}</span>
                    </button>
                  ))}
                </div>

                {/* Search Input and Button */}
                <div className='flex gap-4 mb-4'>
                  <div className='flex-1'>
                    <Input
                      placeholder='Enter a location'
                      className='h-12 text-lg'
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    className='h-12 px-8 bg-blue-600 hover:bg-blue-700'
                  >
                    <Search className='w-5 h-5 mr-2' />
                    Search
                  </Button>
                </div>

                {/* Advanced Filters */}
                <div className='flex flex-wrap gap-4'>
                  <Select>
                    <SelectTrigger className='w-40'>
                      <SelectValue placeholder='Price Range' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='0-500k'>$0 - $500K</SelectItem>
                      <SelectItem value='500k-1m'>$500K - $1M</SelectItem>
                      <SelectItem value='1m-5m'>$1M - $5M</SelectItem>
                      <SelectItem value='5m+'>$5M+</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className='w-40'>
                      <SelectValue placeholder='Size (sq ft)' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='0-5k'>0 - 5,000</SelectItem>
                      <SelectItem value='5k-10k'>5,000 - 10,000</SelectItem>
                      <SelectItem value='10k-25k'>10,000 - 25,000</SelectItem>
                      <SelectItem value='25k+'>25,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section with Stats */}
      <section className='py-12 bg-gray-50'>
        <div className='container mx-auto px-4 text-center'>
          <p className='text-lg text-gray-600 mb-8'>
            For over 30 years, LoopNet has been the trusted brand for Commercial
            Real Estate
          </p>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div>
              <div className='text-4xl font-bold text-blue-600 mb-2'>300K+</div>
              <div className='text-gray-600'>Active Listings</div>
            </div>
            <div>
              <div className='text-4xl font-bold text-blue-600 mb-2'>13M+</div>
              <div className='text-gray-600'>Monthly Visitors</div>
            </div>
            <div>
              <div className='text-4xl font-bold text-blue-600 mb-2'>
                $109B+
              </div>
              <div className='text-gray-600'>In Transaction Value</div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Logos Carousel */}
      <section className='py-8 bg-white overflow-hidden'>
        <div className='container mx-auto px-4'>
          <h3 className='text-center text-lg font-medium text-gray-600 mb-6'>
            Companies actively searching on LoopNet
          </h3>
          <div className='relative'>
            <div className='flex animate-scroll space-x-8'>
              {[...companyLogos, ...companyLogos].map((company, index) => (
                <div
                  key={index}
                  className='flex-shrink-0 w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center'
                >
                  <span className='text-sm font-medium text-gray-600'>
                    {company}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending on LoopNet */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-3xl font-bold'>Trending on LoopNet</h2>
            <Link href='/properties' className='text-blue-600 hover:underline'>
              See More
            </Link>
          </div>

          <Tabs value={trendingTab} onValueChange={setTrendingTab}>
            <TabsList className='grid w-full grid-cols-3 max-w-md'>
              <TabsTrigger value='ForLease'>For Lease</TabsTrigger>
              <TabsTrigger value='ForSale'>For Sale</TabsTrigger>
              <TabsTrigger value='ForAuctions'>For Auctions</TabsTrigger>
            </TabsList>

            {Object.entries(trendingProperties).map(([key, properties]) => (
              <TabsContent key={key} value={key} className='mt-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                  {properties.map(property => (
                    <Card
                      key={property.id}
                      className='overflow-hidden hover:shadow-lg transition-shadow'
                    >
                      <div className='relative'>
                        <SafeImage
                          src={property.image}
                          alt={property.title}
                          width={300}
                          height={200}
                          className='h-48 w-full object-cover'
                          fallbackSrc={getPlaceholderImage('property')}
                        />
                        <Badge className='absolute top-2 left-2 bg-blue-600'>
                          {property.type}
                        </Badge>
                        <button
                          className='absolute top-2 right-2 p-1 bg-white rounded-full shadow-md'
                          aria-label='Ajouter aux favoris'
                        >
                          <Heart className='w-4 h-4 text-gray-600' />
                        </button>
                      </div>
                      <CardContent className='p-4'>
                        <div className='space-y-2'>
                          <div className='font-semibold text-blue-600'>
                            {property.price}
                          </div>
                          <div className='text-sm text-gray-600'>
                            {property.address}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {property.size}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Featured Properties from Database */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between mb-12'>
            <div>
              <h2 className='text-3xl font-bold mb-4'>Featured Properties</h2>
              <p className='text-gray-600'>
                Discover our best investment opportunities
              </p>
            </div>
            <Link href='/properties'>
              <Button variant='outline'>View All Properties</Button>
            </Link>
          </div>

          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className='bg-white rounded-lg h-96 animate-pulse'
                />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {properties.slice(0, 8).map(property => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Live Auction Section */}
      <section className='py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
            <div>
              <div className='flex items-center space-x-2 mb-4'>
                <Clock className='w-6 h-6' />
                <span className='text-lg font-semibold'>Live Auction</span>
              </div>
              <h3 className='text-2xl font-bold mb-2'>Health Care</h3>
              <p className='text-lg mb-4'>Boynton Beach, FL</p>

              <div className='flex items-center space-x-4 mb-6'>
                <div className='text-center'>
                  <div className='text-3xl font-bold'>{timeLeft.hours}</div>
                  <div className='text-sm'>Hours</div>
                </div>
                <div className='text-2xl'>:</div>
                <div className='text-center'>
                  <div className='text-3xl font-bold'>{timeLeft.minutes}</div>
                  <div className='text-sm'>Minutes</div>
                </div>
                <div className='text-2xl'>:</div>
                <div className='text-center'>
                  <div className='text-3xl font-bold'>{timeLeft.seconds}</div>
                  <div className='text-sm'>Seconds</div>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='text-2xl font-bold'>$1,750,000</div>
                <div className='text-sm opacity-90'>Starting Bid</div>
              </div>
            </div>

            <div>
              <h2 className='text-3xl font-bold mb-4'>
                Discover Your Next Investment at Auction
              </h2>
              <p className='text-lg mb-6 opacity-90'>
                Identify and bid on quality assets through our transparent and
                competitive platform—all online. Join the investors worldwide
                who have partnered with us to successfully transact 11,000+
                properties.
              </p>
              <div className='space-y-4'>
                <Button size='lg' variant='secondary'>
                  Learn More About Auctions
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  className='text-white border-white hover:bg-white hover:text-purple-600'
                >
                  See Available Listings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities Carousel */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            Explore Popular Cities
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
            {popularCities.map((city, index) => (
              <Link
                key={index}
                href={`/search/${city.name.toLowerCase().replace(' ', '-')}`}
              >
                <div className='text-center group cursor-pointer'>
                  <div className='relative overflow-hidden rounded-lg mb-3 h-32'>
                    <SafeImage
                      src={city.image}
                      alt={city.name}
                      width={200}
                      height={150}
                      className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                      fallbackSrc={getPlaceholderImage('city')}
                    />
                  </div>
                  <h3 className='font-medium text-gray-900 group-hover:text-blue-600'>
                    {city.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Commercial Real Estate Explained */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between mb-12'>
            <h2 className='text-3xl font-bold'>
              Commercial Real Estate Explained
            </h2>
            <Link
              href='/cre-explained'
              className='text-blue-600 hover:underline'
            >
              See More
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {educationalArticles.map((article, index) => (
              <Card
                key={index}
                className='overflow-hidden hover:shadow-lg transition-shadow'
              >
                <SafeImage
                  src={article.image}
                  alt={article.title}
                  width={300}
                  height={200}
                  className='w-full h-48 object-cover'
                  fallbackSrc={getPlaceholderImage('property')}
                />
                <CardContent className='p-6'>
                  <h3 className='font-semibold text-lg mb-3'>
                    {article.title}
                  </h3>
                  <p className='text-gray-600 text-sm'>{article.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Marketing to Listers */}
      <section className='py-16 bg-blue-600 text-white'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold mb-4'>
              LoopNet Listings Lease or Sell 14% Faster*
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Users className='w-8 h-8' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>Right Audience</h3>
              <p className='opacity-90'>
                96% of the Fortune 1000 search on LoopNet
              </p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Star className='w-8 h-8' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>Engage Prospects</h3>
              <p className='opacity-90'>
                Stunning photography, videos and drone shots
              </p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4'>
                <TrendingUp className='w-8 h-8' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>More Opportunity</h3>
              <p className='opacity-90'>
                Find a tenant or buyer, faster than before
              </p>
            </div>
          </div>

          <div className='text-center'>
            <Button size='lg' variant='secondary'>
              Explore Marketing Solutions
            </Button>
            <p className='text-sm opacity-75 mt-4'>
              *Based on internal analysis comparing properties advertised on
              LoopNet to properties listed only on CoStar.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            Commercial Real Estate Fundamentals: Essential Questions for
            Investors & Businesses
          </h2>

          <div className='max-w-4xl mx-auto space-y-4'>
            {[
              {
                question:
                  'Is LoopNet Available for International Property Searches?',
                answer:
                  'Yes, LoopNet operates globally, with dedicated platforms for commercial real estate in the UK, Canada, France, and Spain. These country specific versions offer localized commercial property listings and search capabilities.'
              },
              {
                question:
                  'Office Space or Coworking: Which Fits Your Business Needs?',
                answer:
                  "Deciding between coworking and traditional office space depends on your team's size, budget, and how quickly you need to move in. For short term flexibility or shared amenities, coworking spaces may be the better fit."
              },
              {
                question:
                  'What Should I Know Before Investing in Multifamily Properties?',
                answer:
                  'Multifamily properties offer steady cash flow, appreciation, and scalable management, making them a cornerstone of many investment portfolios. Key financial metrics like net operating income, cap rate, and internal rate of return help investors evaluate opportunities with precision.'
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className='p-6'>
                  <details className='group'>
                    <summary className='flex items-center justify-between cursor-pointer'>
                      <h3 className='font-semibold text-lg'>{faq.question}</h3>
                      <ChevronDown className='w-5 h-5 group-open:rotate-180 transition-transform' />
                    </summary>
                    <p className='mt-4 text-gray-600'>{faq.answer}</p>
                  </details>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-12'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-6 gap-8'>
            <div className='md:col-span-2'>
              <div className='flex items-center space-x-2 mb-4'>
                <Building2 className='h-6 w-6' />
                <span className='text-xl font-bold'>LoopNet</span>
              </div>
              <p className='text-gray-400 mb-4'>
                The leading commercial real estate marketplace connecting
                buyers, sellers, and industry professionals.
              </p>
            </div>

            {/* Footer Links organized by tabs */}
            <div>
              <h3 className='font-semibold mb-4'>For Sale</h3>
              <ul className='space-y-2 text-gray-400 text-sm'>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Office Buildings for Sale
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Retail Buildings for Sale
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Land for Sale
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Apartment Buildings for Sale
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='font-semibold mb-4'>For Lease</h3>
              <ul className='space-y-2 text-gray-400 text-sm'>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Office Space for Lease
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Retail Space for Lease
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Industrial Space for Lease
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Medical Offices for Lease
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='font-semibold mb-4'>Resources</h3>
              <ul className='space-y-2 text-gray-400 text-sm'>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Market Data
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Research
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    CRE Explained
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Education
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='font-semibold mb-4'>Company</h3>
              <ul className='space-y-2 text-gray-400 text-sm'>
                <li>
                  <Link href='#' className='hover:text-white'>
                    About
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
            <p>&copy; 2024 LoopNet Clone. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
