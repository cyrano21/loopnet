import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const layers = searchParams.get("layers")?.split(",") || []
  const bounds = searchParams.get("bounds")
  const propertyType = searchParams.get("propertyType") || "all"
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const radius = searchParams.get("radius") || "5"

  try {
    // Données de démonstration pour les propriétés géolocalisées
    const mockProperties = [
      {
        id: "map-prop-1",
        title: "Bureau moderne - Tour Montparnasse",
        address: "33 Avenue du Maine, 75015 Paris",
        price: 12500000,
        size: 1200,
        propertyType: "office",
        coordinates: { lat: 48.8422, lng: 2.3219 },
        status: "available",
        features: ["parking", "metro", "restaurant"]
      },
      {
        id: "map-prop-2", 
        title: "Local commercial - Champs-Élysées",
        address: "45 Avenue des Champs-Élysées, 75008 Paris",
        price: 8750000,
        size: 850,
        propertyType: "retail",
        coordinates: { lat: 48.8708, lng: 2.3034 },
        status: "pending",
        features: ["metro", "shopping", "tourism"]
      },
      {
        id: "map-prop-3",
        title: "Entrepôt logistique - Roissy",
        address: "Zone Industrielle Charles de Gaulle, 95700 Roissy-en-France",
        price: 3200000,
        size: 5000,
        propertyType: "warehouse",
        coordinates: { lat: 49.0097, lng: 2.5479 },
        status: "available",
        features: ["highway", "airport", "loading"]
      },
      {
        id: "map-prop-4",
        title: "Bureaux - La Défense",
        address: "1 Parvis de la Défense, 92800 Puteaux",
        price: 15000000,
        size: 2000,
        propertyType: "office",
        coordinates: { lat: 48.8915, lng: 2.2368 },
        status: "available",
        features: ["metro", "parking", "restaurant", "business"]
      },
      {
        id: "map-prop-5",
        title: "Usine moderne - Évry",
        address: "Boulevard de l'Europe, 91000 Évry-Courcouronnes",
        price: 5500000,
        size: 3500,
        propertyType: "industrial",
        coordinates: { lat: 48.6333, lng: 2.4333 },
        status: "available",
        features: ["highway", "train", "industrial"]
      }
    ];

    // Filtrer selon les critères
    let filteredProperties = mockProperties.filter(prop => {
      if (propertyType !== "all" && prop.propertyType !== propertyType) return false;
      if (minPrice && prop.price < parseInt(minPrice)) return false;
      if (maxPrice && prop.price > parseInt(maxPrice)) return false;
      return true;
    });

    // Données des calques selon les paramètres
    const layerData = {
      price: layers.includes("price") ? {
        heatmap: [
          { lat: 48.8566, lng: 2.3522, intensity: 0.9, value: 12000 }, // Paris centre
          { lat: 48.8915, lng: 2.2368, intensity: 0.8, value: 10500 }, // La Défense
          { lat: 48.8422, lng: 2.3219, intensity: 0.7, value: 8500 }, // Montparnasse
          { lat: 48.8708, lng: 2.3034, intensity: 0.6, value: 7200 }, // Champs-Élysées
        ],
        zones: [
          { name: "Paris Centre", avgPrice: 12000, growth: 6.2 },
          { name: "La Défense", avgPrice: 10500, growth: 4.8 },
          { name: "Montparnasse", avgPrice: 8500, growth: 7.1 }
        ]
      } : null,

      density: layers.includes("density") ? {
        clusters: [
          { lat: 48.8566, lng: 2.3522, count: 145, radius: 2000 },
          { lat: 48.8915, lng: 2.2368, count: 89, radius: 1500 },
          { lat: 48.8422, lng: 2.3219, count: 67, radius: 1200 }
        ]
      } : null,

      demographics: layers.includes("demographics") ? {
        zones: [
          { 
            name: "Paris 15e", 
            population: 233392, 
            employment: 94.2, 
            income: 52000,
            coordinates: { lat: 48.8422, lng: 2.3219 }
          },
          { 
            name: "Paris 8e", 
            population: 36296, 
            employment: 96.1, 
            income: 85000,
            coordinates: { lat: 48.8708, lng: 2.3034 }
          }
        ]
      } : null,

      transport: layers.includes("transport") ? {
        metro: [
          { name: "Châtelet", type: "metro", coordinates: { lat: 48.8583, lng: 2.3472 } },
          { name: "La Défense", type: "metro", coordinates: { lat: 48.8915, lng: 2.2368 } },
          { name: "Montparnasse", type: "metro", coordinates: { lat: 48.8422, lng: 2.3219 } }
        ],
        highways: [
          { name: "A4", type: "highway", coordinates: [
            { lat: 48.8566, lng: 2.3522 },
            { lat: 48.8333, lng: 2.5000 }
          ]}
        ]
      } : null,

      amenities: layers.includes("amenities") ? {
        restaurants: [
          { name: "Le Jules Verne", coordinates: { lat: 48.8584, lng: 2.2945 }, rating: 4.8 },
          { name: "L'Ami Jean", coordinates: { lat: 48.8534, lng: 2.3112 }, rating: 4.6 }
        ],
        shopping: [
          { name: "Galeries Lafayette", coordinates: { lat: 48.8738, lng: 2.3319 } },
          { name: "Le Bon Marché", coordinates: { lat: 48.8487, lng: 2.3244 } }
        ],
        schools: [
          { name: "HEC Paris", coordinates: { lat: 48.7596, lng: 2.1675 } },
          { name: "ESSEC", coordinates: { lat: 49.0347, lng: 2.0775 } }
        ]
      } : null
    };

    // Analyse de zone (si bounds fourni)
    let zoneAnalysis = null;
    if (bounds) {
      zoneAnalysis = {
        propertyCount: filteredProperties.length,
        avgPrice: filteredProperties.reduce((sum, p) => sum + p.price, 0) / filteredProperties.length,
        priceRange: {
          min: Math.min(...filteredProperties.map(p => p.price)),
          max: Math.max(...filteredProperties.map(p => p.price))
        },
        demographics: {
          population: 245000,
          employmentRate: 93.5,
          avgIncome: 48000,
          businessDensity: 342
        },
        marketTrends: {
          growth: 7.8,
          inventory: 2.1,
          avgDaysOnMarket: 42
        }
      };
    }

    return NextResponse.json({
      success: true,
      properties: filteredProperties,
      layers: layerData,
      zoneAnalysis,
      filters: { propertyType, minPrice, maxPrice, radius },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Erreur API cartes:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des données cartographiques" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (action === "export") {
      return NextResponse.json({
        success: true,
        message: "Données cartographiques exportées avec succès",
        downloadUrl: `/api/maps/export/${Date.now()}`
      });
    }

    if (action === "save-view") {
      return NextResponse.json({
        success: true,
        message: "Vue cartographique sauvegardée",
        viewId: `view-${Date.now()}`
      });
    }

    return NextResponse.json(
      { success: false, error: "Action non supportée" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Erreur POST API cartes:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors du traitement de la requête" },
      { status: 500 }
    );
  }
}
