import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Advertisement from "@/models/Advertisement"

export async function POST() {
  try {
    await connectToDatabase()

    // Supprimer les anciennes publicités
    await Advertisement.deleteMany({})

    const sampleAdvertisements = [
      {
        title: "Bannière Homepage - Investissement Immobilier",
        description: "Publicité pour plateforme d'investissement immobilier",
        type: "banner",
        position: "homepage",
        imageUrl: "/placeholder.svg?height=200&width=800&query=investment+real+estate+banner",
        targetUrl: "https://example-investment.com",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        budget: 5000,
        costPerClick: 2.5,
        advertiser: {
          name: "InvestPro",
          email: "contact@investpro.com",
          company: "InvestPro Solutions",
        },
        priority: 5,
        impressions: 12500,
        clicks: 340,
      },
      {
        title: "Sidebar - Assurance Immobilière",
        description: "Assurance pour propriétaires et investisseurs",
        type: "sidebar",
        position: "properties",
        imageUrl: "/placeholder.svg?height=400&width=300&query=insurance+real+estate+sidebar",
        targetUrl: "https://example-insurance.com",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-06-30"),
        budget: 3000,
        costPerClick: 1.8,
        advertiser: {
          name: "AssuranceMax",
          email: "pub@assurancemax.fr",
          company: "AssuranceMax France",
        },
        priority: 3,
        impressions: 8900,
        clicks: 156,
      },
      {
        title: "Banner Propriétés - Financement",
        description: "Solutions de financement immobilier",
        type: "banner",
        position: "property-details",
        imageUrl: "/placeholder.svg?height=150&width=600&query=financing+real+estate+banner",
        targetUrl: "https://example-financing.com",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-08-31"),
        budget: 4200,
        costPerClick: 3.2,
        advertiser: {
          name: "FinanceImmo",
          email: "marketing@financeimmo.fr",
          company: "Finance Immo Solutions",
        },
        priority: 4,
        impressions: 6750,
        clicks: 203,
      },
      {
        title: "Popup - Évaluation Gratuite",
        description: "Service d'évaluation immobilière gratuite",
        type: "popup",
        position: "search-results",
        imageUrl: "/placeholder.svg?height=300&width=500&query=property+valuation+popup",
        targetUrl: "https://example-valuation.com",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-07-15"),
        budget: 2800,
        costPerClick: 4.5,
        advertiser: {
          name: "EvalExpert",
          email: "contact@evalexpert.fr",
          company: "Eval Expert France",
        },
        priority: 2,
        impressions: 4200,
        clicks: 89,
      },
      {
        title: "Inline - Gestion Locative",
        description: "Services de gestion locative professionnelle",
        type: "inline",
        position: "properties",
        imageUrl: "/placeholder.svg?height=250&width=400&query=property+management+inline",
        targetUrl: "https://example-management.com",
        startDate: new Date("2024-03-01"),
        endDate: new Date("2024-12-31"),
        budget: 3500,
        costPerClick: 2.1,
        advertiser: {
          name: "GestionPro",
          email: "pub@gestionpro.fr",
          company: "Gestion Pro Services",
        },
        priority: 3,
        impressions: 5600,
        clicks: 124,
      },
    ]

    const advertisements = await Advertisement.insertMany(sampleAdvertisements)

    return NextResponse.json({
      success: true,
      message: `${advertisements.length} advertisements created successfully`,
      advertisements,
    })
  } catch (error) {
    console.error("Error seeding advertisements:", error)
    return NextResponse.json({ success: false, error: "Failed to seed advertisements" }, { status: 500 })
  }
}
