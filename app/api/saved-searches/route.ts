import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Mock data - Dans une vraie application, ceci viendrait de votre base de données
    const mockSearches = [
      {
        id: "search-1",
        name: "Bureaux Downtown SF",
        filters: {
          propertyType: "office",
          city: "San Francisco",
          minPrice: "1000000",
          maxPrice: "5000000",
          minSurface: "5000"
        },
        alertEnabled: true,
        createdAt: "2024-01-15T10:00:00Z",
        lastRun: "2024-01-20T08:30:00Z",
        resultsCount: 23
      },
      {
        id: "search-2", 
        name: "Retail Los Angeles",
        filters: {
          propertyType: "retail",
          city: "Los Angeles",
          transactionType: "lease",
          maxPrice: "50"
        },
        alertEnabled: false,
        createdAt: "2024-01-18T14:20:00Z",
        lastRun: "2024-01-19T09:15:00Z",
        resultsCount: 15
      },
      {
        id: "search-3",
        name: "Entrepôts Zone Industrielle",
        filters: {
          propertyType: "industrial",
          minSurface: "10000",
          transactionType: "sale"
        },
        alertEnabled: true,
        createdAt: "2024-01-10T16:45:00Z",
        resultsCount: 8
      }
    ]

    return NextResponse.json({ searches: mockSearches })
  } catch (error) {
    console.error("Erreur lors de la récupération des recherches sauvegardées:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name, filters, alertEnabled } = await request.json()

    if (!name || !filters) {
      return NextResponse.json(
        { error: "Le nom et les filtres sont requis" },
        { status: 400 }
      )
    }

    // Mock création - Dans une vraie application, sauvegarder en base de données
    const newSearch = {
      id: `search-${Date.now()}`,
      name,
      filters,
      alertEnabled: alertEnabled || false,
      createdAt: new Date().toISOString(),
      resultsCount: 0
    }

    console.log("Nouvelle recherche sauvegardée:", newSearch)

    return NextResponse.json({ 
      success: true, 
      search: newSearch,
      message: "Recherche sauvegardée avec succès"
    })
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la recherche:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
