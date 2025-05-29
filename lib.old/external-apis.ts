export interface ExternalProperty {
  externalId: string
  source: string
  title: string
  description: string
  price: number
  surface: number
  location: {
    address: string
    city: string
    postalCode: string
    coordinates?: { lat: number; lng: number }
  }
  propertyType: string
  transactionType: string
  images: string[]
  features: string[]
  contact: {
    name?: string
    phone?: string
    email?: string
  }
  url: string
  publishedAt: Date
}

// Configuration des APIs externes
const API_CONFIGS = {
  leboncoin: {
    baseUrl: "https://api.leboncoin.fr/finder/search",
    headers: {
      "User-Agent": "LoopNet-Importer/1.0",
    },
  },
  seloger: {
    baseUrl: "https://ws.seloger.com/search.xml",
    headers: {
      "User-Agent": "LoopNet-Importer/1.0",
    },
  },
  pap: {
    baseUrl: "https://ws.pap.fr/immobilier/annonces",
    headers: {
      "User-Agent": "LoopNet-Importer/1.0",
    },
  },
  bienici: {
    baseUrl: "https://www.bienici.com/realEstateAds.json",
    headers: {
      "User-Agent": "LoopNet-Importer/1.0",
    },
  },
  logic_immo: {
    baseUrl: "https://www.logic-immo.com/api/search",
    headers: {
      "User-Agent": "LoopNet-Importer/1.0",
    },
  },
}

export class ExternalAPIService {
  // Import depuis LeBonCoin
  static async importFromLeBonCoin(filters: {
    category?: string
    location?: string
    priceMin?: number
    priceMax?: number
    limit?: number
  }): Promise<ExternalProperty[]> {
    try {
      // Simulation d'appel API LeBonCoin
      // En réalité, vous utiliseriez leur API officielle ou scraping autorisé
      const mockData = [
        {
          externalId: "lbc_001",
          source: "leboncoin",
          title: "Appartement T3 centre-ville",
          description: "Bel appartement de 65m² en centre-ville, proche commerces et transports.",
          price: 180000,
          surface: 65,
          location: {
            address: "15 Rue de la République",
            city: "Lyon",
            postalCode: "69002",
            coordinates: { lat: 45.7578, lng: 4.832 },
          },
          propertyType: "apartment",
          transactionType: "sale",
          images: [
            "https://img.leboncoin.fr/api/v1/lbcpb1/images/01/23/45/67/89.jpg",
            "https://img.leboncoin.fr/api/v1/lbcpb1/images/01/23/45/67/90.jpg",
          ],
          features: ["Balcon", "Cave", "Ascenseur"],
          contact: {
            name: "Marie Dupont",
            phone: "06.12.34.56.78",
          },
          url: "https://www.leboncoin.fr/ventes_immobilieres/123456789.htm",
          publishedAt: new Date(),
        },
        {
          externalId: "lbc_002",
          source: "leboncoin",
          title: "Maison avec jardin",
          description: "Maison familiale de 120m² avec jardin de 500m².",
          price: 1200,
          surface: 120,
          location: {
            address: "8 Allée des Tilleuls",
            city: "Villeurbanne",
            postalCode: "69100",
            coordinates: { lat: 45.7665, lng: 4.8795 },
          },
          propertyType: "house",
          transactionType: "rent",
          images: ["https://img.leboncoin.fr/api/v1/lbcpb1/images/02/34/56/78/90.jpg"],
          features: ["Jardin", "Garage", "Cheminée"],
          contact: {
            name: "Jean Martin",
            phone: "06.98.76.54.32",
          },
          url: "https://www.leboncoin.fr/locations/123456790.htm",
          publishedAt: new Date(),
        },
      ]

      return mockData
    } catch (error) {
      console.error("Erreur import LeBonCoin:", error)
      return []
    }
  }

  // Import depuis SeLoger
  static async importFromSeLoger(filters: {
    transactionType?: string
    propertyType?: string
    location?: string
    priceMin?: number
    priceMax?: number
    limit?: number
  }): Promise<ExternalProperty[]> {
    try {
      const mockData = [
        {
          externalId: "sl_001",
          source: "seloger",
          title: "Bureau moderne La Défense",
          description: "Plateau de bureaux de 200m² dans tour moderne à La Défense.",
          price: 4500,
          surface: 200,
          location: {
            address: "Tour First, 1 Place des Saisons",
            city: "Courbevoie",
            postalCode: "92400",
            coordinates: { lat: 48.8889, lng: 2.2389 },
          },
          propertyType: "office",
          transactionType: "rent",
          images: [
            "https://v.seloger.com/s/crop/590x330/visuels/1/2/3/4/12345678.jpg",
            "https://v.seloger.com/s/crop/590x330/visuels/1/2/3/4/12345679.jpg",
          ],
          features: ["Climatisation", "Parking", "Sécurité 24h", "Fibre optique"],
          contact: {
            name: "Cabinet Immobilier Pro",
            phone: "01.23.45.67.89",
            email: "contact@cabinet-pro.fr",
          },
          url: "https://www.seloger.com/annonces/locations/bureau/courbevoie-92/123456789.htm",
          publishedAt: new Date(),
        },
      ]

      return mockData
    } catch (error) {
      console.error("Erreur import SeLoger:", error)
      return []
    }
  }

  // Import depuis PAP
  static async importFromPAP(filters: any): Promise<ExternalProperty[]> {
    try {
      const mockData = [
        {
          externalId: "pap_001",
          source: "pap",
          title: "Studio étudiant Quartier Latin",
          description: "Studio meublé de 25m² idéal pour étudiant, proche Sorbonne.",
          price: 850,
          surface: 25,
          location: {
            address: "12 Rue Mouffetard",
            city: "Paris",
            postalCode: "75005",
            coordinates: { lat: 48.8434, lng: 2.3488 },
          },
          propertyType: "studio",
          transactionType: "rent",
          images: ["https://static.pap.fr/images/annonce/123456789/photo-1.jpg"],
          features: ["Meublé", "Internet inclus", "Proche RER"],
          contact: {
            name: "Propriétaire particulier",
            phone: "06.11.22.33.44",
          },
          url: "https://www.pap.fr/annonce/locations-studio-paris-5e-g37757-123456789",
          publishedAt: new Date(),
        },
      ]

      return mockData
    } catch (error) {
      console.error("Erreur import PAP:", error)
      return []
    }
  }

  // Import depuis Bien'ici
  static async importFromBienIci(filters: any): Promise<ExternalProperty[]> {
    try {
      const mockData = [
        {
          externalId: "bi_001",
          source: "bienici",
          title: "Villa avec piscine Cannes",
          description: "Magnifique villa de 300m² avec piscine et vue mer.",
          price: 1200000,
          surface: 300,
          location: {
            address: "Chemin des Collines",
            city: "Cannes",
            postalCode: "06400",
            coordinates: { lat: 43.5528, lng: 7.0174 },
          },
          propertyType: "villa",
          transactionType: "sale",
          images: [
            "https://static.bienici.com/images/annonce/123456789/photo-1.jpg",
            "https://static.bienici.com/images/annonce/123456789/photo-2.jpg",
          ],
          features: ["Piscine", "Vue mer", "Garage double", "Jardin paysager"],
          contact: {
            name: "Agence Côte d'Azur",
            phone: "04.93.12.34.56",
            email: "contact@agence-cotedazur.fr",
          },
          url: "https://www.bienici.com/annonce/vente/villa/cannes-06/123456789",
          publishedAt: new Date(),
        },
      ]

      return mockData
    } catch (error) {
      console.error("Erreur import Bien'ici:", error)
      return []
    }
  }

  // Import depuis Logic-Immo
  static async importFromLogicImmo(filters: any): Promise<ExternalProperty[]> {
    try {
      const mockData = [
        {
          externalId: "li_001",
          source: "logic_immo",
          title: "Entrepôt logistique Roissy",
          description: "Entrepôt de 5000m² avec quais de chargement, proche aéroport.",
          price: 15000,
          surface: 5000,
          location: {
            address: "Zone Industrielle de Roissy",
            city: "Roissy-en-France",
            postalCode: "95700",
            coordinates: { lat: 49.0097, lng: 2.5144 },
          },
          propertyType: "warehouse",
          transactionType: "rent",
          images: ["https://static.logic-immo.com/images/annonce/123456789/photo-1.jpg"],
          features: ["Quais de chargement", "Hauteur 10m", "Parking poids lourds"],
          contact: {
            name: "Immobilier d'Entreprise",
            phone: "01.48.12.34.56",
            email: "commercial@immo-entreprise.fr",
          },
          url: "https://www.logic-immo.com/location-entrepot-roissy-en-france-95/123456789.htm",
          publishedAt: new Date(),
        },
      ]

      return mockData
    } catch (error) {
      console.error("Erreur import Logic-Immo:", error)
      return []
    }
  }

  // Méthode générique d'import
  static async importFromSource(source: string, filters: any = {}): Promise<ExternalProperty[]> {
    switch (source) {
      case "leboncoin":
        return this.importFromLeBonCoin(filters)
      case "seloger":
        return this.importFromSeLoger(filters)
      case "pap":
        return this.importFromPAP(filters)
      case "bienici":
        return this.importFromBienIci(filters)
      case "logic_immo":
        return this.importFromLogicImmo(filters)
      default:
        throw new Error(`Source non supportée: ${source}`)
    }
  }

  // Import depuis toutes les sources
  static async importFromAllSources(filters: any = {}): Promise<ExternalProperty[]> {
    const sources = ["leboncoin", "seloger", "pap", "bienici", "logic_immo"]
    const allProperties: ExternalProperty[] = []

    for (const source of sources) {
      try {
        const properties = await this.importFromSource(source, filters)
        allProperties.push(...properties)
      } catch (error) {
        console.error(`Erreur import ${source}:`, error)
      }
    }

    return allProperties
  }
}

// Utilitaires de conversion
export const convertExternalToInternal = (external: ExternalProperty) => {
  return {
    title: external.title,
    description: external.description,
    propertyType: external.propertyType,
    transactionType: external.transactionType,
    address: external.location.address,
    city: external.location.city,
    postalCode: external.location.postalCode,
    coordinates: external.location.coordinates,
    price: external.price,
    surface: external.surface,
    features: external.features,
    images: external.images.map((url, index) => ({
      url,
      publicId: `external_${external.source}_${external.externalId}_${index}`,
      alt: `Photo ${index + 1}`,
      isPrimary: index === 0,
    })),
    contactInfo: {
      name: external.contact.name || "Contact externe",
      email: external.contact.email || "",
      phone: external.contact.phone || "",
    },
    status: "pending" as const,
    source: external.source,
    externalId: external.externalId,
    externalUrl: external.url,
    publishedAt: external.publishedAt,
  }
}
