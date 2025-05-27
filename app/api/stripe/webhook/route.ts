import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_12345"

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 })
    }

    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get("stripe-signature")

    let event

    try {
      event = stripe.webhooks.constructEvent(body, signature!, endpointSecret)
    } catch (err: any) {
      console.log(`⚠️ Webhook signature verification failed.`, err.message)
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
    }

    // Connecter à la base de données
    await connectToDatabase()

    let subscription
    let status

    // Gérer les événements comme dans votre code
    switch (event.type) {
      case "customer.subscription.created":
        subscription = event.data.object
        status = subscription.status
        console.log(`Subscription status is ${status}.`)

        // Mettre à jour l'utilisateur avec le nouveau plan
        if (subscription.metadata?.userId) {
          await User.findByIdAndUpdate(subscription.metadata.userId, {
            stripeCustomerId: subscription.customer,
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: status,
            plan: subscription.metadata.planId,
            subscriptionStartDate: new Date(subscription.current_period_start * 1000),
            subscriptionEndDate: new Date(subscription.current_period_end * 1000),
          })
        }
        break

      case "customer.subscription.updated":
        subscription = event.data.object
        status = subscription.status
        console.log(`Subscription status is ${status}.`)

        // Mettre à jour le statut de l'abonnement
        if (subscription.metadata?.userId) {
          await User.findByIdAndUpdate(subscription.metadata.userId, {
            subscriptionStatus: status,
            subscriptionEndDate: new Date(subscription.current_period_end * 1000),
          })
        }
        break

      case "customer.subscription.deleted":
        subscription = event.data.object
        status = subscription.status
        console.log(`Subscription status is ${status}.`)

        // Révoquer l'accès premium
        if (subscription.metadata?.userId) {
          await User.findByIdAndUpdate(subscription.metadata.userId, {
            subscriptionStatus: "canceled",
            plan: "free",
          })
        }
        break

      case "customer.subscription.trial_will_end":
        subscription = event.data.object
        status = subscription.status
        console.log(`Subscription trial will end: ${status}.`)

        // Envoyer une notification à l'utilisateur
        // TODO: Implémenter l'envoi d'email
        break

      case "entitlements.active_entitlement_summary.updated":
        subscription = event.data.object
        console.log(`Active entitlement summary updated for ${subscription}.`)
        break

      default:
        console.log(`Unhandled event type ${event.type}.`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Erreur webhook:", error)
    return NextResponse.json({ error: "Erreur traitement webhook" }, { status: 500 })
  }
}
