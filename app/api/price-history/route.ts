import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const propertyId = searchParams.get("propertyId")
  const period = searchParams.get("period") || "12months"

  if (!propertyId) {
    return NextResponse.json(
      { error: "propertyId est requis" },
      { status: 400 }
    )
  }

  try {
    // Mock data - Dans une vraie application, ceci viendrait de votre base de données
    const generatePriceHistory = (months: number) => {
      const history = []
      const basePrice = 2500000 + Math.random() * 1000000
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
