import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const propertyId = searchParams.get("propertyId")
  const propertyType = searchParams.get("propertyType")
  const city = searchParams.get("city")
  const state = searchParams.get("state")
  const zip = searchParams.get("zip")

  if (!propertyId || !propertyType || !city) {
    return NextResponse.json(
      { error: "propertyId, propertyType et city sont requis" },
      { status: 400 }
    )
  }

  try {
    // Mock data - Dans une vraie application, ceci viendrait de sources de données immobilières
    const marketAnalysis = {
      trends: {
        currentPricePerSqFt: Math.floor(Math.random() * 100) + 200,
        marketAvgPricePerSqFt: Math.floor(Math.random() * 100) + 180,
        pricePerSqFtTrend: (Math.random() - 0.5) * 20, // -10% à +10%
        vacancyRate: Math.random() * 15 + 2, // 2-17%
        vacancyTrend: (Math.random() - 0.5) * 6, // -3% à +3%
        avgDaysOnMarket: Math.floor(Math.random() * 150) + 30,
        daysOnMarketTrend: (Math.random() - 0.5) * 40, // -20 à +20 jours
      },
      comparable: [
        {
          id: "comp-1",
          address: `${Math.floor(Math.random() * 999) + 100} Main St, ${city}`,
          price: Math.floor(Math.random() * 2000000) + 500000,
          size: Math.floor(Math.random() * 10000) + 5000,
          daysOnMarket: Math.floor(Math.random() * 120) + 15,
          propertyType,
          yearBuilt: Math.floor(Math.random() * 30) + 1990,
        },
        {
          id: "comp-2",
          address: `${Math.floor(Math.random() * 999) + 100} Business Ave, ${city}`,
          price: Math.floor(Math.random() * 2000000) + 500000,
          size: Math.floor(Math.random() * 10000) + 5000,
          daysOnMarket: Math.floor(Math.random() * 120) + 15,
          propertyType,
          yearBuilt: Math.floor(Math.random() * 30) + 1990,
        },
        {
          id: "comp-3",
          address: `${Math.floor(Math.random() * 999) + 100} Commerce St, ${city}`,
          price: Math.floor(Math.random() * 2000000) + 500000,
          size: Math.floor(Math.random() * 10000) + 5000,
          daysOnMarket: Math.floor(Math.random() * 120) + 15,
          propertyType,
          yearBuilt: Math.floor(Math.random() * 30) + 1990,
        },
      ],
      forecast: {
        oneYear: (Math.random() - 0.5) * 15, // -7.5% à +7.5%
        threeYears: (Math.random() - 0.3) * 25, // -10% à +15%
        fiveYears: (Math.random() - 0.2) * 35, // -12% à +23%
        factors: [
          "Développement urbain planifié",
          "Nouvelles infrastructures de transport",
          "Croissance économique régionale",
          "Politiques de zonage favorables",
          "Demande accrue du secteur technologique",
        ],
      },
    }

    return NextResponse.json(marketAnalysis)
  } catch (error) {
    console.error("Erreur lors de la récupération de l'analyse de marché:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
