import mongoose from "mongoose"
import User from "../models/User"
import Property from "../models/Property"
import Inquiry from "../models/Inquiry"

const MONGODB_URI = process.env.MONGODB_URI

async function seedDatabase() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined for seeding")
  }

  try {
    console.log("🌱 Starting database seed...")
    console.log("📡 Connecting to MongoDB (Mongoose for seed)...")
    
    // Utiliser mongoose.connect directement pour le seed
    await mongoose.connect(MONGODB_URI)
    console.log("✅ MongoDB (Mongoose for seed) connection established")

    // Variables pour stocker les entités créées
    let createdUsers: any[] = []
    let createdProperties: any[] = []

    // Vérifier les données existantes
    const existingUsers = await User.countDocuments()
    console.log(`📊 Existing users: ${existingUsers}`)

    // Créer les utilisateurs
    if (existingUsers === 0) {
      console.log("👥 Creating sample users...")
      
      createdUsers = await User.create([
        {
          name: "John Doe",
          email: "john@example.com",
          role: "user",
          isTestMode: false
        },
        {
          name: "Jane Smith", 
          email: "jane@example.com",
          role: "agent",
          isTestMode: false
        },
        {
          name: "Admin User",
          email: "admin@example.com", 
          role: "admin",
          isTestMode: false
        }
      ])
      
      console.log(`✅ Created ${createdUsers.length} users`)
    } else {
      // Récupérer les utilisateurs existants pour les propriétés
      createdUsers = await User.find().limit(3).exec()
    }

    // Créer les propriétés
    const existingProperties = await Property.countDocuments()
    console.log(`🏢 Existing properties: ${existingProperties}`)
    
    if (existingProperties === 0) {
      console.log("🏢 Creating sample properties...")
      
      createdProperties = await Property.create([
        {
          title: "Bureau moderne au centre-ville",
          description: "Magnifique bureau situé au cœur du quartier d'affaires",
          price: 250000,
          location: {
            address: "123 Rue de la Paix",
            city: "Paris",
            state: "Île-de-France"
          },
          propertyType: "office",
          surface: 150,
          images: ["/images/properties/office-building.jpg"],
          userId: createdUsers[0]._id,
          contactInfo: {
            name: createdUsers[0].name,
            email: createdUsers[0].email,
            phone: "+33 1 23 45 67 89"
          }
        },
        {
          title: "Appartement avec terrasse",
          description: "Superbe appartement avec terrasse privée",
          price: 180000,
          location: {
            address: "45 Avenue Charles de Gaulle",
            city: "Neuilly-sur-Seine", 
            state: "Île-de-France"
          },
          propertyType: "apartment",
          surface: 85,
          bedrooms: 3,
          bathrooms: 2,
          images: ["/images/properties/apartment.jpg"],
          userId: createdUsers[1]._id,
          contactInfo: {
            name: createdUsers[1].name,
            email: createdUsers[1].email,
            phone: "+33 1 98 76 54 32"
          }
        }
      ])
      
      console.log(`✅ Created ${createdProperties.length} properties`)
    } else {
      // Récupérer les propriétés existantes pour les demandes
      createdProperties = await Property.find().limit(2).exec()
    }

    // Créer les demandes
    const existingInquiries = await Inquiry.countDocuments()
    console.log(`📧 Existing inquiries: ${existingInquiries}`)
    
    if (existingInquiries === 0) {
      console.log("📧 Creating sample inquiries...")
      
      await Inquiry.create([
        {
          property: createdProperties[0]._id,
          user: createdUsers[2]._id,
          inquirerInfo: {
            name: "Alice Johnson",
            email: "alice@example.com",
            phone: "+33 1 11 22 33 44"
          },
          message: "Je suis intéressé par cette propriété. Pouvez-vous organiser une visite ?",
          visitRequested: true
        },
        {
          property: createdProperties[1]._id,
          user: createdUsers[0]._id,
          inquirerInfo: {
            name: "Bob Wilson",
            email: "bob@example.com", 
            phone: "+33 1 55 66 77 88"
          },
          message: "Je souhaite plus d'informations sur ce bien.",
          visitRequested: false
        }
      ])
      
      console.log("✅ Inquiries created successfully")
    }

    // Statistiques finales
    const finalStats = {
      users: await User.countDocuments(),
      properties: await Property.countDocuments(),
      inquiries: await Inquiry.countDocuments()
    }
    
    console.log("📊 Final Statistics:", finalStats)
    console.log("🎉 Database seeding completed successfully!")

  } catch (error) {
    console.error("❌ Seed script failed:", error)
    throw error
  } finally {
    await mongoose.disconnect()
    console.log("🔌 MongoDB (Mongoose for seed) connection closed")
  }
}

// Exécuter le script s'il est appelé directement
if (require.main === module) {
  seedDatabase().catch((err) => {
    console.error("Seed script failed:", err)
    process.exit(1)
  })
}

export default seedDatabase
