import Stripe from "stripe"

// Utiliser votre vraie clé Stripe de test
const STRIPE_SECRET_KEY =
  process.env.STRIPE_SECRET_KEY ||
  "sk_test_51RSlf07SHG1gyxmmVEAOFFZwI9aPTNB6UGck0Cc6WfpQMjZcjXY8NKHj2IKRuN4mhBxX1GUGNYzSFbTMQA5urRyl00kQdm5Nqi"

let stripe: Stripe | null = null

if (STRIPE_SECRET_KEY) {
  stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
  })
}

export { stripe }

// Configuration des plans avec lookup_keys comme dans votre exemple
export const STRIPE_PLANS = {
  simple_premium: {
    lookup_key: "simple_premium_monthly",
    name: "Premium Simple",
    price: 19,
    description: "Accès aux fonctionnalités premium",
  },
  premium_investor: {
    lookup_key: "premium_investor_monthly",
    name: "Pro Investor",
    price: 49,
    description: "Outils d'investissement avancés",
  },
  agent_starter: {
    lookup_key: "agent_starter_monthly",
    name: "Agent Starter",
    price: 99,
    description: "Outils pour agents immobiliers",
  },
  agent_pro: {
    lookup_key: "agent_pro_monthly",
    name: "Agent Pro",
    price: 199,
    description: "Suite complète pour agents",
  },
}
