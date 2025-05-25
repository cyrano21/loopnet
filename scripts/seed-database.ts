import { connectToDatabase } from "../lib/mongodb"
import User from "../models/User"
import Property from "../models/Property"
import Inquiry from "../models/Inquiry"

const sampleUsers = [
  {
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    role: "user",
    phone: "+33 6 12 34 56 78",
    bio: "Propriétaire particulier, passionné d'immobilier",
    preferences: {
      notifications: { email: true, sms: false, push: true },
      searchAlerts: true,
      newsletter: true,
    },
    isEmailVerified: true,
    subscription: {
      plan: "premium",
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
    },
  },
  {
    name: "Marie Martin",
    email: "marie.martin@realty.com",
    role: "agent",
    phone: "+33 6 98 76 54 32",
    bio: "Agent immobilier spécialisé en commercial, 10 ans d'expérience",
    company: "Martin Immobilier",
    license: "CPI-75-2024-001",
    preferences: {
      notifications: { email: true, sms: true, push: true },
      searchAlerts: true,
      newsletter: false,
    },
    isEmailVerified: true,
    subscription: {
      plan: "enterprise",
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
    },
  },
  {
    name: "Pierre Durand",
    email: "pierre.durand@gmail.com",
    role: "user",
    phone: "+33 6 55 44 33 22",
    bio: "Investisseur immobilier",
    preferences: {
      notifications: { email: true, sms: false, push: false },
      searchAlerts: false,
      newsletter: true,
    },
    isEmailVerified: true,
    subscription: {
      plan: "basic",
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  },
]

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
      "Fibre optique",
      "Cuisine équipée",
    ],
    energyClass: "B",
    heating: "Climatisation réversible",
    parking: "2 places incluses",
    images: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        publicId: "office_1_main",
        alt: "Bureau principal avec vue",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
        publicId: "office_1_meeting",
        alt: "Salle de réunion moderne",
      },
      {
        url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
        publicId: "office_1_terrace",
        alt: "Terrasse avec vue",
      },
    ],
    contactInfo: {
      name: "Jean Dupont",
      email: "jean.dupont@email.com",
      phone: "+33 6 12 34 56 78",
    },
    status: "active",
    publishedAt: new Date("2024-01-15"),
    views: 247,
    favorites: 18,
    inquiries: 12,
    availableFrom: new Date("2024-02-01"),
    visitSchedule: "Du lundi au vendredi, 9h-18h sur rendez-vous",
    isPremium: true,
    premiumUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isFeatured: true,
  },
  {
    title: "Local commercial - Centre-ville historique",
    description: `Superbe local commercial de 85m² en rez-de-chaussée, situé dans une rue piétonne très passante du centre historique.
    
    Caractéristiques :
    - Grande vitrine de 6 mètres linéaires
    - Hauteur sous plafond 3,2m
    - Réserve de 15m² en sous-sol
    - WC et point d'eau
    - Chauffage au gaz
    - Excellent état général
    
    Parfait pour commerce de détail, boutique, restaurant.
    Loyer charges comprises. Pas de droit d'entrée.`,
    propertyType: "Commerce",
    transactionType: "rent",
    address: "8 Rue du Commerce",
    city: "Aix-en-Provence",
    postalCode: "13100",
    country: "France",
    coordinates: { lat: 43.5297, lng: 5.4474 },
    price: 2800,
    surface: 85,
    rooms: 2,
    yearBuilt: 1950,
    floor: 0,
    features: ["Grande vitrine", "Réserve", "Centre-ville", "Rue piétonne", "Chauffage gaz", "Point d'eau"],
    energyClass: "D",
    heating: "Gaz naturel",
    images: [
      {
        url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
        publicId: "shop_1_main",
        alt: "Façade du local commercial",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800",
        publicId: "shop_1_interior",
        alt: "Intérieur spacieux",
      },
    ],
    contactInfo: {
      name: "Marie Martin",
      email: "marie.martin@realty.com",
      phone: "+33 6 98 76 54 32",
    },
    status: "active",
    publishedAt: new Date("2024-01-20"),
    views: 156,
    favorites: 9,
    inquiries: 7,
    availableFrom: new Date("2024-03-01"),
    visitSchedule: "Mardi et jeudi 14h-17h, samedi 10h-12h",
    isPremium: false,
    isFeatured: false,
  },
  {
    title: "Entrepôt logistique - Zone industrielle",
    description: `Entrepôt moderne de 1200m² dans zone industrielle stratégique.
    
    Spécifications techniques :
    - Hauteur libre 8 mètres
    - 4 quais de déchargement
    - Portail automatique poids lourds
    - Sol béton armé
    - Éclairage LED
    - Bureau de 50m² inclus
    - Parking 20 places
    
    Accès direct autoroute A6. Idéal logistique, stockage, distribution.
    Possibilité division. Prix négociable.`,
    propertyType: "Entrepôt",
    transactionType: "sale",
    address: "Zone Industrielle des Graviers",
    city: "Corbeil-Essonnes",
    postalCode: "91100",
    country: "France",
    coordinates: { lat: 48.6167, lng: 2.4833 },
    price: 850000,
    surface: 1200,
    rooms: 1,
    yearBuilt: 2015,
    features: [
      "Quais de déchargement",
      "Hauteur 8m",
      "Portail automatique",
      "Bureau inclus",
      "Parking",
      "Accès autoroute",
      "Éclairage LED",
    ],
    energyClass: "C",
    heating: "Chauffage industriel",
    parking: "20 places",
    images: [
      {
        url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
        publicId: "warehouse_1_main",
        alt: "Vue extérieure entrepôt",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
        publicId: "warehouse_1_interior",
        alt: "Intérieur spacieux",
      },
    ],
    contactInfo: {
      name: "Pierre Durand",
      email: "pierre.durand@gmail.com",
      phone: "+33 6 55 44 33 22",
    },
    status: "active",
    publishedAt: new Date("2024-01-10"),
    views: 89,
    favorites: 5,
    inquiries: 3,
    availableFrom: new Date("2024-04-01"),
    visitSchedule: "Sur rendez-vous uniquement",
    isPremium: true,
    premiumUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    isFeatured: false,
  },
  {
    title: "Immeuble de bureaux - Investissement",
    description: `Immeuble de rapport entièrement loué, excellent rendement.
    
    Composition :
    - 6 plateaux de bureaux (150m² chacun)
    - 2 commerces en RDC (80m² chacun)
    - 15 places de parking
    - Ascenseur récent
    - Toiture refaite en 2022
    
    Revenus locatifs : 18 000€/mois
    Rendement brut : 7,2%
    Tous baux longue durée (3-6-9 ans)
    Locataires solvables et fidèles.`,
    propertyType: "Immeuble",
    transactionType: "sale",
    address: "45 Boulevard de la République",
    city: "Saint-Denis",
    postalCode: "93200",
    country: "France",
    coordinates: { lat: 48.9362, lng: 2.3574 },
    price: 2950000,
    surface: 1060,
    rooms: 8,
    yearBuilt: 1985,
    totalFloors: 4,
    features: [
      "Entièrement loué",
      "Rendement 7,2%",
      "Ascenseur",
      "Parking",
      "Toiture neuve",
      "Baux longue durée",
      "Proche métro",
    ],
    energyClass: "C",
    heating: "Chauffage collectif gaz",
    parking: "15 places",
    images: [
      {
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
        publicId: "building_1_main",
        alt: "Façade immeuble de bureaux",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
        publicId: "building_1_office",
        alt: "Plateau de bureaux type",
      },
    ],
    contactInfo: {
      name: "Marie Martin",
      email: "marie.martin@realty.com",
      phone: "+33 6 98 76 54 32",
    },
    status: "active",
    publishedAt: new Date("2024-01-05"),
    views: 312,
    favorites: 24,
    inquiries: 18,
    availableFrom: new Date("2024-06-01"),
    visitSchedule: "Mercredi et vendredi 10h-16h sur RDV",
    isPremium: true,
    premiumUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    isFeatured: true,
  },
  {
    title: "Local d'activité - Artisanat",
    description: `Local d'activité de 200m² parfait pour artisan ou petite industrie.
    
    Équipements :
    - Atelier principal 150m²
    - Bureau et accueil 30m²
    - Vestiaires et sanitaires 20m²
    - Électricité triphasée
    - Portail 4m de large
    - Cour de manœuvre
    
    Autorisations : artisanat, petite industrie non polluante.
    Loyer attractif, charges réduites.`,
    propertyType: "Local d'activité",
    transactionType: "rent",
    address: "12 Rue de l'Artisanat",
    city: "Meaux",
    postalCode: "77100",
    country: "France",
    coordinates: { lat: 48.9606, lng: 2.8789 },
    price: 1800,
    surface: 200,
    rooms: 3,
    yearBuilt: 1990,
    features: [
      "Électricité triphasée",
      "Portail large",
      "Cour de manœuvre",
      "Vestiaires",
      "Autorisations artisanat",
      "Charges réduites",
    ],
    energyClass: "E",
    heating: "Chauffage électrique",
    parking: "Cour privée",
    images: [
      {
        url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800",
        publicId: "workshop_1_main",
        alt: "Atelier spacieux",
        isPrimary: true,
      },
    ],
    contactInfo: {
      name: "Jean Dupont",
      email: "jean.dupont@email.com",
      phone: "+33 6 12 34 56 78",
    },
    status: "active",
    publishedAt: new Date("2024-01-25"),
    views: 67,
    favorites: 4,
    inquiries: 2,
    availableFrom: new Date("2024-02-15"),
    visitSchedule: "Lundi au vendredi 8h-17h",
    isPremium: false,
    isFeatured: false,
  },
]

const sampleInquiries = [
  {
    propertyTitle: "Bureau moderne avec terrasse - Quartier d'affaires",
    inquirerName: "Sophie Leblanc",
    inquirerEmail: "sophie.leblanc@startup.com",
    inquirerPhone: "+33 6 11 22 33 44",
    message:
      "Bonjour, nous sommes une startup de 10 personnes et ce bureau nous intéresse beaucoup. Serait-il possible de programmer une visite la semaine prochaine ? Nous cherchons à emménager rapidement.",
    status: "new",
    inquiryType: "visit",
    budget: 5000,
    timeline: "immediate",
  },
  {
    propertyTitle: "Local commercial - Centre-ville historique",
    inquirerName: "Marc Rousseau",
    inquirerEmail: "marc.rousseau@gmail.com",
    inquirerPhone: "+33 6 77 88 99 00",
    message:
      "Je souhaite ouvrir une boutique de vêtements. Le local me semble parfait. Pouvez-vous me donner plus d'informations sur les charges et les conditions du bail ?",
    status: "responded",
    inquiryType: "information",
    budget: 3000,
    timeline: "3_months",
  },
  {
    propertyTitle: "Entrepôt logistique - Zone industrielle",
    inquirerName: "Transport Express SARL",
    inquirerEmail: "contact@transport-express.fr",
    inquirerPhone: "+33 1 23 45 67 89",
    message:
      "Nous cherchons un entrepôt pour notre activité de transport. Vos 1200m² correspondent à nos besoins. Le prix est-il négociable ? Possibilité de visite cette semaine ?",
    status: "new",
    inquiryType: "negotiation",
    budget: 800000,
    timeline: "6_months",
  },
]

export async function seedDatabase() {
  try {
    console.log("🌱 Début du seed de la base de données...")

    // Connexion à la base de données
    await connectToDatabase()

    // Nettoyer les collections existantes
    console.log("🧹 Nettoyage des données existantes...")
    await User.deleteMany({})
    await Property.deleteMany({})
    await Inquiry.deleteMany({})

    // Créer les utilisateurs
    console.log("👥 Création des utilisateurs...")
    const createdUsers = await User.insertMany(sampleUsers)
    console.log(`✅ ${createdUsers.length} utilisateurs créés`)

    // Associer les propriétés aux utilisateurs
    const propertiesWithOwners = sampleProperties.map((property, index) => ({
      ...property,
      owner: createdUsers[index % createdUsers.length]._id,
      ownerType: createdUsers[index % createdUsers.length].role === "agent" ? "agent" : "individual",
    }))

    // Créer les propriétés
    console.log("🏢 Création des propriétés...")
    const createdProperties = await Property.insertMany(propertiesWithOwners)
    console.log(`✅ ${createdProperties.length} propriétés créées`)

    // Associer les demandes aux propriétés
    const inquiriesWithProperties = sampleInquiries.map((inquiry, index) => ({
      ...inquiry,
      property: createdProperties[index % createdProperties.length]._id,
      propertyOwner: createdProperties[index % createdProperties.length].owner,
    }))

    // Créer les demandes
    console.log("📧 Création des demandes...")
    const createdInquiries = await Inquiry.insertMany(inquiriesWithProperties)
    console.log(`✅ ${createdInquiries.length} demandes créées`)

    // Statistiques finales
    console.log("\n📊 Résumé du seed :")
    console.log(`👥 Utilisateurs : ${createdUsers.length}`)
    console.log(`🏢 Propriétés : ${createdProperties.length}`)
    console.log(`📧 Demandes : ${createdInquiries.length}`)

    console.log("\n🎉 Seed terminé avec succès !")

    return {
      users: createdUsers,
      properties: createdProperties,
      inquiries: createdInquiries,
    }
  } catch (error) {
    console.error("❌ Erreur lors du seed :", error)
    throw error
  }
}

// Exécuter le seed si le script est appelé directement
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("✅ Seed terminé")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Erreur :", error)
      process.exit(1)
    })
}
