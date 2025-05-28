import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  try {
    // Vérifier que Stripe est configuré
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe n'est pas configuré" },
        { status: 503 }
      )
    }

    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      )
    }

    // Traiter les événements Stripe
    switch (event.type) {
      case "customer.subscription.created":
        const subscriptionCreated = event.data.object as Stripe.Subscription
        console.log("Subscription created:", subscriptionCreated.id)
        // TODO: Mettre à jour le rôle de l'utilisateur dans la base de données
        break

      case "customer.subscription.updated":
        const subscriptionUpdated = event.data.object as Stripe.Subscription
        console.log("Subscription updated:", subscriptionUpdated.id)
        // TODO: Mettre à jour le statut de l'abonnement
        break

      case "customer.subscription.deleted":
        const subscriptionDeleted = event.data.object as Stripe.Subscription
        console.log("Subscription deleted:", subscriptionDeleted.id)
        // TODO: Révoquer l'accès premium
        break

      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice
        console.log("Payment succeeded for invoice:", invoice.id)
        // TODO: Confirmer le paiement et prolonger l'accès
        break

      case "invoice.payment_failed":
        const failedInvoice = event.data.object as Stripe.Invoice
        console.log("Payment failed for invoice:", failedInvoice.id)
        // TODO: Notifier l'utilisateur de l'échec du paiement
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}
