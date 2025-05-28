import connectDB from "../lib/mongodb"
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
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  },
  {
    name: "Admin System",
    email: "admin@loopnet.com",
    role: "admin",
    phone: "+33 6 00 00 00 00",
    bio: "Administrateur système",
    preferences: {
      notifications: { email: true, sms: true, push: true },
      searchAlerts: true,
      newsletter: false,
    },
    isEmailVerified: true,
    subscription: {
      plan: "enterprise",
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  },
]

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed...")

    // Connexion à la base de données
    console.log("📡 Connecting to MongoDB...")
    await connectDB()
    console.log("✅ MongoDB connection established")

    // Vérifier les données existantes
    console.log("🔍 Checking existing data...")
    const existingUsers = await User.countDocuments()
    const existingProperties = await Property.countDocuments()
    const existingInquiries = await Inquiry.countDocuments()

    console.log(`📊 Current database state:`)
    console.log(`👥 Users: ${existingUsers}`)
    console.log(`🏢 Properties: ${existingProperties}`)
    console.log(`📧 Inquiries: ${existingInquiries}`)

    const results = {
      users: { created: 0, skipped: 0, existing: [] as string[] },
      properties: { created: 0, skipped: 0, existing: [] as string[] },
      inquiries: { created: 0, skipped: 0, existing: [] as string[] },
    }

    // Créer les utilisateurs (vérifier par email)
    console.log("👥 Processing users...")
    const createdUsers = []
    for (const userData of sampleUsers) {
      const existingUser = await User.findOne({ email: userData.email })
      if (existingUser) {
        console.log(`⚠️ User already exists: ${userData.email}`)
        results.users.skipped++
        results.users.existing.push(userData.email)
        createdUsers.push(existingUser)
      } else {
        const newUser = await User.create(userData)
        console.log(`✅ User created: ${newUser.email}`)
        results.users.created++
        createdUsers.push(newUser)
      }
    }

    // Créer les propriétés (vérifier par titre et ville)
    console.log("🏢 Processing properties...")
    const sampleProperties = [
      {
        title: "Bureau moderne avec terrasse",
        description: "Magnifique bureau de 120m² situé au cœur du quartier d'affaires.",
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
        features: ["Climatisation", "Terrasse", "Parking"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
            publicId: "office_1_main",
            alt: "Bureau principal",
            isPrimary: true,
          },
        ],
        contactInfo: {
          name: "Jean Dupont",
          email: "jean.dupont@email.com",
          phone: "+33 6 12 34 56 78",
        },
        owner: createdUsers[0]._id,
        ownerType: "individual",
        status: "active",
        publishedAt: new Date(),
        views: 247,
        favorites: 18,
        inquiries: 12,
        isPremium: true,
        isFeatured: true,
      },
      {
        title: "Local commercial centre-ville",
        description: "Superbe local commercial de 85m² en rez-de-chaussée.",
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
        features: ["Grande vitrine", "Centre-ville"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
            publicId: "shop_1_main",
            alt: "Local commercial",
            isPrimary: true,
          },
        ],
        contactInfo: {
          name: "Marie Martin",
          email: "marie.martin@realty.com",
          phone: "+33 6 98 76 54 32",
        },
        owner: createdUsers[1]._id,
        ownerType: "agent",
        status: "active",
        publishedAt: new Date(),
        views: 156,
        favorites: 9,
        inquiries: 7,
        isPremium: false,
        isFeatured: false,
      },
    ]

    const createdProperties = []
    for (const propertyData of sampleProperties) {
      const existingProperty = await Property.findOne({
        title: propertyData.title,
        city: propertyData.city,
      })
      if (existingProperty) {
        console.log(`⚠️ Property already exists: ${propertyData.title} in ${propertyData.city}`)
        results.properties.skipped++
        results.properties.existing.push(`${propertyData.title} (${propertyData.city})`)
        createdProperties.push(existingProperty)
      } else {
        const property = new Property(propertyData)
        await property.save()
        console.log(`✅ Property created: ${property.title} (slug: ${property.slug})`)
        results.properties.created++
        createdProperties.push(property)
      }
    }

    // Créer les demandes (vérifier par propriété et email demandeur)
    console.log("📧 Processing inquiries...")
    const sampleInquiries = [
      {
        property: createdProperties[0]._id,
        owner: createdProperties[0].owner,
        message: "Bonjour, je suis intéressé par ce bureau. Pouvez-vous organiser une visite ?",
        contactMethod: "email",
        inquirerInfo: {
          name: "Sophie Leblanc",
          email: "sophie.leblanc@startup.com",
          phone: "+33 6 11 22 33 44",
        },
        status: "new",
        visitRequested: true,
        preferredVisitDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        property: createdProperties[1]._id,
        owner: createdProperties[1].owner,
        message: "Je souhaite ouvrir une boutique. Pouvez-vous me donner plus d'informations ?",
        contactMethod: "phone",
        inquirerInfo: {
          name: "Marc Rousseau",
          email: "marc.rousseau@gmail.com",
          phone: "+33 6 77 88 99 00",
        },
        status: "read",
        visitRequested: false,
      },
    ]

    for (const inquiryData of sampleInquiries) {
      const existingInquiry = await Inquiry.findOne({
        property: inquiryData.property,
        "inquirerInfo.email": inquiryData.inquirerInfo.email,
      })
      if (existingInquiry) {
        console.log(`⚠️ Inquiry already exists: ${inquiryData.inquirerInfo.email} for property ${inquiryData.property}`)
        results.inquiries.skipped++
        results.inquiries.existing.push(`${inquiryData.inquirerInfo.name} (${inquiryData.inquirerInfo.email})`)
      } else {
        await Inquiry.create(inquiryData)
        console.log(`✅ Inquiry created: ${inquiryData.inquirerInfo.name}`)
        results.inquiries.created++
      }
    }

    // Statistiques finales
    const finalUsers = await User.countDocuments()
    const finalProperties = await Property.countDocuments()
    const finalInquiries = await Inquiry.countDocuments()

    console.log("\n📊 Seed Summary:")
    console.log(`👥 Users: ${finalUsers} total (${results.users.created} created, ${results.users.skipped} skipped)`)
    console.log(
      `🏢 Properties: ${finalProperties} total (${results.properties.created} created, ${results.properties.skipped} skipped)`,
    )
    console.log(
      `📧 Inquiries: ${finalInquiries} total (${results.inquiries.created} created, ${results.inquiries.skipped} skipped)`,
    )

    if (results.users.existing.length > 0) {
      console.log(`⚠️ Existing users skipped: ${results.users.existing.join(", ")}`)
    }
    if (results.properties.existing.length > 0) {
      console.log(`⚠️ Existing properties skipped: ${results.properties.existing.join(", ")}`)
    }
    if (results.inquiries.existing.length > 0) {
      console.log(`⚠️ Existing inquiries skipped: ${results.inquiries.existing.join(", ")}`)
    }

    console.log("\n🎉 Seed completed successfully!")

    return {
      users: createdUsers,
      properties: createdProperties,
      inquiries: results.inquiries,
      summary: results,
    }
  } catch (error) {
    console.error("❌ Error during seed:", error)
    console.error("📋 Stack trace:", error instanceof Error ? error.stack : "No stack trace")
    throw error
  }
}

// Exécuter le seed si le script est appelé directement
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("✅ Seed completed")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Error:", error)
      process.exit(1)
    })
}
