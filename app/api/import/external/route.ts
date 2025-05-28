import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Property from "@/models/Property"
import { ExternalAPIService, convertExternalToInternal } from "@/lib/external-apis"

interface ExternalProperty {
  externalId: string
  title: string
  description: string
  price: number
  surface: number
  location: {
    address: string
    city: string
    postalCode: string
  }
  propertyType: string
  transactionType: string
  images?: string[]
  features?: Record<string, any>
}

interface ImportedProperty {
  id: string
  externalId: string
  title: string
  description: string
  price: number
  surface: number
  location: {
    address: string
    city: string
    postalCode: string
  }
  propertyType: string
  transactionType: string
  images: string[]
  features: Record<string, any>
  importedAt: Date
  save: () => Promise<void>
}

interface ImportResults {
  imported: number
  errors: number
  properties: ImportedProperty[]
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { sources, filters, autoPublish = false } = body

    const results: ImportResults = {
      imported: 0,
      errors: 0,
      properties: [],
    }

    // Import depuis les sources spécifiées
    const sourcesToImport = sources || ["leboncoin", "seloger", "pap", "bienici", "logic_immo"]

    for (const source of sourcesToImport) {
      try {
        console.log(`Import depuis ${source}...`)

        const externalProperties = await ExternalAPIService.importFromSource(source, filters)

        for (const externalProp of externalProperties) {
          try {
            // Vérifier si la propriété existe déjà
            const existing = await Property.findOne({
              $or: [{ externalId: externalProp.externalId }, { externalUrl: externalProp.url }],
            })

            if (existing) {
              results.errors++
              continue
            }

            // Convertir et sauvegarder
            const propertyData = convertExternalToInternal(externalProp)

            // Créer un utilisateur temporaire pour les imports externes
            const tempUserId = "507f1f77bcf86cd799439011" // TODO: Créer un système d'utilisateurs externes

            const newProperty: ImportedProperty = {
              id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              externalId: externalProp.externalId,
              title: externalProp.title,
              description: externalProp.description || "",
              price: externalProp.price,
              surface: externalProp.surface || 0,
              location: {
                address: externalProp.location?.address || "",
                city: externalProp.location?.city || "",
                postalCode: externalProp.location?.postalCode || "",
              },
              propertyType: externalProp.propertyType || "Autre",
              transactionType: externalProp.transactionType || "Vente",
              images: externalProp.images || [],
              features: externalProp.features || {},
              importedAt: new Date(),
              save: async function () {
                // Simulation de la sauvegarde
                console.log(`Sauvegarde de la propriété ${this.id}`)
              },
            }

            // Sauvegarde de la propriété
            await newProperty.save()
            results.imported++
            results.properties.push(newProperty)
          } catch (error) {
            console.error(`Erreur sauvegarde propriété ${externalProp.externalId}:`, error)
            results.errors++
          }
        }
      } catch (error) {
        console.error(`Erreur import ${source}:`, error)
        results.errors++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import terminé: ${results.imported} importées, ${results.errors} erreurs`,
      data: results,
    })
  } catch (error) {
    console.error("Erreur import externe:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de l'import externe" }, { status: 500 })
  }
}

// GET pour récupérer les sources disponibles
export async function GET() {
  const sources = [
    {
      id: "leboncoin",
      name: "LeBonCoin",
      description: "Annonces particuliers et professionnels",
      category: "généraliste",
      status: "active",
      lastImport: null,
      totalImported: 0,
    },
    {
      id: "seloger",
      name: "SeLoger",
      description: "Portail immobilier professionnel",
      category: "professionnel",
      status: "active",
      lastImport: null,
      totalImported: 0,
    },
    {
      id: "pap",
      name: "PAP",
      description: "Particulier à Particulier",
      category: "particulier",
      status: "active",
      lastImport: null,
      totalImported: 0,
    },
    {
      id: "bienici",
      name: "Bien'ici",
      description: "Réseau d'agences immobilières",
      category: "professionnel",
      status: "active",
      lastImport: null,
      totalImported: 0,
    },
    {
      id: "logic_immo",
      name: "Logic-Immo",
      description: "Immobilier d'entreprise",
      category: "commercial",
      status: "active",
      lastImport: null,
      totalImported: 0,
    },
  ]

  return NextResponse.json({
    success: true,
    data: sources,
  })
}
