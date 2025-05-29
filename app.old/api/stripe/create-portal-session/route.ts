import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe n'est pas configuré" }, { status: 503 })
    }

    const { session_id } = await request.json()

    // Récupérer la session de checkout pour obtenir le customer ID
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id)

    if (!checkoutSession.customer) {
      return NextResponse.json({ error: "Customer non trouvé" }, { status: 400 })
    }

    // Créer la session du portail de facturation
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer as string,
      return_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error("Erreur création portal:", error)
    return NextResponse.json({ error: "Erreur création session portal" }, { status: 500 })
  }
}
