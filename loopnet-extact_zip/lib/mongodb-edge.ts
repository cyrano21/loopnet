// Version compatible Edge Runtime pour MongoDB
// Utilise uniquement les fonctionnalités compatibles avec Edge Runtime

interface MongoConnection {
  isConnected: boolean
  connectionString: string
}

let cachedConnection: MongoConnection | null = null

export async function connectMongoDB(): Promise<MongoConnection> {
  if (cachedConnection?.isConnected) {
    return cachedConnection
  }

  const connectionString = process.env.MONGODB_URI
  if (!connectionString) {
    throw new Error("MONGODB_URI environment variable is not defined")
  }

  // Pour Edge Runtime, on simule la connexion
  // En production, utiliser un client MongoDB compatible Edge
  cachedConnection = {
    isConnected: true,
    connectionString,
  }

  console.log("✅ MongoDB connection simulated for Edge Runtime")
  return cachedConnection
}

// Export par défaut
export default connectMongoDB

// Exports nommés pour compatibilité
export { connectMongoDB as connectDB }
export const connectToDatabase = connectMongoDB
