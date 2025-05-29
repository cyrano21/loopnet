import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { connectDB } from '@/lib/mongodb'
import SearchAlert from '@/models/SearchAlert'
import { authOptions } from '@/lib/auth-config'

// GET /api/search-alerts - Récupérer toutes les alertes de recherche de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const isActive = searchParams.get('isActive')
    const frequency = searchParams.get('frequency')
    const skip = (page - 1) * limit

    // Construire le filtre
    const filter: any = { user: session.user.id }
    if (isActive !== null) {
      filter.isActive = isActive === 'true'
    }
    if (frequency) {
      filter.frequency = frequency
    }

    // Récupérer les alertes avec pagination
    const [alerts, total] = await Promise.all([
      SearchAlert.find(filter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SearchAlert.countDocuments(filter)
    ])

    return NextResponse.json({
      alerts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des alertes:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}

// POST /api/search-alerts - Créer une nouvelle alerte de recherche
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    await connectDB()

    const body = await request.json()
    const {
      name,
      description,
      searchCriteria,
      frequency,
      isActive = true,
      tags
    } = body

    // Validation des champs requis
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Le nom de l\'alerte est requis' },
        { status: 400 }
      )
    }

    if (!searchCriteria || Object.keys(searchCriteria).length === 0) {
      return NextResponse.json(
        { error: 'Les critères de recherche sont requis' },
        { status: 400 }
      )
    }

    if (!frequency) {
      return NextResponse.json(
        { error: 'La fréquence est requise' },
        { status: 400 }
      )
    }

    // Vérifier que le nom n'existe pas déjà pour cet utilisateur
    const existingAlert = await SearchAlert.findOne({
      user: session.user.id,
      name: name.trim()
    })

    if (existingAlert) {
      return NextResponse.json(
        { error: 'Une alerte avec ce nom existe déjà' },
        { status: 409 }
      )
    }

    // Créer la nouvelle alerte
    const newAlert = new SearchAlert({
      user: session.user.id,
      name: name.trim(),
      description: description?.trim(),
      searchCriteria,
      frequency,
      isActive,
      tags: tags || [],
      lastTriggered: null,
      resultsCount: 0
    })

    const savedAlert = await newAlert.save()
    await savedAlert.populate('user', 'name email')

    return NextResponse.json({
      message: 'Alerte de recherche créée avec succès',
      alert: savedAlert
    }, { status: 201 })

  } catch (error) {
    console.error('Erreur lors de la création de l\'alerte:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
