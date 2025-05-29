import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const onboardingData = await request.json()

  try {
    // Ici vous sauvegarderiez les données dans votre base de données
    // et configureriez le compte de l'agent

    console.log("Données d'onboarding reçues:", onboardingData)

    // Simulation de la sauvegarde
    const agentProfile = {
      id: Date.now(),
      ...onboardingData,
      status: "active",
      createdAt: new Date().toISOString(),
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 jours
    }

    // Créer les paramètres par défaut selon le type d'agent
    const defaultSettings = {
      notifications: onboardingData.notifications,
      autoResponder: onboardingData.autoResponder,
      leadScoring: onboardingData.leadScoring,
      dashboard: {
        widgets: getDefaultWidgets(onboardingData.agentType),
        layout: "default",
      },
    }

    return NextResponse.json({
      success: true,
      message: "Onboarding terminé avec succès",
      agent: agentProfile,
      settings: defaultSettings,
      nextSteps: [
        "Ajouter vos premières propriétés",
        "Configurer votre profil public",
        "Importer vos contacts existants",
        "Personnaliser votre dashboard",
      ],
    })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la finalisation de l'onboarding" }, { status: 500 })
  }
}

function getDefaultWidgets(agentType: string) {
  const baseWidgets = ["performance-metrics", "recent-activities", "lead-pipeline", "upcoming-tasks"]

  switch (agentType) {
    case "residential":
      return [...baseWidgets, "market-trends", "client-satisfaction"]
    case "commercial":
      return [...baseWidgets, "deal-tracker", "roi-calculator"]
    case "vacation":
      return [...baseWidgets, "booking-calendar", "seasonal-trends"]
    default:
      return baseWidgets
  }
}
