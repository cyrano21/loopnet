import fs from "fs"
import path from "path"

interface SecurityCheck {
  name: string
  status: "pass" | "fail" | "warning"
  message: string
}

class SecurityValidator {
  static async validateProject(): Promise<SecurityCheck[]> {
    const checks: SecurityCheck[] = []

    console.log("🔒 Validation de sécurité du projet...")

    // Vérifier l'absence de variables sensibles exposées
    checks.push(await this.checkClientSideVariables())

    // Vérifier la configuration des APIs
    checks.push(await this.checkApiSecurity())

    // Vérifier les fichiers de configuration
    checks.push(await this.checkConfigFiles())

    // Vérifier les headers de sécurité
    checks.push(await this.checkSecurityHeaders())

    return checks
  }

  private static async checkClientSideVariables(): Promise<SecurityCheck> {
    try {
      const filesToCheck = ["app", "components", "lib", "hooks"]

      let foundSensitive = false

      for (const dir of filesToCheck) {
        const dirPath = path.join(process.cwd(), dir)
        if (fs.existsSync(dirPath)) {
          foundSensitive = await this.scanDirectoryForSensitiveVars(dirPath)
          if (foundSensitive) break
        }
      }

      return {
        name: "Variables côté client",
        status: foundSensitive ? "fail" : "pass",
        message: foundSensitive
          ? "Variables sensibles trouvées côté client"
          : "Aucune variable sensible exposée côté client",
      }
    } catch (error) {
      return {
        name: "Variables côté client",
        status: "fail",
        message: `Erreur lors de la vérification: ${error}`,
      }
    }
  }

  private static async scanDirectoryForSensitiveVars(dirPath: string): Promise<boolean> {
    const files = fs.readdirSync(dirPath, { withFileTypes: true })

    for (const file of files) {
      const fullPath = path.join(dirPath, file.name)

      if (file.isDirectory() && !file.name.startsWith(".")) {
        const found = await this.scanDirectoryForSensitiveVars(fullPath)
        if (found) return true
      } else if (file.isFile() && (file.name.endsWith(".ts") || file.name.endsWith(".tsx"))) {
        const content = fs.readFileSync(fullPath, "utf8")

        // Vérifier les variables d'environnement exposées sans utiliser de regex sensibles
        const lines = content.split("\n")
        for (const line of lines) {
          if (
            line.includes("process.env.") &&
            line.includes("PUBLIC") &&
            (line.includes("KEY") || line.includes("SECRET") || line.includes("TOKEN"))
          ) {
            console.log(`⚠️ Variable sensible potentielle trouvée dans ${fullPath}`)
            return true
          }
        }
      }
    }

    return false
  }

  private static async checkApiSecurity(): Promise<SecurityCheck> {
    const apiPath = path.join(process.cwd(), "app/api")

    if (!fs.existsSync(apiPath)) {
      return {
        name: "Sécurité API",
        status: "warning",
        message: "Dossier API non trouvé",
      }
    }

    // Vérifier que les APIs sensibles ont une authentification
    const sensitiveApis = ["app/api/notifications/vapid-key/route.ts", "app/api/admin", "app/api/stripe"]

    let allSecure = true

    for (const api of sensitiveApis) {
      const apiFile = path.join(process.cwd(), api)
      if (fs.existsSync(apiFile)) {
        const content = fs.readFileSync(apiFile, "utf8")
        if (!content.includes("getAuthSession") && !content.includes("auth")) {
          allSecure = false
          break
        }
      }
    }

    return {
      name: "Sécurité API",
      status: allSecure ? "pass" : "warning",
      message: allSecure ? "APIs sécurisées" : "Certaines APIs pourraient nécessiter plus de sécurité",
    }
  }

  private static async checkConfigFiles(): Promise<SecurityCheck> {
    const configFiles = ["next.config.mjs", "middleware.ts", ".env.example"]

    let allPresent = true

    for (const file of configFiles) {
      if (!fs.existsSync(path.join(process.cwd(), file))) {
        allPresent = false
        break
      }
    }

    return {
      name: "Fichiers de configuration",
      status: allPresent ? "pass" : "warning",
      message: allPresent ? "Tous les fichiers de config présents" : "Certains fichiers de config manquants",
    }
  }

  private static async checkSecurityHeaders(): Promise<SecurityCheck> {
    const middlewarePath = path.join(process.cwd(), "middleware.ts")

    if (!fs.existsSync(middlewarePath)) {
      return {
        name: "Headers de sécurité",
        status: "fail",
        message: "Middleware de sécurité manquant",
      }
    }

    const content = fs.readFileSync(middlewarePath, "utf8")
    const requiredHeaders = ["X-Frame-Options", "X-Content-Type-Options", "Content-Security-Policy"]

    const hasAllHeaders = requiredHeaders.every((header) => content.includes(header))

    return {
      name: "Headers de sécurité",
      status: hasAllHeaders ? "pass" : "warning",
      message: hasAllHeaders ? "Headers de sécurité configurés" : "Certains headers de sécurité manquants",
    }
  }

  static generateSecurityReport(checks: SecurityCheck[]): string {
    const passed = checks.filter((c) => c.status === "pass").length
    const failed = checks.filter((c) => c.status === "fail").length
    const warnings = checks.filter((c) => c.status === "warning").length

    let report = `🔒 RAPPORT DE SÉCURITÉ\n`
    report += `═══════════════════════\n\n`

    report += `📊 Résumé:\n`
    report += `✅ Réussis: ${passed}\n`
    report += `⚠️  Avertissements: ${warnings}\n`
    report += `❌ Échecs: ${failed}\n\n`

    report += `📋 Détails:\n`
    checks.forEach((check) => {
      const icon = check.status === "pass" ? "✅" : check.status === "warning" ? "⚠️" : "❌"
      report += `${icon} ${check.name}: ${check.message}\n`
    })

    const overallStatus = failed === 0 ? (warnings === 0 ? "EXCELLENT" : "BON") : "À AMÉLIORER"
    report += `\n🎯 Statut global: ${overallStatus}\n`

    return report
  }
}

// Exécution du script
async function runValidation() {
  console.log("🔒 Démarrage de la validation de sécurité...")

  const checks = await SecurityValidator.validateProject()
  const report = SecurityValidator.generateSecurityReport(checks)

  console.log(report)

  // Sauvegarder le rapport
  fs.writeFileSync("security-report.txt", report)
  console.log("📄 Rapport sauvegardé dans security-report.txt")

  // Code de sortie basé sur les résultats
  const failed = checks.filter((c) => c.status === "fail").length
  process.exit(failed > 0 ? 1 : 0)
}

if (require.main === module) {
  runValidation()
}

export { SecurityValidator }
