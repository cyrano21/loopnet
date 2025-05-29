"use client"

import { BookOpen, TrendingUp, Calculator, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CREExplainedPage() {
  const categories = [
    {
      title: "Getting Started",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600",
      articles: [
        {
          title: "10 Reasons to Hire a Commercial Real Estate Broker",
          description: "A Tenant Rep Can Help Your Business Find and Execute the Perfect Lease",
          readTime: "5 min read",
          image: "/placeholder.svg?height=200&width=300&text=CRE+Broker",
        },
        {
          title: "Commercial vs. Residential Real Estate Investing",
          description: "Understanding the Differences, Benefits, and Risks",
          readTime: "8 min read",
          image: "/placeholder.svg?height=200&width=300&text=Commercial+vs+Residential",
        },
      ],
    },
    {
      title: "Finance & Leasing",
      icon: Calculator,
      color: "bg-green-100 text-green-600",
      articles: [
        {
          title: "Lease Terms Commercial Investors Need to Know",
          description: "Understand the essential terms when leasing commercial space",
          readTime: "6 min read",
          image: "/placeholder.svg?height=200&width=300&text=Lease+Terms",
        },
        {
          title: "The 3 Most Common Types of Commercial Leases",
          description: "Understanding Gross, Net, and Percentage Lease Structures",
          readTime: "7 min read",
          image: "/placeholder.svg?height=200&width=300&text=Lease+Types",
        },
      ],
    },
    {
      title: "Investment Strategies",
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
      articles: [
        {
          title: "Commercial Real Estate Investment Strategies",
          description: "Essential Guidelines for Success in Commercial Property Investment",
          readTime: "10 min read",
          image: "/placeholder.svg?height=200&width=300&text=Investment+Strategies",
        },
        {
          title: "Understanding Opportunity Zones and Their Impact",
          description: "A Chance To Save On Taxes Through Investments Meant To Help Communities",
          readTime: "9 min read",
          image: "/placeholder.svg?height=200&width=300&text=Opportunity+Zones",
        },
      ],
    },
  ]

  const featuredTools = [
    {
      title: "Cap Rate Calculator",
      description: "Calculate capitalization rates for investment properties",
      icon: Calculator,
      link: "/tools/cap-rate-calculator",
    },
    {
      title: "NOI Calculator",
      description: "Determine Net Operating Income for your properties",
      icon: FileText,
      link: "/tools/noi-calculator",
    },
    {
      title: "Market Analysis Tool",
      description: "Analyze market trends and comparable properties",
      icon: TrendingUp,
      link: "/tools/market-analysis",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Commercial Real Estate Explained</h1>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Your comprehensive guide to understanding commercial real estate investing, leasing, financing, and market
            analysis.
          </p>
          <Button size="lg" variant="secondary">
            Start Learning
          </Button>
        </div>
      </section>

      {/* Categories and Articles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              <div className="flex items-center space-x-3 mb-8">
                <div className={`p-3 rounded-lg ${category.color}`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold">{category.title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {category.articles.map((article, articleIndex) => (
                  <Card key={articleIndex} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline">{category.title}</Badge>
                        <span className="text-sm text-gray-500">{article.readTime}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-3">{article.title}</h3>
                      <p className="text-gray-600 mb-4">{article.description}</p>
                      <Button variant="outline" size="sm">
                        Read Article
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">CRE Tools & Calculators</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTools.map((tool, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <tool.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle>{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  <Button asChild>
                    <Link href={tool.link}>Use Tool</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with CRE Insights</h2>
          <p className="text-xl mb-8 opacity-90">
            Get the latest commercial real estate education and market insights delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-lg text-gray-900" />
            <Button size="lg" variant="secondary">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
