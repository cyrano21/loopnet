import fs from "fs"
import path from "path"

interface DeploymentCheck {
  name: string
  status: boolean
  message: string
}

class DeploymentValidator {
  static async validateForDeployment(): Promise<DeploymentCheck[]> {
    const checks: DeploymentCheck[] = []

    console.log("🚀 Validation pour le déploiement...")

    // Vérifier les fichiers essentiels
    checks.push(await this.checkEssentialFiles())

    // Vérifier la configuration Next.js
    checks.push(await this.checkNextConfig())

    // Vérifier le middleware
    checks.push(await this.checkMiddleware())

    // Vérifier les variables d'environnement
    checks.push(await this.checkEnvironmentSetup())

    return checks
  }

  private static async checkEssentialFiles(): Promise<DeploymentCheck> {
    const essentialFiles = ["package.json", "next.config.mjs", "middleware.ts", "app/layout.tsx", "app/page.tsx"]

    const missingFiles = essentialFiles.filter((file) => !fs.existsSync(path.join(process.cwd(), file)))

    return {
      name: "Fichiers essentiels",
      status: missingFiles.length === 0,
      message:
        missingFiles.length === 0
          ? "Tous les fichiers essentiels présents"
          : `Fichiers manquants: ${missingFiles.join(", ")}`,
    }
  }

  private static async checkNextConfig(): Promise<DeploymentCheck> {
    const configPath = path.join(process.cwd(), "next.config.mjs")

    if (!fs.existsSync(configPath)) {
      return {
        name: "Configuration Next.js",
        status: false,
        message: "next.config.mjs manquant",
      }
    }

    const content = fs.readFileSync(configPath, "utf8")
    const hasImageConfig = content.includes("images")
    const hasSecurityHeaders = content.includes("headers")

    return {
      name: "Configuration Next.js",
      status: hasImageConfig && hasSecurityHeaders,
      message: hasImageConfig && hasSecurityHeaders ? "Configuration complète" : "Configuration incomplète",
    }
  }

  private static async checkMiddleware(): Promise<DeploymentCheck> {
    const middlewarePath = path.join(process.cwd(), "middleware.ts")

    if (!fs.existsSync(middlewarePath)) {
      return {
        name: "Middleware",
        status: false,
        message: "middleware.ts manquant",
      }
    }

    const content = fs.readFileSync(middlewarePath, "utf8")
    const hasRateLimit = content.includes("rateLimit")
    const hasSecurityHeaders = content.includes("X-Frame-Options")

    return {
      name: "Middleware",
      status: hasRateLimit && hasSecurityHeaders,
      message: hasRateLimit && hasSecurityHeaders ? "Middleware sécurisé configuré" : "Middleware incomplet",
    }
  }

  private static async checkEnvironmentSetup(): Promise<DeploymentCheck> {
    const requiredEnvVars = ["MONGODB_URI", "NEXTAUTH_SECRET", "VAPID_PUBLIC_KEY", "VAPID_PRIVATE_KEY"]

    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

    return {
      name: "Variables d'environnement",
      status: missingVars.length === 0,
      message:
        missingVars.length === 0
          ? "Toutes les variables requises configurées"
          : `Variables manquantes: ${missingVars.join(", ")}`,
    }
  }

  static generateDeploymentReport(checks: DeploymentCheck[]): string {
    const passed = checks.filter((c) => c.status).length
    const failed = checks.filter((c) => !c.status).length

    let report = `🚀 RAPPORT DE DÉPLOIEMENT\n`
    report += `═══════════════════════════\n\n`

    report += `📊 Résumé:\n`
    report += `✅ Réussis: ${passed}/${checks.length}\n`
    report += `❌ Échecs: ${failed}/${checks.length}\n\n`

    report += `📋 Détails:\n`
    checks.forEach((check) => {
      const icon = check.status ? "✅" : "❌"
      report += `${icon} ${check.name}: ${check.message}\n`
    })

    const readyToDeploy = failed === 0
    report += `\n🎯 Statut: ${readyToDeploy ? "PRÊT POUR LE DÉPLOIEMENT" : "CORRECTIONS NÉCESSAIRES"}\n`

    return report
  }
}

// Exécution du script
async function runDeploymentCheck() {
  console.log("🚀 Vérification de préparation au déploiement...")

  const checks = await DeploymentValidator.validateForDeployment()
  const report = DeploymentValidator.generateDeploymentReport(checks)

  console.log(report)

  // Sauvegarder le rapport
  fs.writeFileSync("deployment-report.txt", report)
  console.log("📄 Rapport sauvegardé dans deployment-report.txt")

  // Code de sortie basé sur les résultats
  const failed = checks.filter((c) => !c.status).length
  process.exit(failed > 0 ? 1 : 0)
}

if (require.main === module) {
  runDeploymentCheck()
}

export { DeploymentValidator }
