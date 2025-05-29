import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import SavedSearch from '@/models/SavedSearch'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-config'

// GET /api/saved-searches/[id] - Récupérer une recherche sauvegardée spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    await connectDB()

    const { id } = await params

    // Récupérer la recherche sauvegardée
    const savedSearch = await SavedSearch.findOne({
      _id: id,
      user: session.user.id
    })
      .populate('user', 'name email')
      .lean()

    if (!savedSearch) {
      return NextResponse.json(
        { error: 'Recherche sauvegardée non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({ savedSearch })

  } catch (error) {
    console.error('Erreur lors de la récupération de la recherche sauvegardée:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}

// PUT /api/saved-searches/[id] - Mettre à jour une recherche sauvegardée
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    await connectDB()

    const { id } = await params
    const body = await request.json()
    const {
      name,
      description,
      searchCriteria,
      alertFrequency,
      isActive,
      tags
    } = body

    // Vérifier que la recherche existe et appartient à l'utilisateur
    const existingSearch = await SavedSearch.findOne({
      _id: id,
      user: session.user.id
    })

    if (!existingSearch) {
      return NextResponse.json(
        { error: 'Recherche sauvegardée non trouvée' },
        { status: 404 }
      )
    }

    // Si le nom change, vérifier qu'il n'existe pas déjà
    if (name && name.trim() !== existingSearch.name) {
      const duplicateSearch = await SavedSearch.findOne({
        user: session.user.id,
        name: name.trim(),
        _id: { $ne: id }
      })

      if (duplicateSearch) {
        return NextResponse.json(
          { error: 'Une recherche avec ce nom existe déjà' },
          { status: 409 }
        )
      }
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      updatedAt: new Date()
    }

    if (name !== undefined) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description?.trim()
    if (searchCriteria !== undefined) updateData.searchCriteria = searchCriteria
    if (alertFrequency !== undefined) updateData.alertFrequency = alertFrequency
    if (isActive !== undefined) updateData.isActive = isActive
    if (tags !== undefined) updateData.tags = tags

    // Mettre à jour la recherche sauvegardée
    const updatedSearch = await SavedSearch.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .lean()

    return NextResponse.json({
      message: 'Recherche sauvegardée mise à jour avec succès',
      savedSearch: updatedSearch
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la recherche sauvegardée:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}

// DELETE /api/saved-searches/[id] - Supprimer une recherche sauvegardée
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    await connectDB()

    const { id } = await params

    // Supprimer la recherche sauvegardée
    const deletedSearch = await SavedSearch.findOneAndDelete({
      _id: id,
      user: session.user.id
    })

    if (!deletedSearch) {
      return NextResponse.json(
        { error: 'Recherche sauvegardée non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Recherche sauvegardée supprimée avec succès',
      deletedSearch: {
        id: deletedSearch._id,
        name: deletedSearch.name
      }
    })

  } catch (error) {
    console.error('Erreur lors de la suppression de la recherche sauvegardée:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
