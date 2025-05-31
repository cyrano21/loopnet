import { NextResponse } from "next/server"

// Helper function to generate price history
const generatePriceHistory = (months: number, basePriceParam?: number) => {
  const history = []
  const basePrice = basePriceParam || (2500000 + Math.random() * 1000000)
  let currentPrice = basePrice

  for (let i = months; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    
    // Simuler des variations de prix réalistes
    const variation = (Math.random() - 0.5) * 0.1 // ±5% de variation
    currentPrice *= (1 + variation)
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(currentPrice),
      event: i === 0 ? "Prix actuel" : 
             Math.random() > 0.8 ? "Réduction de prix" :
             Math.random() > 0.9 ? "Augmentation" : null
    })
  }
  
  return history
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const propertyId = searchParams.get("propertyId")
  const address = searchParams.get("address")
  const propertyType = searchParams.get("propertyType") || "all"
  const minPriceParam = searchParams.get("minPrice")
  const maxPriceParam = searchParams.get("maxPrice")
  const period = searchParams.get("period") || "12months"

  try {
    // Support pour recherche par adresse (nouvelles fonctionnalités)
    if (address && !propertyId) {
      // Recherche de propriétés par adresse
      const mockProperties = [
        {
          id: "prop-1",
          address: address,
          currentPrice: 2500000,
          priceHistory: generatePriceHistory(12, 2500000),
          propertyType: "office",
          size: 850,
          yearBuilt: 2015
        },
        {
          id: "prop-2", 
          address: address.replace(/\d+/, (n) => String(parseInt(n) + 2)),
          currentPrice: 2750000,
          priceHistory: generatePriceHistory(12, 2750000),
          propertyType: "retail",
          size: 920,
          yearBuilt: 2018
        }
      ].filter(prop => {
        if (propertyType !== "all" && prop.propertyType !== propertyType) return false;
        if (minPriceParam && prop.currentPrice < parseInt(minPriceParam)) return false;
        if (maxPriceParam && prop.currentPrice > parseInt(maxPriceParam)) return false;
        return true;
      });

      return NextResponse.json({
        success: true,
        properties: mockProperties,
        searchCriteria: { address, propertyType, minPrice: minPriceParam, maxPrice: maxPriceParam, period },
        marketComparison: {
          globalAverage: 4250,
          regionAverage: 5200,
          typeAverage: 6800,
          trend: 8.5
        }
      });
    }

    // Analyse pour propriété spécifique (code existant amélioré)
    if (!propertyId) {
      return NextResponse.json(
        { error: "propertyId ou address est requis" },
        { status: 400 }
      )
    }

    const monthsMap = {
      "6months": 6,
      "12months": 12,
      "24months": 24,
      "60months": 60
    }

    const months = monthsMap[period as keyof typeof monthsMap] || 12
    const priceHistory = generatePriceHistory(months)
    
    // Calculer les statistiques
    const prices = priceHistory.map(p => p.price)
    const currentPrice = prices[prices.length - 1]
    const previousPrice = prices[prices.length - 2] || currentPrice
    const maxPrice = Math.max(...prices)
    const minPrice = Math.min(...prices)
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    
    const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100
    const priceChangeTotal = ((currentPrice - prices[0]) / prices[0]) * 100

    return NextResponse.json({
      propertyId,
      period,
      history: priceHistory,
      statistics: {
        currentPrice,
        maxPrice,
        minPrice,
        avgPrice,
        priceChange: Math.round(priceChange * 100) / 100,
        priceChangeTotal: Math.round(priceChangeTotal * 100) / 100,
        volatility: Math.round((maxPrice - minPrice) / avgPrice * 100 * 100) / 100
      }
    })
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique des prix:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
