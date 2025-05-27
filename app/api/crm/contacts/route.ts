import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Mock data - Dans une vraie application, ceci viendrait de votre base de données
    const mockContacts = [
      {
        id: "contact-1",
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+1-555-0123",
        company: "ABC Investments",
        type: "buyer",
        status: "hot",
        source: "website",
        interestedProperties: ["prop-1", "prop-2"],
        notes: "Recherche bureaux downtown, budget 2-5M$",
        createdAt: "2024-01-15T10:00:00Z",
        lastContact: "2024-01-20T08:30:00Z",
        nextFollowUp: "2024-01-25T10:00:00Z"
      },
      {
        id: "contact-2",
        name: "Sarah Johnson",
        email: "sarah.j@realestate.com",
        phone: "+1-555-0456",
        company: "Johnson Properties",
        type: "seller",
        status: "warm",
        source: "referral",
        interestedProperties: ["prop-3"],
        notes: "Veut vendre son portefeuille retail",
        createdAt: "2024-01-18T14:20:00Z",
        lastContact: "2024-01-19T09:15:00Z",
        nextFollowUp: "2024-01-22T14:00:00Z"
      },
      {
        id: "contact-3",
        name: "Mike Chen",
        email: "m.chen@techcorp.com",
        phone: "+1-555-0789",
        company: "TechCorp",
        type: "tenant",
        status: "cold",
        source: "cold_call",
        interestedProperties: [],
        notes: "Expansion prévue Q3, besoin de bureaux tech",
        createdAt: "2024-01-10T16:45:00Z",
        lastContact: "2024-01-10T16:45:00Z",
        nextFollowUp: "2024-01-30T10:00:00Z"
      }
    ]

    return NextResponse.json({ contacts: mockContacts })
  } catch (error) {
    console.error('Erreur API CRM contacts:', error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des contacts" },
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
    const { name, email, phone, company, type, notes } = body

    // Validation basique
    if (!name || !email) {
      return NextResponse.json(
        { error: "Nom et email sont requis" },
        { status: 400 }
      )
    }

    // Mock creation - Dans une vraie application, sauvegarder en DB
    const newContact = {
      id: `contact-${Date.now()}`,
      name,
      email,
      phone: phone || "",
      company: company || "",
      type: type || "prospect",
      status: "new",
      source: "manual",
      interestedProperties: [],
      notes: notes || "",
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString(),
      nextFollowUp: null
    }

    return NextResponse.json({ contact: newContact }, { status: 201 })
  } catch (error) {
    console.error('Erreur API CRM création contact:', error)
    return NextResponse.json(
      { error: "Erreur lors de la création du contact" },
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
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: "ID du contact requis" },
        { status: 400 }
      )
    }

    // Mock update - Dans une vraie application, mettre à jour en DB
    const updatedContact = {
      ...updateData,
      id,
      lastContact: new Date().toISOString()
    }

    return NextResponse.json({ contact: updatedContact })
  } catch (error) {
    console.error('Erreur API CRM mise à jour contact:', error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du contact" },
      { status: 500 }
    )
  }
}
