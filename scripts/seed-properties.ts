import { connectDB } from "../lib/mongodb";
import Property from "../models/Property";
import User from "../models/User";

const sampleProperties = [
  {
    title: "Bureau moderne avec terrasse - Quartier d'affaires",
    description: `Magnifique bureau de 120m² situé au cœur du quartier d'affaires de La Défense. 
    
    Cet espace de travail moderne offre :
    - 4 bureaux individuels climatisés
    - 1 salle de réunion équipée
    - 1 open space lumineux
    - 1 terrasse privative de 25m²
    - 2 places de parking incluses
    - Accès sécurisé 24h/24
    
    Idéal pour une entreprise de 8-12 personnes. Proche métro ligne 1, RER A.
    Disponible immédiatement.`,
    propertyType: "Bureau",
    transactionType: "rent",
    address: "15 Avenue Charles de Gaulle",
    city: "Neuilly-sur-Seine",
    postalCode: "92200",
    country: "France",
    coordinates: { lat: 48.8848, lng: 2.2685 },
    price: 4500,
    surface: 120,
    rooms: 6,
    yearBuilt: 2018,
    floor: 3,
    totalFloors: 8,
    features: [
      "Climatisation",
      "Terrasse",
      "Parking",
      "Ascenseur",
      "Sécurité 24h/24",
      "Fibre optique"
    ],
    images: [
      "/images/properties/bureau-moderne-1.jpg",
      "/images/properties/bureau-moderne-2.jpg",
      "/images/properties/bureau-moderne-3.jpg"
    ],
    contactInfo: {
      name: "Marie Martin",
      email: "marie.martin@realty.com",
      phone: "+33 6 98 76 54 32"
    },
    status: "active",
    publishedAt: new Date("2024-01-15"),
    views: 156,
    favorites: 12,
    inquiries: 8,
    availableFrom: new Date("2024-02-01"),
    visitSchedule: "Lundi au vendredi 9h-18h",
    isPremium: true,
    isFeatured: true
  },
  {
    title: "Local commercial - Centre-ville historique",
    description: `Charmant local commercial de 80m² en rez-de-chaussée, situé dans le centre historique de la ville.
    
    Caractéristiques :
    - Grande vitrine sur rue passante
    - 2 espaces de vente + réserve
    - WC + point d'eau
    - Chauffage au gaz
    - Excellent état général
    
    Idéal pour commerce de proximité, boutique, bureau. Fort passage piéton.
    Loyer charges comprises.`,
    propertyType: "Commerce",
    transactionType: "rent",
    address: "23 Rue de la République",
    city: "Lyon",
    postalCode: "69002",
    country: "France",
    coordinates: { lat: 45.7640, lng: 4.8357 },
    price: 2800,
    surface: 80,
    rooms: 3,
    yearBuilt: 1950,
    floor: 0,
    totalFloors: 4,
    features: [
      "Vitrine",
      "Chauffage gaz",
      "Point d'eau",
      "Centre-ville",
      "Transport"
    ],
    images: [
      "/images/properties/local-commercial-1.jpg",
      "/images/properties/local-commercial-2.jpg"
    ],
    contactInfo: {
      name: "Jean Dupont",
      email: "jean.dupont@email.com",
      phone: "+33 6 12 34 56 78"
    },
    status: "active",
    publishedAt: new Date("2024-01-20"),
    views: 89,
    favorites: 6,
    inquiries: 3,
    availableFrom: new Date("2024-03-01"),
    visitSchedule: "Sur rendez-vous",
    isPremium: false,
    isFeatured: false
  },
  {
    title: "Entrepôt logistique - Zone industrielle",
    description: `Entrepôt de 1200m² dans zone industrielle bien desservie.
    
    Équipements :
    - Hauteur sous plafond 8m
    - 2 quais de chargement
    - Bureau de 50m² intégré
    - Parking poids lourds
    - Accès autoroute proche
    
    Parfait pour activité logistique, stockage, distribution.
    Disponible rapidement.`,
    propertyType: "Entrepôt",
    transactionType: "sale",
    address: "Zone Industrielle des Pins",
    city: "Marseille",
    postalCode: "13015",
    country: "France",
    coordinates: { lat: 43.3584, lng: 5.3635 },
    price: 850000,
    surface: 1200,
    rooms: 1,
    yearBuilt: 2010,
    floor: 0,
    totalFloors: 1,
    features: [
      "Quais de chargement",
      "Hauteur 8m",
      "Parking PL",
      "Bureau intégré",
      "Accès autoroute"
    ],
    images: [
      "/images/properties/entrepot-1.jpg",
      "/images/properties/entrepot-2.jpg",
      "/images/properties/entrepot-3.jpg"
    ],
    contactInfo: {
      name: "Pierre Durand",
      email: "pierre.durand@gmail.com",
      phone: "+33 6 55 44 33 22"
    },
    status: "active",
    publishedAt: new Date("2024-01-25"),
    views: 67,
    favorites: 4,
    inquiries: 2,
    availableFrom: new Date("2024-02-15"),
    visitSchedule: "Lundi au vendredi 8h-17h",
    isPremium: false,
    isFeatured: false
  }
];

export async function seedProperties() {
  try {
    console.log("🏢 Vérification et création des propriétés de test...");

    // Get existing users to assign as owners
    const existingUsers = await User.find({});
    
    if (existingUsers.length === 0) {
      console.log("⚠️  Aucun utilisateur trouvé. Veuillez d'abord exécuter le seed des utilisateurs.");
      return { created: [], skipped: [], errors: [] };
    }

    const results = {
      created: [] as any[],
      skipped: [] as any[],
      errors: [] as any[]
    };

    for (let i = 0; i < sampleProperties.length; i++) {
      const propertyData = sampleProperties[i];
      
      try {
        // Check if property already exists
        const existingProperty = await Property.findOne({ title: propertyData.title });
        
        if (existingProperty) {
          console.log(`⚠️  Propriété "${propertyData.title}" existe déjà`);
          results.skipped.push(propertyData.title);
          continue;
        }

        // Generate slug
        const slug = propertyData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") + "-" + Date.now() + "-" + i;

        // Assign owner and owner type
        const owner = existingUsers[i % existingUsers.length];
        const ownerType = owner.role === "agent" ? "agent" : "individual";

        const property = new Property({
          ...propertyData,
          slug,
          owner: owner._id,
          ownerType
        });

        await property.save();
        console.log(`✅ Propriété créée: ${propertyData.title}`);
        results.created.push(propertyData.title);
      } catch (error) {
        console.error(`❌ Erreur lors de la création de "${propertyData.title}":`, error);
        results.errors.push({ title: propertyData.title, error: error.message });
      }
    }

    console.log(`\n📊 Résumé des propriétés:`);
    console.log(`   - Créées: ${results.created.length}`);
    console.log(`   - Ignorées: ${results.skipped.length}`);
    console.log(`   - Erreurs: ${results.errors.length}`);

    if (results.errors.length > 0) {
      console.log(`\n❌ Erreurs détaillées:`);
      results.errors.forEach(err => {
        console.log(`   - ${err.title}: ${err.error}`);
      });
    }

    return results;
  } catch (error) {
    console.error("❌ Erreur lors du seeding des propriétés:", error);
    throw error;
  }
}