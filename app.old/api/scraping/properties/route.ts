import { NextResponse } from "next/server"
import { PropertyScrapingService } from "@/lib/scraping-service"
import connectDB from "@/lib/mongodb"
import Property from "@/models/Property"

export async function POST(request: Request) {
  try {
    const { sources, filters } = await request.json()

    // Vérifier les permissions (seuls les admins peuvent lancer le scraping)
    // TODO: Ajouter vérification auth admin

    await connectDB()

    console.log("🕷️ Début du scraping des propriétés...")

    // Scraper depuis les sources autorisées
    const scrapedProperties = await PropertyScrapingService.scrapeFromPublicAPIs()

    console.log(`📊 ${scrapedProperties.length} propriétés scrapées`)

    // Convertir et sauvegarder en base
    const savedProperties = []
    for (const scrapedProp of scrapedProperties) {
      try {
        // Vérifier si la propriété existe déjà
        const existing = await Property.findOne({
          title: scrapedProp.title,
          "contactInfo.email": "scraped@system.com",
        })

        if (!existing) {
          const property = new Property({
            title: scrapedProp.title,
            description: scrapedProp.description,
            propertyType: "apartment", // Par défaut
            transactionType: "sale",
            address: scrapedProp.location,
            city: scrapedProp.location.split(",")[1]?.trim() || "Unknown",
            postalCode: "00000",
            country: "France",
            price: scrapedProp.price,
            surface: scrapedProp.surface || 50,
            rooms: scrapedProp.rooms || 2,
            bedrooms: Math.max(1, (scrapedProp.rooms || 2) - 1),
            bathrooms: Math.ceil((scrapedProp.rooms || 2) / 3),
            features: [
              "Données scrapées",
              scrapedProp.surface ? `Surface: ${scrapedProp.surface}m²` : "Surface à confirmer",
              scrapedProp.rooms ? `${scrapedProp.rooms} pièces` : "Nombre de pièces à confirmer",
              "Informations à vérifier auprès du propriétaire"
            ],
            images: scrapedProp.images.map((url, index) => ({
              url,
              publicId: `scraped_${scrapedProp.source}_${Date.now()}_${index}`,
              alt: `${scrapedProp.title} - Photo ${index + 1}`,
              isPrimary: index === 0,
            })),
            owner: "507f1f77bcf86cd799439011", // ID système pour propriétés scrapées
            ownerType: "agency",
            contactInfo: {
              name: `Source: ${scrapedProp.source} - ${new Date().toLocaleDateString('fr-FR')}`,
              email: "scraped@system.com",
              phone: "0000000000",
              website: scrapedProp.url,
            },
            status: "active", // Actif mais marqué comme scrapé
            tags: ["scrapé", scrapedProp.source, "données-externes"],
            views: 0,
            favorites: 0,
            inquiries: 0,
            slug: `${scrapedProp.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
            isPremium: false,
            isFeatured: false,
          })

          await property.save()
          savedProperties.push(property)
        }
      } catch (error) {
        console.error("Erreur sauvegarde propriété:", error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `${savedProperties.length} nouvelles propriétés ajoutées`,
      scraped: scrapedProperties.length,
      saved: savedProperties.length,
      properties: savedProperties.slice(0, 5), // Retourner les 5 premières
    })
  } catch (error) {
    console.error("Erreur scraping:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors du scraping",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    await connectDB()

    // Retourner les statistiques de scraping
    const scrapedCount = await Property.countDocuments({
      "contactInfo.email": "scraped@system.com",
    })

    const lastScraped = await Property.findOne({
      "contactInfo.email": "scraped@system.com",
    }).sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      stats: {
        totalScraped: scrapedCount,
        lastScrapedAt: lastScraped?.createdAt,
        sources: ["DVF-Etalab", "PublicAPI", "RSS-Feed"],
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erreur récupération stats" }, { status: 500 })
  }
}
