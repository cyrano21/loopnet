import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

async function connectDB() {
  console.log("MongoDB: Attempting to connect to database...")
  
  if (cached.conn) {
    console.log("MongoDB: Using cached connection")
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Timeout après 10 secondes
      socketTimeoutMS: 45000, // Timeout après 45 secondes
      family: 4 // Forcer IPv4
    }

    console.log("MongoDB: Creating new connection with URI:", 
      MONGODB_URI?.substring(0, 20) + "..." // Ne pas afficher l'URI complet pour des raisons de sécurité
    )
    
    cached.promise = mongoose.connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        console.log("MongoDB: Connection successful")
        return mongoose
      })
      .catch((error) => {
        console.error("MongoDB: Connection failed:", error.message)
        console.error("MongoDB: Connection error details:", {
          name: error.name,
          code: error.code,
          codeName: error.codeName,
          errorLabels: error.errorLabels,
        })
        throw error
      })
  }

  try {
    console.log("MongoDB: Waiting for connection promise to resolve...")
    cached.conn = await cached.promise
    console.log("MongoDB: Connection promise resolved successfully")
  } catch (e: any) {
    console.error("MongoDB: Error resolving connection promise:", e.message)
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB

// Ajouter ces exports à la fin du fichier
export { connectDB }
export const connectToDatabase = connectDB
