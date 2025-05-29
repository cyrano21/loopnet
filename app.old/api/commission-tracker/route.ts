import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Mock data - Dans une vraie application, récupérer depuis la base de données
    const mockCommissions = [
      {
        id: "comm-1",
        propertyId: "prop-1",
        propertyTitle: "Bureau Downtown - 1000 Rue Saint-Jean",
        clientName: "Entreprise ABC Inc.",
        dealType: "sale",
        salePrice: 2500000,
        commissionRate: 2.5,
        commissionAmount: 62500,
        status: "completed",
        closingDate: "2024-01-15T00:00:00Z",
        paidDate: "2024-01-20T00:00:00Z",
        agentSplit: 70,
        brokerageSplit: 30,
        agentAmount: 43750,
        brokerageAmount: 18750,
        notes: "Transaction rapide, client très satisfait"
      },
      {
        id: "comm-2",
        propertyId: "prop-2",
        propertyTitle: "Entrepôt Industriel - Zone Sud",
        clientName: "LogisCorp",
        dealType: "lease",
        leaseAmount: 15000,
        leaseTerm: 60, // mois
        commissionRate: 3.0,
        commissionAmount: 27000, // 15000 * 60 * 0.03
        status: "pending",
        closingDate: "2024-02-01T00:00:00Z",
        paidDate: null,
        agentSplit: 75,
        brokerageSplit: 25,
        agentAmount: 20250,
        brokerageAmount: 6750,
        notes: "En attente de signature finale"
      },
      {
        id: "comm-3",
        propertyId: "prop-3",
        propertyTitle: "Retail Space - Centre Commercial",
        clientName: "Fashion Plus Ltd",
        dealType: "sale",
        salePrice: 850000,
        commissionRate: 3.0,
        commissionAmount: 25500,
        status: "negotiating",
        closingDate: null,
        paidDate: null,
        agentSplit: 70,
        brokerageSplit: 30,
        agentAmount: 17850,
        brokerageAmount: 7650,
        notes: "Négociations en cours sur le prix final"
      }
    ]

    // Calculer les statistiques
    const totalCommissions = mockCommissions.reduce((sum, comm) => sum + comm.commissionAmount, 0)
    const completedCommissions = mockCommissions.filter(c => c.status === 'completed')
    const paidCommissions = completedCommissions.reduce((sum, comm) => sum + comm.commissionAmount, 0)
    const pendingCommissions = mockCommissions.filter(c => c.status === 'pending').reduce((sum, comm) => sum + comm.commissionAmount, 0)
    
    const stats = {
      totalCommissions,
      paidCommissions,
      pendingCommissions,
      averageCommission: mockCommissions.length > 0 ? totalCommissions / mockCommissions.length : 0,
      totalDeals: mockCommissions.length,
      completedDeals: completedCommissions.length,      thisMonthCommissions: completedCommissions
        .filter(c => c.closingDate && new Date(c.closingDate).getMonth() === new Date().getMonth())
        .reduce((sum, comm) => sum + comm.commissionAmount, 0)
    }

    return NextResponse.json({ 
      commissions: mockCommissions,
      stats 
    })
  } catch (error) {
    console.error('Erreur API commission tracker:', error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des commissions" },
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

    const body = await request.json()
    const { 
      propertyId, 
      propertyTitle, 
      clientName, 
      dealType, 
      salePrice, 
      leaseAmount, 
      leaseTerm,
      commissionRate, 
      agentSplit,
      notes 
    } = body

    // Validation basique
    if (!propertyTitle || !clientName || !dealType || !commissionRate) {
      return NextResponse.json(
        { error: "Données requises manquantes" },
        { status: 400 }
      )
    }

    // Calculer les montants
    let commissionAmount = 0
    if (dealType === 'sale') {
      commissionAmount = (salePrice || 0) * (commissionRate / 100)
    } else if (dealType === 'lease') {
      commissionAmount = (leaseAmount || 0) * (leaseTerm || 0) * (commissionRate / 100)
    }

    const agentAmount = commissionAmount * ((agentSplit || 70) / 100)
    const brokerageAmount = commissionAmount * ((100 - (agentSplit || 70)) / 100)

    // Mock creation - Dans une vraie application, sauvegarder en DB
    const newCommission = {
      id: `comm-${Date.now()}`,
      propertyId: propertyId || `prop-${Date.now()}`,
      propertyTitle,
      clientName,
      dealType,
      salePrice: dealType === 'sale' ? salePrice : undefined,
      leaseAmount: dealType === 'lease' ? leaseAmount : undefined,
      leaseTerm: dealType === 'lease' ? leaseTerm : undefined,
      commissionRate,
      commissionAmount,
      status: "negotiating",
      closingDate: null,
      paidDate: null,
      agentSplit: agentSplit || 70,
      brokerageSplit: 100 - (agentSplit || 70),
      agentAmount,
      brokerageAmount,
      notes: notes || "",
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({ commission: newCommission }, { status: 201 })
  } catch (error) {
    console.error('Erreur API création commission:', error)
    return NextResponse.json(
      { error: "Erreur lors de la création de la commission" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const { id, status, paidDate, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: "ID de commission requis" },
        { status: 400 }
      )
    }

    // Mock update - Dans une vraie application, mettre à jour en DB
    const updatedCommission = {
      ...updateData,
      id,
      status,
      paidDate: status === 'completed' && !paidDate ? new Date().toISOString() : paidDate,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ commission: updatedCommission })
  } catch (error) {
    console.error('Erreur API mise à jour commission:', error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la commission" },
      { status: 500 }
    )
  }
}
