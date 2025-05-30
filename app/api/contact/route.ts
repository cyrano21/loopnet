import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Professional from '@/models/Professional'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  propertyType?: string
  budget?: string
  agentId: string
  agentName: string
}

// POST /api/contact - Envoyer un message de contact à un agent
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const body: ContactFormData = await request.json()
    
    // Validation des champs requis
    if (!body.name || !body.email || !body.subject || !body.message || !body.agentId) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être remplis' },
        { status: 400 }
      )
    }

    // Vérifier que l'agent existe
    const agent = await Professional.findById(body.agentId)
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent non trouvé' },
        { status: 404 }
      )
    }

    // Ici, vous pourriez:
    // 1. Envoyer un email à l'agent
    // 2. Sauvegarder le message dans une collection MongoDB
    // 3. Envoyer une notification
    
    // Pour cet exemple, nous simulons l'envoi d'un email
    console.log('Nouveau message de contact reçu:', {
      from: `${body.name} <${body.email}>`,
      to: `${agent.name} <${agent.contact.email}>`,
      subject: body.subject,
      message: body.message,
      phone: body.phone,
      propertyType: body.propertyType,
      budget: body.budget,
      timestamp: new Date().toISOString()
    })

    // Optionnel: Sauvegarder le message dans une collection
    // const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema)
    // await ContactMessage.create({
    //   ...body,
    //   timestamp: new Date(),
    //   status: 'sent'
    // })

    // Optionnel: Envoyer un email de confirmation au client
    console.log('Email de confirmation envoyé à:', body.email)

    return NextResponse.json({ 
      message: 'Message envoyé avec succès',
      success: true 
    })

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message de contact:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
