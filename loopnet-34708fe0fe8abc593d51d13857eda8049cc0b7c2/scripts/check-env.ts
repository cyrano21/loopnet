// Script pour vérifier que toutes les variables sont configurées
const requiredEnvVars = [
  "MONGODB_URI",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "HUGGINGFACE_API_KEY",
]

console.log("🔍 Vérification des variables d'environnement...\n")

let allConfigured = true

requiredEnvVars.forEach((envVar) => {
  const value = process.env[envVar]
  const status = value ? "✅" : "❌"
  const display = value ? "CONFIGURÉ" : "MANQUANT"

  console.log(`${status} ${envVar}: ${display}`)

  if (!value) {
    allConfigured = false
  }
})

console.log("\n" + "=".repeat(50))

if (allConfigured) {
  console.log("🎉 TOUTES LES VARIABLES SONT CONFIGURÉES !")
  console.log("🚀 L'application est prête à être utilisée !")
} else {
  console.log("⚠️  Certaines variables manquent")
}

export {}
