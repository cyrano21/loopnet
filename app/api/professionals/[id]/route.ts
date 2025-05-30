import { NextRequest, NextResponse } from 'next/server'
import Professional from '@/models/Professional'
import { connectToDatabase } from '@/lib/mongodb'
import mongoose from 'mongoose'

// GET /api/professionals/[id] - Récupérer un professionnel par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {  try {
    await connectToDatabase()
    
    // Await the params Promise directly
    const { id } = await params
    
    // Vérifier si l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID de professionnel invalide' },
        { status: 400 }
      )
    }
    
    const professional = await Professional.findById(id)
    
    if (!professional) {
      return NextResponse.json(
        { error: 'Professionnel non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(professional)
  } catch (error) {
    console.error('Erreur lors de la récupération du professionnel:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// PUT /api/professionals/[id] - Mettre à jour un professionnel par ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {  try {
    await connectToDatabase()
    
    // Await the params Promise directly
    const { id } = await params
    
    // Vérifier si l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID de professionnel invalide' },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    
    const updatedProfessional = await Professional.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )
    
    if (!updatedProfessional) {
      return NextResponse.json(
        { error: 'Professionnel non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedProfessional)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du professionnel:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/professionals/[id] - Supprimer un professionnel par ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {  try {
    await connectToDatabase()
    
    // Await the params Promise directly
    const { id } = await params
    
    // Vérifier si l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID de professionnel invalide' },
        { status: 400 }
      )
    }
    
    const deletedProfessional = await Professional.findByIdAndDelete(id)
    
    if (!deletedProfessional) {
      return NextResponse.json(
        { error: 'Professionnel non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Professionnel supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du professionnel:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
