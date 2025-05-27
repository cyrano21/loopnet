import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Mock data - Dans une vraie application, ceci viendrait de votre base de données
    const mockAlerts = [
      {
        id: "alert-1",
        name: "Nouveaux bureaux SF > 2M$",
        filters: {
          propertyType: "office",
          city: "San Francisco",
          minPrice: "2000000",
          transactionType: "sale"
        },
        frequency: "immediate",
        enabled: true,
        createdAt: "2024-01-15T10:00:00Z",
        lastTriggered: "2024-01-20T08:30:00Z",
        newResultsCount: 3
      },
      {
        id: "alert-2",
        name: "Retail LA Location",
        filters: {
          propertyType: "retail",
          city: "Los Angeles",
          transactionType: "lease",
          maxPrice: "50"
        },
        frequency: "daily",
        enabled: true,
        createdAt: "2024-01-18T14:20:00Z",
        lastTriggered: "2024-01-19T09:15:00Z",
        newResultsCount: 1
      },
      {
        id: "alert-3",
        name: "Entrepôts 10k+ sqft",
        filters: {
          propertyType: "industrial",
          minSurface: "10000",
          transactionType: "sale"
        },
        frequency: "weekly",
        enabled: false,
        createdAt: "2024-01-10T16:45:00Z",
        newResultsCount: 0
      }
    ]

    return NextResponse.json({
      success: true,
      alerts: mockAlerts
    })

  } catch (error) {
    console.error("Erreur lors de la récupération des alertes:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des alertes" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const alertData = await request.json()
    
    // Dans une vraie application, vous sauvegarderiez dans votre base de données
    const newAlert = {
      id: `alert-${Date.now()}`,
      ...alertData,
      createdAt: new Date().toISOString(),
      newResultsCount: 0
    }

    console.log("Nouvelle alerte créée:", newAlert)

    return NextResponse.json({
      success: true,
      alert: newAlert,
      message: "Alerte créée avec succès"
    })

  } catch (error) {
    console.error("Erreur lors de la création de l'alerte:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de l'alerte" },
      { status: 500 }
    )
  }
}
