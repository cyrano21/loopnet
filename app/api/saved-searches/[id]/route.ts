import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

// Mock database pour les recherches sauvegardées
let savedSearches: any[] = []

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const search = savedSearches.find(s => s.id === id && s.userId === userId)
    
    if (!search) {
      return NextResponse.json({ error: 'Search not found' }, { status: 404 })
    }

    return NextResponse.json({ search })
  } catch (error) {
    console.error('Error fetching saved search:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id } = await params
    const searchIndex = savedSearches.findIndex(
      s => s.id === id && s.userId === userId
    )
    
    if (searchIndex === -1) {
      return NextResponse.json({ error: 'Search not found' }, { status: 404 })
    }

    // Mettre à jour la recherche sauvegardée
    savedSearches[searchIndex] = {
      ...savedSearches[searchIndex],
      ...body,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ 
      success: true, 
      search: savedSearches[searchIndex] 
    })
  } catch (error) {
    console.error('Error updating saved search:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const searchIndex = savedSearches.findIndex(
      s => s.id === id && s.userId === userId
    )
    
    if (searchIndex === -1) {
      return NextResponse.json({ error: 'Search not found' }, { status: 404 })
    }

    // Supprimer la recherche sauvegardée
    savedSearches.splice(searchIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting saved search:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
