import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: propertyId } = await params
  
  // Simuler un délai de réseau
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Générer des données d'historique de prix fictives
  const currentDate = new Date()
  const history: any[] = []
  let currentPrice = Math.random() * 1000000 + 500000 // Prix entre 500k et 1.5M
  
  // Générer 24 entrées d'historique (2 ans d'historique mensuel)
  for (let i = 0; i < 24; i++) {
    // Calculer une date dans le passé
    const entryDate = new Date(currentDate)
    entryDate.setMonth(currentDate.getMonth() - (24 - i))
    
    // Fluctuation aléatoire du prix (-5% à +8%)
    const changePercent = (Math.random() * 13) - 5
    const previousPrice = currentPrice
    currentPrice = previousPrice * (1 + (changePercent / 100))
    
    // Créer l'entrée d'historique
    const entry = {
      date: entryDate.toISOString().split('T')[0],
      price: Math.round(previousPrice),
      change: Math.round(currentPrice - previousPrice),
      changePercentage: Number(changePercent.toFixed(2)),
      event: i % 6 === 0 ? "Évaluation" : undefined
    }
    
    history.push(entry)
  }
  
  // Ajouter le prix actuel
  history.push({
    date: currentDate.toISOString().split('T')[0],
    price: Math.round(currentPrice),
    change: 0,
    changePercentage: 0,
    event: "Prix actuel"
  })
  
  // Calculer les statistiques
  const totalChangePercentage = Number(((history[history.length - 1].price / history[0].price - 1) * 100).toFixed(2))
  const changes = history.slice(1).map((entry, idx) => entry.price - history[idx].price)
  const averagePriceChange = Math.round(changes.reduce((sum, val) => sum + val, 0) / changes.length)
  
  return NextResponse.json({
    propertyId,
    history,
    averagePriceChange,
    totalChangePercentage
  })
}
