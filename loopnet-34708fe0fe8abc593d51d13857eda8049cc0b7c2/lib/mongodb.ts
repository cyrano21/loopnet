import mongoose from "mongoose"
import initializeModels from "./init-models"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env")
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var _mongoose: MongooseCache | undefined
}

const cached: MongooseCache = global._mongoose || { conn: null, promise: null }

if (!global._mongoose) {
  global._mongoose = cached
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    console.log("🔌 Connexion à MongoDB...")

    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB connecté")

        // Initialiser tous les modèles après la connexion
        initializeModels()

        return mongoose
      })
      .catch((error) => {
        console.error("❌ Erreur de connexion MongoDB:", error)
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

// Export par défaut
export default connectDB

// Exports nommés requis
export { connectDB }
export const connectToDatabase = connectDB

// Export pour compatibilité
export { connectDB as connectMongoDB }
