import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  const { plan, billingCycle, customerData } = body

  try {
    // Integration with Stripe (mock implementation)
    // In production, use actual Stripe API

    const planPrices = {
      basic: { monthly: 29, annual: 290 },
      professional: { monthly: 99, annual: 990 },
      enterprise: { monthly: 299, annual: 2990 },
    }

    const selectedPlan = planPrices[plan as keyof typeof planPrices]
    const amount = billingCycle === "annual" ? selectedPlan.annual : selectedPlan.monthly

    // Mock Stripe customer creation
    const customer = {
      id: `cus_${Date.now()}`,
      email: customerData.email,
      name: `${customerData.firstName} ${customerData.lastName}`,
      company: customerData.companyName,
    }

    // Mock subscription creation
    const subscription = {
      id: `sub_${Date.now()}`,
      customer: customer.id,
      plan: plan,
      billing_cycle: billingCycle,
      amount: amount,
      status: "active",
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + (billingCycle === "annual" ? 365 : 30) * 24 * 60 * 60 * 1000),
      trial_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14-day trial
    }

    // Create user account in database
    const user = {
      id: `user_${Date.now()}`,
      email: customerData.email,
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      company: customerData.companyName,
      plan: plan,
      subscription: subscription,
      features: getPlanFeatures(plan),
      createdAt: new Date(),
      trialEndsAt: subscription.trial_end,
    }

    // In production, save to database
    console.log("Created user:", user)
    console.log("Created subscription:", subscription)

    return NextResponse.json({
      success: true,
      customer: customer,
      subscription: subscription,
      user: user,
      message: "Subscription created successfully",
    })
  } catch (error) {
    console.error("Subscription creation error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create subscription",
      },
      { status: 500 },
    )
  }
}

function getPlanFeatures(plan: string) {
  const features = {
    basic: {
      maxListings: 5,
      analytics: "basic",
      support: "email",
      aiFeatures: false,
      customBranding: false,
      apiAccess: false,
    },
    professional: {
      maxListings: 25,
      analytics: "advanced",
      support: "priority",
      aiFeatures: true,
      customBranding: true,
      apiAccess: "standard",
    },
    enterprise: {
      maxListings: -1, // unlimited
      analytics: "premium",
      support: "dedicated",
      aiFeatures: true,
      customBranding: true,
      apiAccess: "full",
    },
  }

  return features[plan as keyof typeof features] || features.basic
}
