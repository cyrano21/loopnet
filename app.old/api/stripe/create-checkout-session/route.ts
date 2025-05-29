import { NextResponse } from "next/server"
import { stripe, STRIPE_PLANS } from "@/lib/stripe"

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe n'est pas configuré" }, { status: 503 })
    }

    const { planId, userId, userEmail } = await request.json()

    const plan = STRIPE_PLANS[planId as keyof typeof STRIPE_PLANS]
    if (!plan) {
      return NextResponse.json({ error: "Plan non trouvé" }, { status: 400 })
    }

    // Récupérer le prix via lookup_key comme dans votre exemple
    const prices = await stripe.prices.list({
      lookup_keys: [plan.lookup_key],
      expand: ["data.product"],
    })

    if (prices.data.length === 0) {
      return NextResponse.json({ error: "Prix non trouvé pour ce plan" }, { status: 400 })
    }

    // Créer la session de checkout comme dans votre code
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/pricing?canceled=true`,
      customer_email: userEmail,
      subscription_data: {
        trial_period_days: 7, // 7 jours d'essai gratuit
      },
      automatic_tax: { enabled: true },
      metadata: {
        userId,
        planId,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Erreur création checkout:", error)
    return NextResponse.json({ error: "Erreur création session de paiement" }, { status: 500 })
  }
}
