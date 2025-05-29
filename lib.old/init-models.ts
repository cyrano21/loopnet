import mongoose from "mongoose"

// Import de tous les modèles pour les enregistrer
import "../models/User"
import "../models/Property"
import "../models/News"
import "../models/Professional"
import "../models/Inquiry"
import "../models/Advertisement"
import "../models/ActivityLog"

export default function initializeModels() {
  try {
    console.log("📋 Initialisation des modèles Mongoose...")

    // Vérifier que les modèles sont bien enregistrés
    const models = mongoose.modelNames()
    console.log("✅ Modèles enregistrés:", models)

    return models
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation des modèles:", error)
    throw error
  }
}

// Export nommé pour compatibilité
export { initializeModels }
