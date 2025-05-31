// Script pour peupler la base de données avec des professionnels de test
const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

// Schéma Professional (simplifié pour le script)
const professionalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  company: String,
  specialization: String,
  experience: Number,
  description: String,
  location: {
    city: String,
    state: String,
    country: String
  },
  avatar: String,
  website: String,
  socialLinks: {
    linkedin: String,
    twitter: String
  },
  certifications: [String],
  languages: [String],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const Professional = mongoose.model('Professional', professionalSchema)

const sampleProfessionals = [
  {
    name: "Marie Dubois",
    email: "marie.dubois@example.com",
    phone: "+33 1 42 86 75 30",
    company: "Dubois Immobilier Commercial",
    specialization: "Bureaux et commerces",
    experience: 8,
    description: "Spécialiste en immobilier commercial avec plus de 8 ans d'expérience dans le secteur des bureaux et locaux commerciaux à Paris.",
    location: {
      city: "Paris",
      state: "Île-de-France",
      country: "France"
    },
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b734?w=400&h=400&fit=crop&crop=face",
    website: "https://dubois-immobilier.fr",
    socialLinks: {
      linkedin: "https://linkedin.com/in/marie-dubois",
      twitter: "https://twitter.com/marie_dubois"
    },
    certifications: ["FNAIM", "CEPI"],
    languages: ["Français", "Anglais", "Espagnol"],
    rating: 4.8,
    reviewCount: 24,
    isVerified: true,
    isActive: true
  },
  {
    name: "Jean-Pierre Martin",
    email: "jp.martin@example.com",
    phone: "+33 1 45 67 89 12",
    company: "Martin & Associés",
    specialization: "Entrepôts et logistique",
    experience: 12,
    description: "Expert en immobilier logistique et industriel, spécialisé dans les entrepôts et plateformes de distribution en région parisienne.",
    location: {
      city: "Lyon",
      state: "Auvergne-Rhône-Alpes",
      country: "France"
    },
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    website: "https://martin-associes.com",
    socialLinks: {
      linkedin: "https://linkedin.com/in/jean-pierre-martin"
    },
    certifications: ["FNAIM", "RICS"],
    languages: ["Français", "Anglais"],
    rating: 4.6,
    reviewCount: 18,
    isVerified: true,
    isActive: true
  },
  {
    name: "Sophie Laurent",
    email: "sophie.laurent@example.com",
    phone: "+33 4 91 23 45 67",
    company: "Laurent Conseil Immobilier",
    specialization: "Hôtellerie et restauration",
    experience: 6,
    description: "Consultante spécialisée dans l'immobilier hôtelier et de restauration, accompagne les investisseurs dans leurs projets.",
    location: {
      city: "Marseille",
      state: "Provence-Alpes-Côte d'Azur",
      country: "France"
    },
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    website: "https://laurent-conseil.fr",
    socialLinks: {
      linkedin: "https://linkedin.com/in/sophie-laurent",
      twitter: "https://twitter.com/sophie_laurent"
    },
    certifications: ["FNAIM"],
    languages: ["Français", "Anglais", "Italien"],
    rating: 4.9,
    reviewCount: 31,
    isVerified: true,
    isActive: true
  },
  {
    name: "Thomas Rousseau",
    email: "thomas.rousseau@example.com",
    phone: "+33 2 40 12 34 56",
    company: "Rousseau Immobilier d'Entreprise",
    specialization: "Bureaux et sièges sociaux",
    experience: 10,
    description: "Spécialiste des transactions de bureaux haut de gamme et sièges sociaux pour grandes entreprises.",
    location: {
      city: "Nantes",
      state: "Pays de la Loire",
      country: "France"
    },
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    website: "https://rousseau-immobilier.com",
    socialLinks: {
      linkedin: "https://linkedin.com/in/thomas-rousseau"
    },
    certifications: ["FNAIM", "CEPI", "RICS"],
    languages: ["Français", "Anglais", "Allemand"],
    rating: 4.7,
    reviewCount: 22,
    isVerified: true,
    isActive: true
  }
]

async function seedProfessionals() {
  try {
    console.log('Connexion à MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connecté à MongoDB')

    // Supprimer les professionnels existants (optionnel)
    console.log('Suppression des professionnels existants...')
    await Professional.deleteMany({})

    // Ajouter les nouveaux professionnels
    console.log('Ajout des professionnels de test...')
    const createdProfessionals = await Professional.insertMany(sampleProfessionals)
    
    console.log(`${createdProfessionals.length} professionnels créés avec succès:`)
    createdProfessionals.forEach(prof => {
      console.log(`- ${prof.name} (ID: ${prof._id})`)
    })

    console.log('\nVous pouvez maintenant accéder aux pages:')
    createdProfessionals.forEach(prof => {
      console.log(`- http://localhost:3008/agents/${prof._id}`)
    })

  } catch (error) {
    console.error('Erreur lors du seeding:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Déconnecté de MongoDB')
  }
}

seedProfessionals()
