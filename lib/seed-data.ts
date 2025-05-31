// Données de test pour les propriétés commerciales
// Inspirées de la structure de l'application Homez

export interface PropertySeedData {
  id: string;
  title: string;
  description: string;
  price: number;
  surface: number;
  address: string;
  city: string;
  postalCode: string;
  propertyType: string;
  transactionType: "sale" | "rent";
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  images: string[];
  features: string[];
  source: string;
  featured: boolean;
  lat?: number;
  lng?: number;
  energyClass?: string;
  parking?: number;
  floor?: number;
  totalFloors?: number;
  furnished?: boolean;
  balcony?: boolean;
  terrace?: boolean;
  garden?: boolean;
  elevator?: boolean;
  accessibility?: boolean;
  tags: string[];
  agent?: {
    id?: string;
    name: string;
    phone: string;
    email: string;
    company: string;
    image?: string;
  };
  views?: number;
  favorites?: number;
  inquiries?: number;
  // Added missing properties
  neighborhood?: string;
  region?: string;
  type?: string;
  status?: string;
  rooms?: number;
  createdAt?: string;
  _id?: string;
}

export const propertiesSeedData: PropertySeedData[] = [
  {
    id: "1",
    title: "Bureau moderne dans le quartier d'affaires",
    description:
      "Magnifique bureau de 150m² situé au cœur du quartier d'affaires de La Défense. Entièrement rénové avec des finitions haut de gamme, climatisation, et vue panoramique sur Paris.",
    price: 450000,
    surface: 150,
    address: "15 Avenue Charles de Gaulle",
    city: "Neuilly-sur-Seine",
    postalCode: "92200",
    propertyType: "Bureau",
    transactionType: "sale",
    yearBuilt: 2018,
    images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    features: [
      "Climatisation",
      "Fibre optique",
      "Parking privé",
      "Sécurité 24h/24",
      "Vue panoramique",
    ],
    source: "Century 21",
    featured: true,
    lat: 48.8848,
    lng: 2.2482,
    energyClass: "B",
    parking: 2,
    floor: 8,
    totalFloors: 15,
    elevator: true,
    accessibility: true,
    tags: ["Neuf", "Haut de gamme", "Vue"],
    agent: {
      name: "Sophie Martin",
      phone: "06 12 34 56 78",
      email: "sophie.martin@century21.fr",
      company: "Century 21 Entreprise",
    },
  },
  {
    id: "2",
    title: "Local commercial avec vitrine",
    description:
      "Local commercial de 80m² avec grande vitrine sur rue passante. Idéal pour commerce de détail, restaurant ou services. Possibilité d'aménagement selon activité.",
    price: 2800,
    surface: 80,
    address: "42 Rue de Rivoli",
    city: "Paris",
    postalCode: "75001",
    propertyType: "Local commercial",
    transactionType: "rent",
    yearBuilt: 1995,
    images: ["/placeholder.jpg", "/placeholder.jpg"],
    features: [
      "Grande vitrine",
      "Rue passante",
      "Climatisation",
      "Réserve",
      "WC",
    ],
    source: "Orpi",
    featured: false,
    lat: 48.8606,
    lng: 2.3376,
    energyClass: "C",
    floor: 0,
    totalFloors: 1,
    accessibility: true,
    tags: ["Centre-ville", "Vitrine", "Commerce"],
    agent: {
      name: "Thomas Dubois",
      phone: "06 23 45 67 89",
      email: "thomas.dubois@orpi.com",
      company: "Orpi Commercial",
    },
  },
  {
    id: "3",
    title: "Entrepôt logistique moderne",
    description:
      "Entrepôt de 500m² avec quai de chargement, hauteur sous plafond 6m, et bureau attenant de 50m². Parfait pour activité logistique ou stockage.",
    price: 320000,
    surface: 500,
    address: "Zone Industrielle des Petits Carreaux",
    city: "Roissy-en-France",
    postalCode: "95700",
    propertyType: "Entrepôt",
    transactionType: "sale",
    yearBuilt: 2010,
    images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    features: [
      "Quai de chargement",
      "Hauteur 6m",
      "Bureau attenant",
      "Parking poids lourds",
      "Sécurité",
    ],
    source: "BNP Paribas Real Estate",
    featured: true,
    lat: 49.0097,
    lng: 2.5144,
    energyClass: "D",
    parking: 10,
    tags: ["Logistique", "Quai", "Moderne"],
    agent: {
      name: "Philippe Leroy",
      phone: "06 34 56 78 90",
      email: "philippe.leroy@bnpparibas.com",
      company: "BNP Paribas Real Estate",
    },
  },
  {
    id: "4",
    title: "Restaurant équipé centre-ville",
    description:
      "Restaurant de 120m² entièrement équipé en centre-ville. Cuisine professionnelle, salle de 40 couverts, terrasse de 20m². Licence IV incluse.",
    price: 4500,
    surface: 120,
    address: "8 Place du Marché",
    city: "Versailles",
    postalCode: "78000",
    propertyType: "Restaurant",
    transactionType: "rent",
    yearBuilt: 2005,
    images: ["/placeholder.jpg", "/placeholder.jpg"],
    features: [
      "Cuisine équipée",
      "Licence IV",
      "Terrasse",
      "Cave",
      "Climatisation",
    ],
    source: "Foncia",
    featured: false,
    lat: 48.8049,
    lng: 2.1204,
    energyClass: "C",
    terrace: true,
    accessibility: true,
    tags: ["Équipé", "Terrasse", "Centre-ville"],
    agent: {
      name: "Marie Rousseau",
      phone: "06 45 67 89 01",
      email: "marie.rousseau@foncia.com",
      company: "Foncia Versailles",
    },
  },
  {
    id: "5",
    title: "Immeuble de bureaux à rénover",
    description:
      "Immeuble de bureaux de 800m² sur 4 niveaux à rénover. Potentiel exceptionnel, proche transports. Idéal investisseur ou utilisateur.",
    price: 1200000,
    surface: 800,
    address: "156 Boulevard Haussmann",
    city: "Paris",
    postalCode: "75008",
    propertyType: "Immeuble de bureaux",
    transactionType: "sale",
    yearBuilt: 1970,
    images: ["/placeholder.jpg", "/placeholder.jpg"],
    features: [
      "À rénover",
      "4 niveaux",
      "Proche métro",
      "Potentiel",
      "Investissement",
    ],
    source: "Cushman & Wakefield",
    featured: true,
    lat: 48.8738,
    lng: 2.3089,
    energyClass: "F",
    floor: 0,
    totalFloors: 4,
    elevator: true,
    tags: ["Rénovation", "Investissement", "Potentiel"],
    agent: {
      name: "Jean-Pierre Moreau",
      phone: "06 56 78 90 12",
      email: "jp.moreau@cushwake.com",
      company: "Cushman & Wakefield",
    },
  },
  {
    id: "6",
    title: "Atelier d'artiste avec verrière",
    description:
      "Magnifique atelier de 200m² avec verrière d'époque, hauteur sous plafond 4m. Idéal pour artiste, architecte ou activité créative.",
    price: 3200,
    surface: 200,
    address: "12 Passage des Artistes",
    city: "Montreuil",
    postalCode: "93100",
    propertyType: "Atelier",
    transactionType: "rent",
    yearBuilt: 1920,
    images: ["/placeholder.jpg", "/placeholder.jpg"],
    features: [
      "Verrière d'époque",
      "Hauteur 4m",
      "Lumière naturelle",
      "Cachet",
      "Calme",
    ],
    source: "Guy Hoquet",
    featured: false,
    lat: 48.8618,
    lng: 2.4431,
    energyClass: "E",
    tags: ["Cachet", "Verrière", "Artiste"],
    agent: {
      name: "Isabelle Petit",
      phone: "06 67 89 01 23",
      email: "isabelle.petit@guyhoquet.com",
      company: "Guy Hoquet Montreuil",
    },
  },
  {
    id: "7",
    title: "Showroom automobile premium",
    description:
      "Showroom de 300m² avec vitrine exceptionnelle, atelier de 100m² et bureaux de 80m². Parfait pour concessionnaire automobile.",
    price: 850000,
    surface: 480,
    address: "Avenue des Champs-Élysées",
    city: "Paris",
    postalCode: "75008",
    propertyType: "Showroom",
    transactionType: "sale",
    yearBuilt: 2015,
    images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    features: [
      "Vitrine exceptionnelle",
      "Atelier intégré",
      "Bureaux",
      "Parking",
      "Prestige",
    ],
    source: "JLL",
    featured: true,
    lat: 48.8698,
    lng: 2.3076,
    energyClass: "A",
    parking: 5,
    accessibility: true,
    tags: ["Prestige", "Automobile", "Champs-Élysées"],
    agent: {
      name: "Alexandre Dupont",
      phone: "06 78 90 12 34",
      email: "alexandre.dupont@jll.com",
      company: "JLL Luxury",
    },
  },
  {
    id: "8",
    title: "Coworking space équipé",
    description:
      "Espace de coworking de 250m² entièrement aménagé. 30 postes de travail, salles de réunion, cuisine, et espaces détente. Prêt à exploiter.",
    price: 5800,
    surface: 250,
    address: "45 Rue de la Paix",
    city: "Lyon",
    postalCode: "69002",
    propertyType: "Coworking",
    transactionType: "rent",
    yearBuilt: 2019,
    images: ["/placeholder.jpg", "/placeholder.jpg"],
    features: [
      "30 postes",
      "Salles de réunion",
      "Cuisine équipée",
      "Fibre optique",
      "Climatisation",
    ],
    source: "Nexity",
    featured: false,
    lat: 45.764,
    lng: 4.8357,
    energyClass: "B",
    elevator: true,
    accessibility: true,
    tags: ["Équipé", "Moderne", "Coworking"],
    agent: {
      name: "Céline Bernard",
      phone: "06 89 01 23 45",
      email: "celine.bernard@nexity.fr",
      company: "Nexity Lyon",
    },
  },
  {
    id: "9",
    title: "Hôtel particulier pour bureaux",
    description:
      "Magnifique hôtel particulier de 600m² aménagé en bureaux de prestige. Jardin privatif, parking, et cachet exceptionnel.",
    price: 2800000,
    surface: 600,
    address: "28 Avenue Foch",
    city: "Paris",
    postalCode: "75016",
    propertyType: "Hôtel particulier",
    transactionType: "sale",
    yearBuilt: 1900,
    images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    features: [
      "Cachet exceptionnel",
      "Jardin privatif",
      "Parking privé",
      "Prestige",
      "Rénové",
    ],
    source: "Daniel Féau",
    featured: true,
    lat: 48.8718,
    lng: 2.2885,
    energyClass: "C",
    parking: 4,
    garden: true,
    tags: ["Prestige", "Cachet", "Jardin"],
    agent: {
      name: "François Delacroix",
      phone: "06 90 12 34 56",
      email: "francois.delacroix@danielfeau.fr",
      company: "Daniel Féau Prestige",
    },
  },
  {
    id: "10",
    title: "Local médical équipé",
    description:
      "Local médical de 90m² entièrement équipé. 3 cabinets, salle d'attente, secrétariat. Normes PMR respectées. Clientèle établie.",
    price: 3500,
    surface: 90,
    address: "15 Boulevard Saint-Germain",
    city: "Paris",
    postalCode: "75005",
    propertyType: "Cabinet médical",
    transactionType: "rent",
    yearBuilt: 2012,
    images: ["/placeholder.jpg", "/placeholder.jpg"],
    features: [
      "3 cabinets",
      "Équipement médical",
      "Normes PMR",
      "Climatisation",
      "Parking",
    ],
    source: "Laforêt",
    featured: false,
    lat: 48.8499,
    lng: 2.3447,
    energyClass: "B",
    accessibility: true,
    parking: 2,
    tags: ["Médical", "Équipé", "PMR"],
    agent: {
      name: "Nathalie Laurent",
      phone: "06 01 23 45 67",
      email: "nathalie.laurent@laforet.com",
      company: "Laforêt Immobilier Pro",
    },
  },
  {
    id: "11",
    title: "Usine agroalimentaire",
    description:
      "Usine agroalimentaire de 1200m² avec laboratoire, chaîne de production, et entrepôt frigorifique. Normes HACCP respectées.",
    price: 1800000,
    surface: 1200,
    address: "Zone Industrielle Nord",
    city: "Meaux",
    postalCode: "77100",
    propertyType: "Usine",
    transactionType: "sale",
    yearBuilt: 2008,
    images: ["/placeholder.jpg", "/placeholder.jpg"],
    features: [
      "Normes HACCP",
      "Laboratoire",
      "Entrepôt frigorifique",
      "Chaîne production",
      "Bureaux",
    ],
    source: "Arthur Loyd",
    featured: true,
    lat: 48.9559,
    lng: 2.8783,
    energyClass: "C",
    parking: 15,
    tags: ["Agroalimentaire", "Production", "HACCP"],
    agent: {
      name: "Michel Garnier",
      phone: "06 12 34 56 78",
      email: "michel.garnier@arthurloyd.fr",
      company: "Arthur Loyd Industrie",
    },
  },
  {
    id: "12",
    title: "Boutique de luxe Champs-Élysées",
    description:
      "Boutique de prestige de 60m² sur les Champs-Élysées. Vitrine exceptionnelle, aménagement haut de gamme, et emplacement unique.",
    price: 8500,
    surface: 60,
    address: "120 Avenue des Champs-Élysées",
    city: "Paris",
    postalCode: "75008",
    propertyType: "Boutique",
    transactionType: "rent",
    yearBuilt: 2020,
    images: ["/placeholder.jpg", "/placeholder.jpg"],
    features: [
      "Champs-Élysées",
      "Vitrine prestige",
      "Aménagement luxe",
      "Climatisation",
      "Sécurité",
    ],
    source: "Savills",
    featured: true,
    lat: 48.8698,
    lng: 2.3076,
    energyClass: "A",
    accessibility: true,
    tags: ["Luxe", "Prestige", "Champs-Élysées"],
    agent: {
      name: "Isabelle Moreau",
      phone: "06 98 76 54 32",
      email: "isabelle.moreau@savills.fr",
      company: "Savills France",
    },
  },
];

// Fonction pour générer des données aléatoires supplémentaires
export function generateRandomProperty(id: string): PropertySeedData {
  const propertyTypes = [
    "Bureau",
    "Local commercial",
    "Entrepôt",
    "Restaurant",
    "Atelier",
    "Showroom",
  ];
  const cities = [
    "Paris",
    "Lyon",
    "Marseille",
    "Toulouse",
    "Nice",
    "Nantes",
    "Strasbourg",
    "Montpellier",
  ];
  const sources = [
    "Century 21",
    "Orpi",
    "Foncia",
    "Guy Hoquet",
    "Nexity",
    "Laforêt",
  ];
  const energyClasses = ["A", "B", "C", "D", "E", "F", "G"];

  const propertyType =
    propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const source = sources[Math.floor(Math.random() * sources.length)];
  const transactionType = Math.random() > 0.6 ? "sale" : "rent";
  const surface = Math.floor(Math.random() * 500) + 50;
  const pricePerSqm =
    transactionType === "sale"
      ? Math.floor(Math.random() * 3000) + 2000
      : Math.floor(Math.random() * 30) + 15;
  const price = surface * pricePerSqm;

  return {
    id,
    title: `${propertyType} ${surface}m² - ${city}`,
    description: `${propertyType} de ${surface}m² situé à ${city}. Bien entretenu et prêt à occuper.`,
    price,
    surface,
    address: `${Math.floor(Math.random() * 200) + 1} Rue de la ${
      ["Paix", "République", "Liberté", "Victoire"][
        Math.floor(Math.random() * 4)
      ]
    }`,
    city,
    postalCode: `${Math.floor(Math.random() * 95) + 1}${
      Math.floor(Math.random() * 900) + 100
    }`,
    propertyType,
    transactionType,
    yearBuilt: Math.floor(Math.random() * 50) + 1970,
    images: ["/placeholder.jpg"],
    features: ["Climatisation", "Parking", "Sécurité"],
    source,
    featured: Math.random() > 0.8,
    lat: 48.8566 + (Math.random() - 0.5) * 0.1,
    lng: 2.3522 + (Math.random() - 0.5) * 0.1,
    energyClass:
      energyClasses[Math.floor(Math.random() * energyClasses.length)],
    parking: Math.floor(Math.random() * 5),
    accessibility: Math.random() > 0.5,
    tags: ["Moderne", "Bien situé"],
  };
}
