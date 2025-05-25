import { Search, MapPin, Building2, Star, Phone, Mail, Award } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfessionalsPage() {
  const professionals = [
    {
      id: 1,
      name: "John Smith",
      title: "Senior Commercial Broker",
      company: "Premier Commercial Realty",
      location: "San Francisco, CA",
      specialties: ["Office", "Retail"],
      rating: 4.9,
      reviews: 127,
      yearsExperience: 15,
      totalTransactions: 245,
      totalVolume: "$125M",
      image: "/placeholder.svg?height=120&width=120",
      certifications: ["CCIM", "SIOR"],
      phone: "(555) 123-4567",
      email: "john.smith@premier.com",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      title: "Industrial Specialist",
      company: "Industrial Properties Group",
      location: "Los Angeles, CA",
      specialties: ["Industrial", "Warehouse"],
      rating: 4.8,
      reviews: 89,
      yearsExperience: 12,
      totalTransactions: 189,
      totalVolume: "$98M",
      image: "/placeholder.svg?height=120&width=120",
      certifications: ["SIOR", "LEED AP"],
      phone: "(555) 234-5678",
      email: "sarah.johnson@ipg.com",
    },
    {
      id: 3,
      name: "Mike Davis",
      title: "Investment Sales Director",
      company: "Capital Investment Advisors",
      location: "New York, NY",
      specialties: ["Investment", "Office"],
      rating: 4.9,
      reviews: 156,
      yearsExperience: 18,
      totalTransactions: 312,
      totalVolume: "$275M",
      image: "/placeholder.svg?height=120&width=120",
      certifications: ["CCIM", "MAI"],
      phone: "(555) 345-6789",
      email: "mike.davis@cia.com",
    },
    {
      id: 4,
      name: "Lisa Chen",
      title: "Medical Real Estate Specialist",
      company: "Healthcare Properties LLC",
      location: "Austin, TX",
      specialties: ["Medical", "Healthcare"],
      rating: 4.7,
      reviews: 73,
      yearsExperience: 10,
      totalTransactions: 134,
      totalVolume: "$67M",
      image: "/placeholder.svg?height=120&width=120",
      certifications: ["CCIM", "CPM"],
      phone: "(555) 456-7890",
      email: "lisa.chen@healthcare.com",
    },
    {
      id: 5,
      name: "Robert Wilson",
      title: "Retail Leasing Expert",
      company: "Retail Solutions Group",
      location: "Miami, FL",
      specialties: ["Retail", "Shopping Centers"],
      rating: 4.8,
      reviews: 94,
      yearsExperience: 14,
      totalTransactions: 201,
      totalVolume: "$89M",
      image: "/placeholder.svg?height=120&width=120",
      certifications: ["ICSC", "SIOR"],
      phone: "(555) 567-8901",
      email: "robert.wilson@retail.com",
    },
    {
      id: 6,
      name: "Jennifer Lee",
      title: "Mixed-Use Development Advisor",
      company: "Urban Development Partners",
      location: "Seattle, WA",
      specialties: ["Mixed Use", "Development"],
      rating: 4.9,
      reviews: 112,
      yearsExperience: 16,
      totalTransactions: 167,
      totalVolume: "$156M",
      image: "/placeholder.svg?height=120&width=120",
      certifications: ["CCIM", "ULI"],
      phone: "(555) 678-9012",
      email: "jennifer.lee@urban.com",
    },
  ]

  const topBrokerages = [
    {
      name: "CBRE Group",
      agents: 1250,
      totalVolume: "$2.1B",
      avgRating: 4.8,
      specialties: ["Office", "Industrial", "Retail"],
    },
    {
      name: "JLL (Jones Lang LaSalle)",
      agents: 980,
      totalVolume: "$1.8B",
      avgRating: 4.7,
      specialties: ["Office", "Investment", "Industrial"],
    },
    {
      name: "Cushman & Wakefield",
      agents: 875,
      totalVolume: "$1.5B",
      avgRating: 4.6,
      specialties: ["Office", "Retail", "Industrial"],
    },
    {
      name: "Colliers International",
      agents: 720,
      totalVolume: "$1.2B",
      avgRating: 4.7,
      specialties: ["Office", "Industrial", "Investment"],
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
                <Link href="/properties" className="text-gray-700 hover:text-blue-600">
                  Properties
                </Link>
                <Link href="/market-data" className="text-gray-700 hover:text-blue-600">
                  Market Data
                </Link>
                <Link href="/professionals" className="text-blue-600 font-medium">
                  Professionals
                </Link>
                <Link href="/news" className="text-gray-700 hover:text-blue-600">
                  News
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Sign In</Button>
              <Button>Join as Professional</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Commercial Real Estate Professionals</h1>
          <p className="text-gray-600 mb-6">
            Connect with experienced brokers, agents, and industry experts in your area
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input placeholder="Search by name, company, or location..." className="h-12" />
            </div>
            <Select>
              <SelectTrigger className="w-48 h-12">
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48 h-12">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="california">California</SelectItem>
                <SelectItem value="texas">Texas</SelectItem>
                <SelectItem value="florida">Florida</SelectItem>
                <SelectItem value="newyork">New York</SelectItem>
              </SelectContent>
            </Select>
            <Button className="h-12 px-6">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Brokerages */}
            <Card>
              <CardHeader>
                <CardTitle>Top Brokerages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topBrokerages.map((brokerage, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <h3 className="font-medium mb-1">{brokerage.name}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>Agents:</span>
                        <span>{brokerage.agents}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Volume:</span>
                        <span>{brokerage.totalVolume}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Rating:</span>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{brokerage.avgRating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {brokerage.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Network Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">15,000+</div>
                  <div className="text-sm text-gray-600">Active Professionals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">$50B+</div>
                  <div className="text-sm text-gray-600">Annual Transaction Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-600">Markets Covered</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Commercial Real Estate Professionals</h2>
                <p className="text-gray-600">{professionals.length} professionals found</p>
              </div>
              <Select defaultValue="rating">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="experience">Most Experience</SelectItem>
                  <SelectItem value="volume">Highest Volume</SelectItem>
                  <SelectItem value="transactions">Most Transactions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Professionals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {professionals.map((professional) => (
                <Card key={professional.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={professional.image || "/placeholder.svg"} alt={professional.name} />
                        <AvatarFallback>
                          {professional.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{professional.name}</h3>
                        <p className="text-gray-600">{professional.title}</p>
                        <p className="text-sm text-gray-500">{professional.company}</p>
                        <div className="flex items-center mt-1">
                          <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{professional.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">{professional.rating}</span>
                        <span className="text-gray-500 text-sm ml-1">({professional.reviews} reviews)</span>
                      </div>
                      <div className="text-sm text-gray-600">{professional.yearsExperience} years exp.</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <div className="text-gray-600">Transactions</div>
                        <div className="font-medium">{professional.totalTransactions}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Total Volume</div>
                        <div className="font-medium">{professional.totalVolume}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">Specialties</div>
                      <div className="flex flex-wrap gap-1">
                        {professional.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">Certifications</div>
                      <div className="flex flex-wrap gap-1">
                        {professional.certifications.map((cert, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800">
                            <Award className="w-3 h-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                      <Button variant="outline" className="flex-1" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                <Button variant="outline" disabled>
                  Previous
                </Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
