import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    console.log('Testing database connection...')
    
    const { db } = await connectToDatabase()
    const collections = await db.listCollections().toArray()
    const propertiesCount = await db.collection('properties').countDocuments()
    const usersCount = await db.collection('users').countDocuments()
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        collections: collections.map(col => col.name),
        counts: {
          properties: propertiesCount,
          users: usersCount
        },
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Database connection error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}