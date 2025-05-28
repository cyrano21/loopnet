import { NextResponse } from "next/server"
import { PropertyScrapingService } from "@/lib/scraping-service"
import connectDB from "@/lib/mongodb"
import Property from "@/models/Property"

export async function POST(request: Request) {
  try {
    console.log("🚀 Démarrage du scraping via API...")
    await connectDB()

    // 1. Scraping depuis des APIs publiques et sources autorisées
    console.log("🌐 Scraping depuis les APIs publiques...")
    const scrapedProperties = await PropertyScrapingService.scrapeFromPublicAPIs()

    console.log(`✅ ${scrapedProperties.length} propriétés récupérées depuis les APIs`)

    // 2. Enregistrer les propriétés dans la base de données
    let createdCount = 0
    let skippedCount = 0

    for (const scrapedProperty of scrapedProperties) {
      try {
        // Vérifier si la propriété existe déjà (par titre et localisation)
        const existingProperty = await Property.findOne({
          title: scrapedProperty.title,
          location: scrapedProperty.location,
        })

        if (existingProperty) {
          console.log(`⚠️ Propriété déjà existante: ${scrapedProperty.title} - ${scrapedProperty.location}`)
          skippedCount++
          continue
        }

        // Créer la nouvelle propriété
        const newProperty = new Property(scrapedProperty)
        await newProperty.save()
        console.log(`✅ Propriété créée: ${scrapedProperty.title} - ${scrapedProperty.location}`)
        createdCount++
      } catch (error) {
        console.error(`❌ Erreur lors de la création de ${scrapedProperty.title}:`, error)
      }
    }

    console.log(`✅ ${createdCount} propriétés créées, ${skippedCount} ignorées`)

    return NextResponse.json({
      message: "Scraping terminé avec succès",
      created: createdCount,
      skipped: skippedCount,
    })
  } catch (error) {
    console.error("❌ Erreur lors du scraping via API:", error)
    return NextResponse.json({ error: "Failed to scrape properties" }, { status: 500 })
  }
}
