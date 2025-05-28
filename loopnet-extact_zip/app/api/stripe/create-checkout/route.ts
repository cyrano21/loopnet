import { NextResponse } from "next/server"
import { stripe, STRIPE_PLANS } from "@/lib/stripe"

export async function POST(request: Request) {
  try {
    // Vérifier que Stripe est configuré
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe n'est pas configuré. Veuillez contacter l'administrateur." },
        { status: 503 },
      )
    }

    const { planId, userId, userEmail } = await request.json()

    const plan = STRIPE_PLANS[planId as keyof typeof STRIPE_PLANS]
    if (!plan) {
      return NextResponse.json({ error: "Plan non trouvé" }, { status: 400 })
    }

    // Créer une session de checkout Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/pricing?canceled=true`,
      customer_email: userEmail,
      metadata: {
        userId,
        planId,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Erreur création checkout:", error)
    return NextResponse.json({ error: "Erreur création session de paiement" }, { status: 500 })
  }
}
