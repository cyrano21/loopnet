import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { SecurityTester } from "@/lib/security/security-tests"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    console.log("🔍 Lancement des tests de sécurité...")

    // Exécuter tous les tests de sécurité
    const results = await SecurityTester.runAllTests()

    // Générer le rapport
    const report = SecurityTester.generateSecurityReport(results)

    console.log("📊 Tests de sécurité terminés")
    console.log(report)

    return NextResponse.json({
      success: true,
      results,
      report,
      summary: {
        total: results.length,
        passed: results.filter((r) => r.passed).length,
        failed: results.filter((r) => !r.passed).length,
        score: Math.round((results.filter((r) => r.passed).length / results.length) * 100),
      },
    })
  } catch (error) {
    console.error("Security test error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
