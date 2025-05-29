import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import SavedSearch from '@/models/SavedSearch'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-config'

// GET /api/saved-searches - Récupérer les recherches sauvegardées
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
    const isActive = searchParams.get('active')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Construire le filtre
    const filter: any = { user: session.user.id }
    
    if (isActive !== null) {
      filter.isActive = isActive === 'true'
    }

    // Options de tri
    const sortOptions: any = {}
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1

    // Pagination
    const skip = (page - 1) * limit

    // Récupérer les recherches sauvegardées
    const savedSearches = await SavedSearch.find(filter)
      .populate('user', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean()

    // Compter le total
    const total = await SavedSearch.countDocuments(filter)

    // Calculer les métadonnées de pagination
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      savedSearches,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des recherches sauvegardées:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}

// POST /api/saved-searches - Créer une nouvelle recherche sauvegardée
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
      searchCriteria,
      alertFrequency,
      isActive = true,
      description,
      tags
    } = body

    // Validation des champs requis
    if (!name || !searchCriteria) {
      return NextResponse.json(
        { error: 'Le nom et les critères de recherche sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si une recherche avec le même nom existe déjà pour cet utilisateur
    const existingSearch = await SavedSearch.findOne({
      user: session.user.id,
      name: name.trim()
    })

    if (existingSearch) {
      return NextResponse.json(
        { error: 'Une recherche avec ce nom existe déjà' },
        { status: 409 }
      )
    }

    // Créer la nouvelle recherche sauvegardée
    const savedSearch = new SavedSearch({
      user: session.user.id,
      name: name.trim(),
      description: description?.trim(),
      searchCriteria,
      alertFrequency: alertFrequency || 'weekly',
      isActive,
      tags: tags || [],
      lastExecuted: null,
      resultCount: 0,
      statistics: {
        totalExecutions: 0,
        avgResultCount: 0,
        lastResultCount: 0,
        bestResultCount: 0,
        executionHistory: []
      }
    })

    await savedSearch.save()

    // Populer les données utilisateur pour la réponse
    await savedSearch.populate('user', 'name email')

    return NextResponse.json(
      {
        message: 'Recherche sauvegardée créée avec succès',
        savedSearch
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erreur lors de la création de la recherche sauvegardée:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}

// DELETE /api/saved-searches - Supprimer plusieurs recherches sauvegardées
export async function DELETE(request: NextRequest) {
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
    const ids = searchParams.get('ids')?.split(',')

    if (!ids || ids.length === 0) {
      return NextResponse.json(
        { error: 'IDs des recherches requis' },
        { status: 400 }
      )
    }

    // Supprimer les recherches sauvegardées
    const result = await SavedSearch.deleteMany({
      _id: { $in: ids },
      user: session.user.id
    })

    return NextResponse.json({
      message: `${result.deletedCount} recherche(s) supprimée(s)`,
      deletedCount: result.deletedCount
    })

  } catch (error) {
    console.error('Erreur lors de la suppression des recherches sauvegardées:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
