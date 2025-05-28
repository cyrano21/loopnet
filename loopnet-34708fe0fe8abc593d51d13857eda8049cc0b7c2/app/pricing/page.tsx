"use client"

import { useState } from "react"
import { Check, Star, Zap, Crown, Building2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const router = useRouter()

  const plans = [
    {
      name: "Basic",
      description: "Perfect for individual property owners",
      monthlyPrice: 29,
      annualPrice: 290,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      features: [
        "Up to 5 property listings",
        "Basic analytics dashboard",
        "Email support",
        "Standard listing visibility",
        "Mobile app access",
        "Basic lead management",
      ],
      limitations: ["No premium placement", "Limited photo uploads (10 per property)", "Basic search visibility"],
    },
    {
      name: "Professional",
      description: "Ideal for real estate agents and small brokerages",
      monthlyPrice: 99,
      annualPrice: 990,
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      popular: true,
      features: [
        "Up to 25 property listings",
        "Advanced analytics & reporting",
        "Priority email & phone support",
        "Premium listing placement",
        "Unlimited photo uploads",
        "Advanced lead management & CRM",
        "AI-powered property descriptions",
        "Market analysis tools",
        "Custom branding",
        "Lead scoring & qualification",
        "Email marketing campaigns",
        "Virtual tour integration",
      ],
      limitations: ["Limited to 25 listings", "Standard API access"],
    },
    {
      name: "Enterprise",
      description: "For large brokerages and property management companies",
      monthlyPrice: 299,
      annualPrice: 2990,
      icon: Crown,
      color: "text-gold-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      features: [
        "Unlimited property listings",
        "Advanced AI analytics & predictions",
        "24/7 dedicated support",
        "Premium placement & featured listings",
        "White-label solution",
        "Advanced CRM & automation",
        "AI market analysis & pricing",
        "Custom integrations & API",
        "Multi-user team management",
        "Advanced reporting & insights",
        "Custom marketing materials",
        "Dedicated account manager",
        "Training & onboarding",
        "Custom AI models",
        "Bulk import/export tools",
        "Advanced security features",
      ],
      limitations: [],
    },
  ]

  const addOns = [
    {
      name: "AI Property Valuation",
      description: "Advanced AI-powered property valuation and market analysis",
      price: 49,
      icon: Zap,
    },
    {
      name: "Premium Marketing Suite",
      description: "Professional marketing materials, virtual tours, and social media tools",
      price: 79,
      icon: Star,
    },
    {
      name: "Advanced Analytics",
      description: "Deep market insights, competitor analysis, and predictive analytics",
      price: 39,
      icon: Building2,
    },
  ]

  const handleSelectPlan = async (planName: string) => {
    // Redirect to checkout with selected plan
    router.push(`/checkout?plan=${planName.toLowerCase()}&billing=${isAnnual ? "annual" : "monthly"}`)
  }

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
                <Link href="/pricing" className="text-blue-600 font-medium">
                  Pricing
                </Link>
                <Link href="/professionals" className="text-gray-700 hover:text-blue-600">
                  Professionals
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Sign In</Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Unlock the full potential of commercial real estate with our comprehensive platform. From basic listings to
            AI-powered market analysis.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`font-medium ${!isAnnual ? "text-blue-600" : "text-gray-600"}`}>Monthly</span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span className={`font-medium ${isAnnual ? "text-blue-600" : "text-gray-600"}`}>
              Annual
              <Badge className="ml-2 bg-green-100 text-green-800">Save 20%</Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden ${plan.borderColor} ${
                plan.popular ? "ring-2 ring-purple-600 scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-purple-600 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader className={`${plan.bgColor} ${plan.popular ? "pt-12" : "pt-6"}`}>
                <div className="flex items-center justify-center mb-4">
                  <plan.icon className={`h-12 w-12 ${plan.color}`} />
                </div>
                <CardTitle className="text-center text-2xl">{plan.name}</CardTitle>
                <p className="text-center text-gray-600">{plan.description}</p>
                <div className="text-center">
                  <div className="text-4xl font-bold">
                    ${isAnnual ? Math.floor(plan.annualPrice / 12) : plan.monthlyPrice}
                    <span className="text-lg font-normal text-gray-600">/month</span>
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-green-600 font-medium">Billed annually (${plan.annualPrice}/year)</p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Button
                  className="w-full mb-6"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleSelectPlan(plan.name)}
                >
                  {plan.popular ? "Start Free Trial" : "Get Started"}
                </Button>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">✓ Included Features</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-600 mb-2">Limitations</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-gray-400">•</span>
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add-ons Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Powerful Add-ons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addOns.map((addon, index) => (
              <Card key={index} className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
                <CardContent className="p-6 text-center">
                  <addon.icon className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{addon.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{addon.description}</p>
                  <div className="text-2xl font-bold text-blue-600 mb-4">+${addon.price}/month</div>
                  <Button variant="outline" className="w-full">
                    Add to Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Enterprise Contact */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="text-xl mb-6 opacity-90">
              Large enterprise? Custom requirements? Let's build something perfect for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Contact Sales
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600"
              >
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-gray-600 text-sm">
                Yes, all plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 text-sm">
                We accept all major credit cards, PayPal, and bank transfers for enterprise plans.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600 text-sm">Yes, we offer a 30-day money-back guarantee for all annual plans.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
