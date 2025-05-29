import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { connectDB } from '@/lib/mongodb'
import SearchAlert from '@/models/SearchAlert'
import { authOptions } from '@/lib/auth-config'

// GET /api/search-alerts/[id] - Récupérer une alerte de recherche spécifique
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

    // Récupérer l'alerte de recherche
    const searchAlert = await SearchAlert.findOne({
      _id: id,
      user: session.user.id
    })
      .populate('user', 'name email')
      .lean()

    if (!searchAlert) {
      return NextResponse.json(
        { error: 'Alerte de recherche non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({ searchAlert })

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'alerte:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}

// PUT /api/search-alerts/[id] - Mettre à jour une alerte de recherche
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
      frequency,
      isActive,
      tags
    } = body

    // Vérifier que l'alerte existe et appartient à l'utilisateur
    const existingAlert = await SearchAlert.findOne({
      _id: id,
      user: session.user.id
    })

    if (!existingAlert) {
      return NextResponse.json(
        { error: 'Alerte de recherche non trouvée' },
        { status: 404 }
      )
    }

    // Si le nom change, vérifier qu'il n'existe pas déjà
    if (name && name.trim() !== existingAlert.name) {
      const duplicateAlert = await SearchAlert.findOne({
        user: session.user.id,
        name: name.trim(),
        _id: { $ne: id }
      })

      if (duplicateAlert) {
        return NextResponse.json(
          { error: 'Une alerte avec ce nom existe déjà' },
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
    if (frequency !== undefined) updateData.frequency = frequency
    if (isActive !== undefined) updateData.isActive = isActive
    if (tags !== undefined) updateData.tags = tags

    // Mettre à jour l'alerte de recherche
    const updatedAlert = await SearchAlert.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .lean()

    return NextResponse.json({
      message: 'Alerte de recherche mise à jour avec succès',
      searchAlert: updatedAlert
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'alerte:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}

// PATCH /api/search-alerts/[id] - Activer/désactiver une alerte
export async function PATCH(
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
    const { action } = body

    if (!['activate', 'deactivate', 'trigger'].includes(action)) {
      return NextResponse.json(
        { error: 'Action non valide' },
        { status: 400 }
      )
    }

    // Vérifier que l'alerte existe et appartient à l'utilisateur
    const existingAlert = await SearchAlert.findOne({
      _id: id,
      user: session.user.id
    })

    if (!existingAlert) {
      return NextResponse.json(
        { error: 'Alerte de recherche non trouvée' },
        { status: 404 }
      )
    }

    let updateData: any = { updatedAt: new Date() }

    switch (action) {
      case 'activate':
        updateData.isActive = true
        break
      case 'deactivate':
        updateData.isActive = false
        break
      case 'trigger':
        updateData.lastTriggered = new Date()
        updateData.resultsCount = body.resultsCount || 0
        break
    }

    const updatedAlert = await SearchAlert.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .lean()

    return NextResponse.json({
      message: `Alerte ${action === 'activate' ? 'activée' : action === 'deactivate' ? 'désactivée' : 'déclenchée'} avec succès`,
      searchAlert: updatedAlert
    })

  } catch (error) {
    console.error('Erreur lors de la modification de l\'alerte:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}

// DELETE /api/search-alerts/[id] - Supprimer une alerte de recherche
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

    // Supprimer l'alerte de recherche
    const deletedAlert = await SearchAlert.findOneAndDelete({
      _id: id,
      user: session.user.id
    })

    if (!deletedAlert) {
      return NextResponse.json(
        { error: 'Alerte de recherche non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Alerte de recherche supprimée avec succès',
      deletedAlert: {
        id: deletedAlert._id,
        name: deletedAlert.name
      }
    })

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'alerte:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
