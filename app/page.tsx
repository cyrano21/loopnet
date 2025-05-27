// app/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Search,
  Building2,
  TrendingUp,
  Users,
  Clock,
  ChevronDown,
  Heart,
  Star,
  MapPin,
  Briefcase,
  Zap,
  Landmark,
  Store // Ajout de Store
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation' // VOTRE useRouter

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { PropertyCard } from '@/components/property-card' // Import du composant PropertyCard complet
import { useProperties } from '@/hooks/use-properties' // VOTRE hook useProperties
import { cn } from '@/lib/utils'

// Hook useOnScreen with proper typing
function useOnScreen (
  ref: React.RefObject<HTMLDivElement | null>,
  rootMargin = '0px',
  threshold = 0.1
) {
  const [isIntersecting, setIntersecting] = useState(false)
  useEffect(() => {
    const currentRef = ref.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true)
          // Optional: stop observing once visible for performance
          // if (currentRef) {
          //   observer.unobserve(currentRef);
          // }
        } else {
          // Optional: reset to false if you want animation to replay
          // setIntersecting(false);
        }
      },
      { rootMargin, threshold }
    )
    if (currentRef) observer.observe(currentRef)
    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [ref, rootMargin, threshold])
  return isIntersecting
}

export default function HomePage () {
  // VOTRE ÉTAT ET LOGIQUE EXISTANTE SONT PRÉSERVÉS
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
  const { properties, loading } = useProperties({ page: 1, limit: 8 }) // VOTRE HOOK

  // Refs pour les animations
  const trustSectionRef = useRef<HTMLDivElement | null>(null)
  const companyLogosRef = useRef<HTMLDivElement | null>(null)
  const trendingSectionRef = useRef<HTMLDivElement | null>(null)
  const featuredSectionRef = useRef<HTMLDivElement | null>(null)
  const auctionSectionRef = useRef<HTMLDivElement | null>(null)
  const citiesSectionRef = useRef<HTMLDivElement | null>(null)
  const articlesSectionRef = useRef<HTMLDivElement | null>(null)
  const marketingSectionRef = useRef<HTMLDivElement | null>(null)
  const faqSectionRef = useRef<HTMLDivElement | null>(null)

  const isTrustSectionOnScreen = useOnScreen(trustSectionRef, '-100px')
  const isCompanyLogosOnScreen = useOnScreen(companyLogosRef, '-100px')
  const isTrendingSectionOnScreen = useOnScreen(trendingSectionRef, '-100px')
  const isFeaturedSectionOnScreen = useOnScreen(featuredSectionRef, '-100px')
  const isAuctionSectionOnScreen = useOnScreen(auctionSectionRef, '-100px')
  const isCitiesSectionOnScreen = useOnScreen(citiesSectionRef, '-100px')
  const isArticlesSectionOnScreen = useOnScreen(articlesSectionRef, '-100px')
  const isMarketingSectionOnScreen = useOnScreen(marketingSectionRef, '-100px')
  const isFaqSectionOnScreen = useOnScreen(faqSectionRef, '-100px')

  // VOTRE useEffect pour le timer
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    if (timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
          if (prev.minutes > 0)
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
          if (prev.hours > 0)
            return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
          if (timer) clearInterval(timer) // Arrêter quand tout est à zéro
          return { hours: 0, minutes: 0, seconds: 0 }
        })
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [timeLeft.hours, timeLeft.minutes, timeLeft.seconds])

  // VOS DONNÉES SONT PRÉSERVÉES
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
  const propertyTypesData = [
    // Renommé pour éviter conflit avec type 'propertyTypes' ailleurs
    { id: 8, name: 'Office', icon: '🏢' },
    { id: 16, name: 'Retail', icon: '🏪' },
    { id: 2, name: 'Industrial', icon: '🏭' },
    { id: 32, name: 'Flex', icon: '🏗️' },
    { id: 8192, name: 'Coworking', icon: '💼' },
    { id: 512, name: 'Medical', icon: '🏥' },
    { id: 4, name: 'Land', icon: '🌍' },
    { id: 4096, name: 'Restaurant', icon: '🍽️' }
  ]
  const trendingPropertiesData = {
    // Renommé
    ForLease: [
      {
        id: 1,
        type: 'Office',
        price: 'From $25.50 SF/YR',
        address: '800 Fairway Dr, Deerfield Beach, FL 33441',
        size: 'Up to 56,900 SF',
        image:
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop&crop=center'
      },
      {
        id: 2,
        type: 'Coworking',
        price: 'From $40 SF/YR',
        address: '8230 210th St S, Boca Raton, FL 33433',
        size: 'Up to 1,000 SF',
        image:
          'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=300&h=200&fit=crop&crop=center'
      },
      {
        id: 3,
        type: 'Retail',
        price: 'From $13 SF/YR',
        address: '450 Amwell Rd, Hillsborough, NJ 08844',
        size: 'Up to 4,100 SF',
        image:
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop&crop=center'
      },
      {
        id: 4,
        type: 'Restaurant',
        price: 'From $39 SF/YR',
        address: 'Rainbow Blvd, Las Vegas, NV 89178',
        size: 'Up to 16,800 SF',
        image:
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop&crop=center'
      }
    ],
    ForSale: [
      {
        id: 5,
        type: 'Office',
        price: '$1,875,000',
        address: '68 Evergreen St, Kingston, MA 02364',
        size: '19,000 SF',
        image:
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop&crop=center'
      },
      {
        id: 6,
        type: 'Industrial',
        price: '$18,520,400',
        address: '4437 E 49th St, Cleveland, OH 44125',
        size: '231,500 SF',
        image:
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop&crop=center'
      }
    ],
    Auctions: [
      {
        id: 7,
        type: 'Office',
        price: 'Starting Bid $2,500,000',
        address: '3 Independence Way, Princeton, NJ 08540',
        size: '125,700 SF',
        image:
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop&crop=center'
      }
    ]
  }
  const popularCitiesData = [
    // Renommé
    {
      name: 'New York City',
      image:
        'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=200&h=150&fit=crop&crop=center'
    },
    {
      name: 'London',
      image:
        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=200&h=150&fit=crop&crop=center'
    },
    {
      name: 'Paris',
      image:
        'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=200&h=150&fit=crop&crop=center'
    },
    {
      name: 'Los Angeles',
      image:
        'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=200&h=150&fit=crop&crop=center'
    },
    {
      name: 'Chicago',
      image:
        'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=200&h=150&fit=crop&crop=center'
    },
    {
      name: 'Miami',
      image:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop&crop=center'
    }
  ]
  const educationalArticlesData = [
    // Renommé
    {
      title: 'Lease Terms Commercial Investors Need to Know',
      description:
        'Understand the essential terms when leasing commercial space, including Letter of Intent, Tenant Improvements and more.',
      image:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=200&fit=crop&crop=center'
    },
    {
      title: '10 Reasons to Hire a Commercial Real Estate Broker',
      description:
        'A Tenant Rep Can Help Your Business Find and Execute the Perfect Lease',
      image:
        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=300&h=200&fit=crop&crop=center'
    },
    {
      title: 'Commercial Real Estate Investment Strategies',
      description:
        'Essential Guidelines for Success in Commercial Property Investment',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=center'
    }
  ]

  // VOTRE logique de recherche
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

  const formatTime = (time: number) => time.toString().padStart(2, '0')

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300 overflow-x-hidden'>
      {/* Hero Section */}
      <section className='relative text-white py-20 md:py-28 lg:py-32 overflow-hidden isolate'>
        <div className='absolute inset-0 z-[-1]'>
          <Image
            src='https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=600&fit=crop&crop=center' // VOTRE IMAGE
            alt='City skyline'
            fill
            className='object-cover'
            priority
            quality={75}
          />
          <div className='absolute inset-0 bg-gradient-to-br from-blue-700/80 via-blue-600/70 to-sky-500/60'></div>{' '}
          {/* Gradient un peu plus prononcé */}
        </div>

        <div className='relative z-10 container mx-auto px-4'>
          <div className='max-w-3xl mx-auto text-center'>
            <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-shadow-lg animate-fade-in-down'>
              The World's #1 Commercial Real Estate Marketplace
            </h1>
            <p className='text-lg md:text-xl mb-10 text-slate-100 animate-fade-in-up animation-delay-200'>
              Find, Lease, or Buy Your Next Commercial Property With Us. Explore
              Thousands of Listings.
            </p>

            <Card className='bg-white/95 dark:bg-slate-800/95 backdrop-blur-md text-slate-900 dark:text-slate-100 p-5 md:p-8 shadow-2xl rounded-xl transform transition-all hover:scale-[1.01] duration-300 animate-fade-in-up animation-delay-400'>
              <CardContent className='p-0'>
                <div className='flex flex-wrap justify-center mb-6 border-b border-slate-200 dark:border-slate-700'>
                  {[
                    // VOS DONNÉES DE TABS
                    {
                      key: 'forLease',
                      label: 'For Lease',
                      icon: <Briefcase className='w-4 h-4 mr-1.5' />
                    },
                    {
                      key: 'forSale',
                      label: 'For Sale',
                      icon: <TrendingUp className='w-4 h-4 mr-1.5' />
                    },
                    {
                      key: 'auctions',
                      label: 'Auctions',
                      icon: <Clock className='w-4 h-4 mr-1.5' />
                    },
                    {
                      key: 'businesses',
                      label: 'Businesses For Sale',
                      icon: <Store className='w-4 h-4 mr-1.5' />
                    }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setSearchType(tab.key)
                        router.push(`/properties?type=${tab.key}`)
                      }} // VOTRE LOGIQUE
                      className={cn(
                        'flex items-center px-3 sm:px-4 py-2.5 font-medium text-sm sm:text-base transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 rounded-t-md',
                        searchType === tab.key
                          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-slate-50 dark:bg-slate-700/50'
                          : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700/30'
                      )}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className='flex overflow-x-auto space-x-2.5 sm:space-x-3 mb-6 pb-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent'>
                  {propertyTypesData.map(
                    (
                      type // VOS propertyTypesData
                    ) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setSelectedPropertyType(type.id.toString())
                          router.push(
                            `/properties?propertyType=${
                              type.id
                            }&name=${encodeURIComponent(type.name)}`
                          )
                        }} // VOTRE LOGIQUE
                        className={cn(
                          'flex-shrink-0 group flex flex-col items-center p-2.5 w-20 h-20 sm:w-24 sm:h-24 justify-center rounded-lg transition-all duration-200 transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-800',
                          selectedPropertyType === type.id.toString()
                            ? 'bg-blue-100 dark:bg-blue-600/40 text-blue-700 dark:text-blue-300 shadow-md ring-1 ring-blue-300 dark:ring-blue-500'
                            : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                        )}
                      >
                        <span className='text-2xl sm:text-3xl mb-1 transition-transform duration-200 group-hover:scale-110'>
                          {type.icon}
                        </span>
                        <span className='text-xs font-medium'>{type.name}</span>
                      </button>
                    )
                  )}
                </div>

                <div className='flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-4'>
                  <div className='flex-1 relative'>
                    <MapPin className='absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none' />
                    <Input
                      placeholder='Enter location, address, city, or ZIP code'
                      className='h-12 text-base pl-11 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 rounded-md'
                      value={searchQuery} // VOTRE ÉTAT
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchQuery(e.target.value)
                      } // VOTRE GESTIONNAIRE
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                        e.key === 'Enter' && handleSearch()
                      }
                    />
                  </div>
                  <Button
                    onClick={handleSearch} // VOTRE GESTIONNAIRE
                    size='lg'
                    className='h-12 px-6 sm:px-8 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 rounded-md text-base'
                  >
                    <Search className='w-5 h-5 mr-2' />
                    Search
                  </Button>
                </div>

                <div className='flex flex-wrap gap-2.5 sm:gap-3 text-sm'>
                  {/* VOS SELECTS SONT PRÉSERVÉS */}
                  <Select>
                    <SelectTrigger className='w-full sm:w-auto sm:flex-1 md:w-44 h-10 dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 rounded-md text-slate-700 dark:text-slate-300'>
                      <SelectValue placeholder='Price Range' />
                    </SelectTrigger>
                    <SelectContent className='dark:bg-slate-700 dark:text-slate-100 border-slate-600'>
                      <SelectItem value='0-500k'>$0 - $500K</SelectItem>
                      <SelectItem value='500k-1m'>$500K - $1M</SelectItem>
                      <SelectItem value='1m-5m'>$1M - $5M</SelectItem>
                      <SelectItem value='5m+'>$5M+</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className='w-full sm:w-auto sm:flex-1 md:w-44 h-10 dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 rounded-md text-slate-700 dark:text-slate-300'>
                      <SelectValue placeholder='Size (sq ft)' />
                    </SelectTrigger>
                    <SelectContent className='dark:bg-slate-700 dark:text-slate-100 border-slate-600'>
                      <SelectItem value='0-5k'>0 - 5,000</SelectItem>
                      <SelectItem value='5k-10k'>5,000 - 10,000</SelectItem>
                      <SelectItem value='10k-25k'>10,000 - 25,000</SelectItem>
                      <SelectItem value='25k+'>25,000+</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant='link'
                    className='text-blue-600 dark:text-blue-400 hover:underline p-0 h-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm text-sm'
                  >
                    More Filters <ChevronDown className='w-4 h-4 ml-1' />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section
        ref={trustSectionRef}
        className={cn(
          'py-16 bg-white dark:bg-slate-800 transition-all duration-1000 ease-out',
          isTrustSectionOnScreen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-12'
        )}
      >
        <div className='container mx-auto px-4 text-center'>
          {/* VOTRE TEXTE PRÉSERVÉ */}
          <p className='text-lg text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto'>
            For over 30 years, LoopNet has been the trusted brand for Commercial
            Real Estate
          </p>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8'>
            {/* VOS STATS PRÉSERVÉES, juste un léger style ajouté */}
            {[
              {
                value: '300K+',
                label: 'Active Listings',
                icon: (
                  <Building2 className='w-10 h-10 text-blue-500 mb-3 mx-auto' />
                )
              },
              {
                value: '13M+',
                label: 'Monthly Visitors',
                icon: (
                  <Users className='w-10 h-10 text-green-500 mb-3 mx-auto' />
                )
              },
              {
                value: '$109B+',
                label: 'In Transaction Value',
                icon: (
                  <TrendingUp className='w-10 h-10 text-purple-500 mb-3 mx-auto' />
                )
              }
            ].map((stat, index) => (
              <div
                key={index}
                className={cn(
                  'p-6 bg-slate-100 dark:bg-slate-700/70 rounded-xl shadow-lg transition-all duration-500 ease-out hover:shadow-xl hover:scale-105',
                  isTrustSectionOnScreen
                    ? `opacity-100 scale-100 animation-delay-${index * 150}`
                    : 'opacity-0 scale-90'
                )}
              >
                {stat.icon}
                <div className='text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-2'>
                  {stat.value}
                </div>
                <div className='text-slate-600 dark:text-slate-400'>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Logos Carousel */}
      <section
        ref={companyLogosRef}
        className={cn(
          'py-12 bg-slate-50 dark:bg-slate-900/50 overflow-hidden transition-all duration-1000 ease-out',
          isCompanyLogosOnScreen ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className='container mx-auto px-4'>
          <h3 className='text-center text-xl font-semibold text-slate-700 dark:text-slate-300 mb-10'>
            Companies actively searching on LoopNet
          </h3>
          <div className='relative group'>
            <div className='flex animate-scroll-smooth space-x-12 md:space-x-16 items-center'>
              {companyLogos.map(
                (
                  company,
                  index // VOS companyLogos
                ) => (
                  <div
                    key={index}
                    className='flex-shrink-0 w-36 h-20 bg-white dark:bg-slate-800 rounded-lg shadow-md flex items-center justify-center p-4 transition-all duration-300 hover:shadow-xl hover:scale-105 grayscale hover:grayscale-0 opacity-75 hover:opacity-100 dark:opacity-60 dark:hover:opacity-100'
                    title={company}
                  >
                    <span className='text-sm font-medium text-slate-600 dark:text-slate-400 text-center'>
                      {company}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trending on LoopNet */}
      <section
        ref={trendingSectionRef}
        className={cn(
          'py-16 bg-white dark:bg-slate-800 transition-all duration-1000 ease-out',
          isTrendingSectionOnScreen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-12'
        )}
      >
        <div className='container mx-auto px-4'>
          <div className='flex flex-col sm:flex-row items-center justify-between mb-10'>
            <h2 className='text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3 sm:mb-0'>
              Trending on LoopNet
            </h2>
            <Link
              href='/properties'
              className='text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center group transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm'
            >
              See More
              <ChevronDown className='w-5 h-5 ml-1 transform rotate-[-90deg] group-hover:translate-x-1 transition-transform' />
            </Link>
          </div>

          <Tabs
            value={trendingTab}
            onValueChange={setTrendingTab}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-3 max-w-lg mx-auto mb-8 bg-slate-100 dark:bg-slate-700 rounded-lg p-1 shadow-sm'>
              {Object.keys(trendingPropertiesData).map(
                (
                  key // VOS trendingPropertiesData
                ) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className='data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-md data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-300 rounded-md h-10 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-700'
                  >
                    {key.replace(/([A-Z])/g, ' $1').trim()}{' '}
                    {/* Pour "ForLease" -> "For Lease" */}
                  </TabsTrigger>
                )
              )}
            </TabsList>

            {Object.entries(trendingPropertiesData).map(
              (
                [key, trendProps] // VOS trendingPropertiesData
              ) => (
                <TabsContent
                  key={key}
                  value={key}
                  className='mt-8 focus:outline-none'
                >
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {trendProps.map(
                      (
                        property,
                        idx // VOS données de propriété de tendance
                      ) => (
                        <div
                          key={property.id}
                          className={cn(
                            'transition-all duration-500 ease-out',
                            isTrendingSectionOnScreen
                              ? `opacity-100 translate-y-0 animation-delay-${
                                  idx * 100
                                }`
                              : 'opacity-0 translate-y-8'
                          )}
                        >
                          <Card className='overflow-hidden group hover:shadow-2xl dark:bg-slate-700/80 dark:border-slate-600 transition-all duration-300 transform hover:-translate-y-1.5 rounded-xl'>
                            <CardHeader className='p-0 relative'>
                              <Link
                                href={`/mock-property/${property.id}`}
                                legacyBehavior
                              >
                                <a className='block aspect-[4/3] relative overflow-hidden rounded-t-xl'>
                                  <Image
                                    src={property.image}
                                    alt={property.type}
                                    fill
                                    className='object-cover group-hover:scale-110 transition-transform duration-500'
                                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                                    quality={70}
                                  />
                                  <Badge
                                    variant='secondary'
                                    className='absolute top-3 left-3 z-10 bg-blue-600 text-white dark:bg-blue-500 dark:text-slate-900 shadow-md text-xs px-2 py-1'
                                  >
                                    {property.type}
                                  </Badge>
                                  <div className='absolute top-3 right-3 z-10'>
                                    <Button
                                      asChild
                                      size='icon'
                                      variant='ghost'
                                      className='w-9 h-9 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 backdrop-blur-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0'
                                    >
                                      <button
                                        aria-label='Ajouter aux favoris'
                                        title='Ajouter aux favoris'
                                      >
                                        <Heart className='w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-red-500 dark:group-hover:text-red-400 group-hover:fill-red-500/20 transition-all' />
                                      </button>
                                    </Button>
                                  </div>
                                </a>
                              </Link>
                            </CardHeader>
                            <CardContent className='p-4'>
                              <Link
                                href={`/mock-property/${property.id}`}
                                legacyBehavior
                              >
                                <a className='block'>
                                  <h3 className='font-semibold text-blue-700 dark:text-blue-400 text-md mb-1 hover:underline leading-tight'>
                                    {property.price}
                                  </h3>
                                  <p
                                    className='text-sm text-slate-700 dark:text-slate-300 mb-1 truncate group-hover:text-clip group-hover:whitespace-normal'
                                    title={property.address}
                                  >
                                    {property.address}
                                  </p>
                                  <p className='text-xs text-slate-500 dark:text-slate-400'>
                                    {property.size}
                                  </p>
                                </a>
                              </Link>
                            </CardContent>
                          </Card>
                        </div>
                      )
                    )}
                  </div>
                </TabsContent>
              )
            )}
          </Tabs>
        </div>
      </section>

      {/* Featured Properties from Database */}
      <section
        ref={featuredSectionRef}
        className={cn(
          'py-16 bg-slate-100 dark:bg-slate-800/50 transition-all duration-1000 ease-out',
          isFeaturedSectionOnScreen ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className='container mx-auto px-4'>
          <div className='flex flex-col sm:flex-row items-center justify-between mb-12'>
            <div>
              <h2 className='text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2'>
                Featured Properties
              </h2>
              <p className='text-slate-600 dark:text-slate-400'>
                Discover our best investment opportunities
              </p>{' '}
              {/* VOTRE TEXTE */}
            </div>
            <Link href='/properties' passHref legacyBehavior>
              <Button
                variant='outline'
                size='lg'
                className='mt-4 sm:mt-0 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md'
              >
                View All Properties{' '}
                <ChevronDown className='w-5 h-5 ml-2 transform rotate-[-90deg] group-hover:translate-x-1 transition-transform' />
              </Button>
            </Link>
          </div>

          {loading ? ( // VOTRE LOGIQUE DE CHARGEMENT
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className='bg-white dark:bg-slate-700 rounded-xl shadow-lg h-96 animate-pulse'
                />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {properties.slice(0, 8).map(
                (
                  propertyData,
                  idx // VOS DONNÉES DE `useProperties`
                ) => (
                  <div
                    key={propertyData._id}
                    className={cn(
                      'transition-all duration-500 ease-out',
                      isFeaturedSectionOnScreen
                        ? `opacity-100 translate-y-0 animation-delay-${
                            idx * 100
                          }`
                        : 'opacity-0 translate-y-10'
                    )}
                  >
                    {/* Assurez-vous que `propertyData` est compatible avec les props de `PropertyCard` */}
                    <PropertyCard property={propertyData as any} />
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Live Auction Section */}
      <section
        ref={auctionSectionRef}
        className={cn(
          'py-20 bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-600 text-white transition-all duration-1000 ease-out',
          isAuctionSectionOnScreen
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95'
        )}
      >
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div
              className={cn(
                'bg-white/10 dark:bg-black/20 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl transition-all duration-500 ease-out',
                isAuctionSectionOnScreen
                  ? 'translate-x-0 opacity-100'
                  : '-translate-x-10 opacity-0'
              )}
            >
              <div className='flex items-center space-x-3 mb-6'>
                <Badge
                  variant='destructive'
                  className='text-sm px-3 py-1 bg-red-500 border-red-500 shadow-md'
                >
                  <Clock className='w-4 h-4 mr-2 animate-pulse' /> LIVE
                </Badge>
                <span className='text-lg font-semibold opacity-90'>
                  Auction Ending Soon
                </span>
              </div>
              {/* VOS DONNÉES D'ENCHÈRE STATIQUES */}
              <h3 className='text-3xl font-bold mb-2'>Health Care</h3>
              <p className='text-lg mb-6 opacity-80 flex items-center'>
                <MapPin className='w-5 h-5 mr-2 opacity-70' /> Boynton Beach, FL
              </p>
              <div className='flex items-center justify-center space-x-1.5 sm:space-x-3 mb-8 p-4 bg-white/5 dark:bg-black/10 rounded-lg shadow-inner'>
                {/* VOTRE LOGIQUE `timeLeft` */}
                {[
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds }
                ]
                  .map(time => (
                    <div key={time.label} className='text-center px-1'>
                      <div className='text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500 tabular-nums leading-none'>
                        {formatTime(time.value)}
                      </div>
                      <div className='text-xs sm:text-sm opacity-70 uppercase tracking-wider mt-1'>
                        {time.label}
                      </div>
                    </div>
                  ))
                  .reduce((prev, curr, index, arr) => {
                    prev.push(curr)
                    if (index < arr.length / 2 - 1) {
                      prev.push(
                        <div
                          key={`sep-${index}`}
                          className='text-xl sm:text-2xl md:text-3xl opacity-50 pt-1'
                        >
                          :
                        </div>
                      )
                    }
                    return prev
                  }, [] as React.ReactNode[])}
              </div>
              <div className='text-center'>
                <div className='text-sm opacity-80 mb-1'>Starting Bid</div>
                <div className='text-3xl md:text-4xl font-bold'>$1,750,000</div>
              </div>{' '}
              {/* VOS DONNÉES STATIQUES */}
              <Button
                size='xl'
                className='w-full mt-8 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-700 rounded-lg py-3.5'
              >
                Place Your Bid
              </Button>
            </div>
            <div
              className={cn(
                'transition-all duration-500 ease-out delay-200',
                isAuctionSectionOnScreen
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-10 opacity-0'
              )}
            >
              {/* VOTRE TEXTE STATIQUE */}
              <h2 className='text-3xl md:text-4xl font-bold mb-6'>
                Discover Your Next Investment at Auction
              </h2>
              <p className='text-lg md:text-xl mb-8 opacity-90 leading-relaxed'>
                Identify and bid on quality assets through our transparent and
                competitive platform—all online. Join the investors worldwide
                who have partnered with us to successfully transact 11,000+
                properties.
              </p>
              <div className='flex flex-col sm:flex-row gap-4'>
                <Button
                  size='xl'
                  variant='secondary'
                  className='bg-white/90 hover:bg-white text-purple-700 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-purple-600 transition-transform transform hover:scale-105 rounded-lg px-8 py-3.5 text-base'
                >
                  Learn More About Auctions
                </Button>
                <Button
                  size='xl'
                  variant='outline'
                  className='border-white/50 text-white hover:bg-white/10 dark:border-slate-400 dark:hover:bg-slate-700/50 transition-transform transform hover:scale-105 rounded-lg px-8 py-3.5 text-base'
                >
                  View Auction Listings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities Carousel */}
      <section
        ref={citiesSectionRef}
        className={cn(
          'py-16 bg-slate-100 dark:bg-slate-800/50 transition-all duration-1000 ease-out',
          isCitiesSectionOnScreen ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-12'>
            Explore Popular Cities
          </h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6'>
            {popularCitiesData.map(
              (
                city,
                index // VOS popularCitiesData
              ) => (
                <Link
                  key={index}
                  href={`/search/${city.name.toLowerCase().replace(' ', '-')}`} // VOTRE LOGIQUE DE LIEN
                  className={cn(
                    'block group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800',
                    isCitiesSectionOnScreen
                      ? `opacity-100 scale-100 animation-delay-${index * 100}`
                      : 'opacity-0 scale-90'
                  )}
                >
                  <div className='relative aspect-[3/4]'>
                    {' '}
                    {/* Ratio d'aspect pour la cohérence */}
                    <Image
                      src={city.image}
                      alt={city.name}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-500'
                      sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw'
                      quality={70}
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent'></div>
                    <div className='absolute bottom-0 left-0 p-3 sm:p-4 w-full'>
                      <h3 className='font-semibold text-md sm:text-lg text-white group-hover:text-blue-300 transition-colors drop-shadow-md text-center sm:text-left'>
                        {city.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Commercial Real Estate Explained */}
      <section
        ref={articlesSectionRef}
        className={cn(
          'py-16 bg-white dark:bg-slate-800 transition-all duration-1000 ease-out',
          isArticlesSectionOnScreen ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className='container mx-auto px-4'>
          <div className='flex flex-col sm:flex-row items-center justify-between mb-12'>
            <h2 className='text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3 sm:mb-0'>
              Commercial Real Estate Explained
            </h2>{' '}
            {/* VOTRE TITRE */}
            <Link
              href='/cre-explained'
              className='text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center group transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm'
            >
              See More{' '}
              <ChevronDown className='w-5 h-5 ml-1 transform rotate-[-90deg] group-hover:translate-x-1 transition-transform' />
            </Link>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {educationalArticlesData.map(
              (
                article,
                index // VOS educationalArticlesData
              ) => (
                <Card
                  key={index}
                  className={cn(
                    'overflow-hidden group hover:shadow-2xl dark:bg-slate-700/80 dark:border-slate-600 transition-all duration-500 transform hover:-translate-y-1.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800 rounded-xl',
                    isArticlesSectionOnScreen
                      ? `opacity-100 translate-y-0 animation-delay-${
                          index * 150
                        }`
                      : 'opacity-0 translate-y-8'
                  )}
                >
                  <Link href={`/articles/mock-article-${index}`} legacyBehavior>
                    <a className='h-full flex flex-col'>
                      {' '}
                      {/* Assurer que la carte prend toute la hauteur et est flex col */}
                      <div className='aspect-[16/9] overflow-hidden relative rounded-t-xl'>
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className='object-cover group-hover:scale-105 transition-transform duration-500'
                          sizes='(max-width: 768px) 100vw, 33vw'
                          quality={70}
                        />
                      </div>
                      <CardContent className='p-5 sm:p-6 flex-grow flex flex-col'>
                        {' '}
                        {/* flex-grow ici */}
                        <h3 className='font-semibold text-lg text-slate-800 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight'>
                          {article.title}
                        </h3>
                        <p className='text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-3 leading-relaxed flex-grow'>
                          {article.description}
                        </p>{' '}
                        {/* flex-grow ici */}
                        <span className='inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline mt-auto pt-2'>
                          {' '}
                          {/* mt-auto pour pousser en bas */}
                          Read article{' '}
                          <ChevronDown className='w-4 h-4 ml-1 transform rotate-[-90deg] transition-transform' />
                        </span>
                      </CardContent>
                    </a>
                  </Link>
                </Card>
              )
            )}
          </div>
        </div>
      </section>

      {/* Marketing to Listers */}
      <section
        ref={marketingSectionRef}
        className={cn(
          'py-20 bg-blue-600 dark:bg-blue-700 text-white transition-all duration-1000 ease-out',
          isMarketingSectionOnScreen ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className='container mx-auto px-4'>
          {/* VOTRE CONTENU MARKETING STATIQUE */}
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>
              LoopNet Listings Lease or Sell 14% Faster*
            </h2>
            <p className='text-lg opacity-90 max-w-2xl mx-auto'>
              Reach millions of active tenants and investors. Our platform is
              designed to get your property noticed and leased or sold quickly.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
            {[
              {
                icon: <Users className='w-10 h-10' />,
                title: 'Right Audience',
                desc: '96% of the Fortune 1000 search on LoopNet.'
              },
              {
                icon: <Star className='w-10 h-10' />,
                title: 'Engage Prospects',
                desc: 'Stunning photography, videos and drone shots.'
              },
              {
                icon: <TrendingUp className='w-10 h-10' />,
                title: 'More Opportunity',
                desc: 'Find a tenant or buyer, faster than before.'
              }
            ].map((item, index) => (
              <div
                key={item.title}
                className={cn(
                  'text-center p-6 md:p-8 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-xl shadow-xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl',
                  isMarketingSectionOnScreen
                    ? `opacity-100 translate-y-0 animation-delay-${index * 100}`
                    : 'opacity-0 translate-y-5'
                )}
              >
                <div className='w-20 h-20 bg-white/20 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md ring-1 ring-white/20'>
                  {item.icon}
                </div>
                <h3 className='text-2xl font-semibold mb-3'>{item.title}</h3>
                <p className='opacity-80 text-sm leading-relaxed'>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <div className='text-center'>
            <Button
              size='xl'
              variant='secondary'
              className='bg-white/90 hover:bg-white text-blue-700 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-blue-600 transition-transform transform hover:scale-105 rounded-lg px-10 py-3.5 text-base sm:text-lg'
            >
              Explore Marketing Solutions
            </Button>
            <p className='text-xs opacity-75 mt-6 max-w-md mx-auto'>
              *Based on internal analysis comparing properties advertised on
              LoopNet to properties listed only on CoStar.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        ref={faqSectionRef}
        className={cn(
          'py-16 bg-slate-100 dark:bg-slate-800/50 transition-all duration-1000 ease-out',
          isFaqSectionOnScreen ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-12'>
            Commercial Real Estate Fundamentals: Essential Questions for
            Investors & Businesses
          </h2>{' '}
          {/* VOTRE TITRE */}
          <div className='max-w-3xl mx-auto space-y-4 sm:space-y-5'>
            {/* VOTRE STRUCTURE DE DONNÉES FAQ */}
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
              <Card
                key={index}
                className={cn(
                  'bg-white dark:bg-slate-700 shadow-md hover:shadow-lg dark:border-slate-600 transition-all duration-500 ease-out rounded-lg',
                  isFaqSectionOnScreen
                    ? `opacity-100 translate-x-0 animation-delay-${index * 100}`
                    : 'opacity-0 -translate-x-5'
                )}
              >
                <CardContent className='p-0'>
                  <details className='group p-5 sm:p-6'>
                    <summary className='flex items-center justify-between cursor-pointer list-none font-semibold text-lg text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm'>
                      <span className='flex-1 pr-2'>{faq.question}</span>{' '}
                      {/* pr-2 pour espacement avec icône */}
                      <ChevronDown className='w-5 h-5 text-slate-500 dark:text-slate-400 group-open:rotate-180 transition-transform duration-300 transform flex-shrink-0' />
                    </summary>
                    <div className='grid grid-rows-[0fr] group-open:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out'>
                      <div className='overflow-hidden'>
                        <p className='mt-4 text-slate-600 dark:text-slate-300 leading-relaxed text-base pt-4 border-t border-slate-200 dark:border-slate-600'>
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </details>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-slate-900 dark:bg-black text-slate-300 dark:text-slate-400 py-16'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-10'>
            {' '}
            {/* Ajustement des colonnes pour plus de responsivité */}
            <div className='col-span-2 md:col-span-4 lg:col-span-2 pr-8'>
              {' '}
              {/* Ajustement du span */}
              <Link href='/' className='flex items-center space-x-2 mb-4 group'>
                <Building2 className='h-8 w-8 text-blue-500 group-hover:text-blue-400 transition-colors' />
                <span className='text-2xl font-bold text-white group-hover:text-slate-200 transition-colors'>
                  LoopNet
                </span>
              </Link>
              <p className='text-sm mb-6 leading-relaxed'>
                The leading commercial real estate marketplace connecting
                buyers, sellers, and industry professionals worldwide.
              </p>
            </div>
            {/* VOTRE STRUCTURE DE LIENS FOOTER PRÉSERVÉE */}
            <div>
              {' '}
              <h3 className='font-semibold text-white mb-4 text-base'>
                For Sale
              </h3>{' '}
              <ul className='space-y-2 text-gray-400 text-sm'>
                {' '}
                <li>
                  <Link href='#' className='hover:text-white'>
                    Office Buildings for Sale
                  </Link>
                </li>{' '}
                {/* ... autres liens */}{' '}
              </ul>{' '}
            </div>
            <div>
              {' '}
              <h3 className='font-semibold text-white mb-4 text-base'>
                For Lease
              </h3>{' '}
              <ul className='space-y-2 text-gray-400 text-sm'>
                {' '}
                <li>
                  <Link href='#' className='hover:text-white'>
                    Office Space for Lease
                  </Link>
                </li>{' '}
                {/* ... autres liens */}{' '}
              </ul>{' '}
            </div>
            <div>
              {' '}
              <h3 className='font-semibold text-white mb-4 text-base'>
                Resources
              </h3>{' '}
              <ul className='space-y-2 text-gray-400 text-sm'>
                {' '}
                <li>
                  <Link href='#' className='hover:text-white'>
                    Market Data
                  </Link>
                </li>{' '}
                {/* ... autres liens */}{' '}
              </ul>{' '}
            </div>
            <div>
              {' '}
              <h3 className='font-semibold text-white mb-4 text-base'>
                Company
              </h3>{' '}
              <ul className='space-y-2 text-gray-400 text-sm'>
                {' '}
                <li>
                  <Link href='#' className='hover:text-white'>
                    About
                  </Link>
                </li>{' '}
                {/* ... autres liens */}{' '}
              </ul>{' '}
            </div>
          </div>
          <div className='border-t border-slate-800 dark:border-slate-700 mt-10 pt-10 text-center text-sm'>
            <p>
              © {new Date().getFullYear()} LoopNet Clone. All rights reserved.
            </p>{' '}
            {/* VOTRE TEXTE */}
            <p className='mt-2'>
              <Link href='/terms' className='hover:underline mx-2'>
                Terms of Service
              </Link>{' '}
              |
              <Link href='/privacy' className='hover:underline mx-2'>
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
