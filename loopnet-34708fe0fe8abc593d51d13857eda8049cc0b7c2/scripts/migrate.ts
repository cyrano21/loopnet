import mongoose from "mongoose"
import connectDB from "../lib/mongodb"
import Property from "../models/Property"
import User from "../models/User"
import Inquiry from "../models/Inquiry"

interface MigrationScript {
  version: string
  description: string
  up: () => Promise<void>
  down: () => Promise<void>
}

const migrations: MigrationScript[] = [
  {
    version: "001",
    description: "Initial schema setup",
    up: async () => {
      console.log("Creating indexes...")

      // Property indexes
      await Property.collection.createIndex({ city: 1, propertyType: 1, transactionType: 1 })
      await Property.collection.createIndex({ price: 1 })
      await Property.collection.createIndex({ status: 1, publishedAt: -1 })
      await Property.collection.createIndex({ owner: 1 })
      await Property.collection.createIndex({ slug: 1 }, { unique: true })
      await Property.collection.createIndex({ coordinates: "2dsphere" })

      // User indexes
      await User.collection.createIndex({ email: 1 }, { unique: true })
      await User.collection.createIndex({ role: 1 })

      // Inquiry indexes
      await Inquiry.collection.createIndex({ property: 1, createdAt: -1 })
      await Inquiry.collection.createIndex({ owner: 1, status: 1 })

      console.log("Indexes created successfully")
    },
    down: async () => {
      console.log("Dropping indexes...")
      await Property.collection.dropIndexes()
      await User.collection.dropIndexes()
      await Inquiry.collection.dropIndexes()
      console.log("Indexes dropped")
    },
  },
  {
    version: "002",
    description: "Add sample data",
    up: async () => {
      console.log("Adding sample data...")

      // Create sample admin user
      const adminUser = new User({
        email: "admin@loopnet.com",
        name: "Admin User",
        role: "admin",
        isEmailVerified: true,
        preferences: {
          notifications: { email: true, sms: false, push: true },
          searchAlerts: true,
          newsletter: false,
        },
      })
      await adminUser.save()

      // Create sample agent
      const agentUser = new User({
        email: "agent@loopnet.com",
        name: "John Smith",
        role: "agent",
        company: "Premier Real Estate",
        license: "RE123456",
        isEmailVerified: true,
        preferences: {
          notifications: { email: true, sms: true, push: true },
          searchAlerts: true,
          newsletter: true,
        },
      })
      await agentUser.save()

      // Create sample properties
      const sampleProperties = [
        {
          title: "Modern Office Building - Financial District",
          description:
            "Exceptional opportunity to own a premier office building in the prestigious Financial District. This modern building features state-of-the-art amenities, flexible floor plans, and stunning city views.",
          propertyType: "office",
          transactionType: "sale",
          address: "123 Business District",
          city: "San Francisco",
          postalCode: "94105",
          country: "USA",
          price: 2500000,
          surface: 1500,
          rooms: 10,
          yearBuilt: 2018,
          features: ["Modern HVAC system", "High-speed fiber internet", "24/7 security", "Elevator access"],
          images: [],
          owner: agentUser._id,
          ownerType: "agent",
          contactInfo: {
            name: "John Smith",
            email: "agent@loopnet.com",
            phone: "+1-555-123-4567",
          },
          status: "active",
          publishedAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isPremium: false,
          isFeatured: true,
        },
        {
          title: "Retail Space in Shopping Center",
          description:
            "Prime retail location in busy shopping center with high foot traffic. Perfect for restaurants, boutiques, or service businesses.",
          propertyType: "retail",
          transactionType: "rent",
          address: "456 Shopping Center",
          city: "Los Angeles",
          postalCode: "90210",
          country: "USA",
          price: 1800,
          surface: 850,
          rooms: 3,
          yearBuilt: 2020,
          features: ["High foot traffic", "Parking available", "Modern fixtures"],
          images: [],
          owner: agentUser._id,
          ownerType: "agent",
          contactInfo: {
            name: "John Smith",
            email: "agent@loopnet.com",
            phone: "+1-555-123-4567",
          },
          status: "active",
          publishedAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isPremium: false,
          isFeatured: false,
        },
      ]

      for (const propertyData of sampleProperties) {
        const property = new Property(propertyData)
        await property.save()
      }

      console.log("Sample data added successfully")
    },
    down: async () => {
      console.log("Removing sample data...")
      await Property.deleteMany({})
      await User.deleteMany({})
      await Inquiry.deleteMany({})
      console.log("Sample data removed")
    },
  },
]

export async function runMigrations() {
  try {
    await connectDB()
    console.log("Connected to MongoDB")

    // Create migrations collection if it doesn't exist
    const db = mongoose.connection.db
    const migrationsCollection = db.collection("migrations")

    // Get completed migrations
    const completedMigrations = await migrationsCollection.find({}).toArray()
    const completedVersions = completedMigrations.map((m) => m.version)

    // Run pending migrations
    for (const migration of migrations) {
      if (!completedVersions.includes(migration.version)) {
        console.log(`Running migration ${migration.version}: ${migration.description}`)

        try {
          await migration.up()

          // Mark as completed
          await migrationsCollection.insertOne({
            version: migration.version,
            description: migration.description,
            completedAt: new Date(),
          })

          console.log(`Migration ${migration.version} completed successfully`)
        } catch (error) {
          console.error(`Migration ${migration.version} failed:`, error)
          throw error
        }
      } else {
        console.log(`Migration ${migration.version} already completed`)
      }
    }

    console.log("All migrations completed")
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

export async function rollbackMigration(version: string) {
  try {
    await connectDB()

    const migration = migrations.find((m) => m.version === version)
    if (!migration) {
      throw new Error(`Migration ${version} not found`)
    }

    console.log(`Rolling back migration ${version}: ${migration.description}`)
    await migration.down()

    // Remove from completed migrations
    const db = mongoose.connection.db
    await db.collection("migrations").deleteOne({ version })

    console.log(`Migration ${version} rolled back successfully`)
  } catch (error) {
    console.error("Rollback failed:", error)
    process.exit(1)
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2]
  const version = process.argv[3]

  if (command === "up") {
    runMigrations()
  } else if (command === "down" && version) {
    rollbackMigration(version)
  } else {
    console.log("Usage:")
    console.log("  npm run migrate up     - Run all pending migrations")
    console.log("  npm run migrate down <version> - Rollback specific migration")
  }
}
