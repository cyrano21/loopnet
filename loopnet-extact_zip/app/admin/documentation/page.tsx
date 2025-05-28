"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DocumentationGenerator } from "@/lib/docs/documentation-generator"
import { Download, FileText, Shield, Rocket, Copy, Check } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function DocumentationPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSection(section)
      setTimeout(() => setCopiedSection(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const apiDoc = DocumentationGenerator.generateAPIDocumentation()
  const deploymentGuide = DocumentationGenerator.generateDeploymentGuide()
  const securityGuide = DocumentationGenerator.generateSecurityGuide()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documentation Technique</h1>
          <p className="text-muted-foreground">Guides complets pour l'utilisation et la maintenance</p>
        </div>
        <Badge variant="outline" className="text-sm">
          Version 1.0
        </Badge>
      </div>

      <Tabs defaultValue="api" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="api" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            API Documentation
          </TabsTrigger>
          <TabsTrigger value="deployment" className="flex items-center gap-2">
            <Rocket className="h-4 w-4" />
            Guide Déploiement
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Guide Sécurité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documentation API
                  </CardTitle>
                  <CardDescription>Documentation complète des endpoints API et de leur utilisation</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(apiDoc, "api")}
                    className="flex items-center gap-2"
                  >
                    {copiedSection === "api" ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copié
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copier
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadAsFile(apiDoc, "api-documentation.md")}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-mono">{apiDoc}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    Guide de Déploiement
                  </CardTitle>
                  <CardDescription>Instructions complètes pour déployer l'application en production</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(deploymentGuide, "deployment")}
                    className="flex items-center gap-2"
                  >
                    {copiedSection === "deployment" ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copié
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copier
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadAsFile(deploymentGuide, "deployment-guide.md")}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-mono">{deploymentGuide}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Guide de Sécurité
                  </CardTitle>
                  <CardDescription>Procédures de sécurité, monitoring et gestion des incidents</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(securityGuide, "security")}
                    className="flex items-center gap-2"
                  >
                    {copiedSection === "security" ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copié
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copier
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadAsFile(securityGuide, "security-guide.md")}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-mono">{securityGuide}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>Outils et raccourcis pour la maintenance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => window.open("/admin/security", "_blank")}
            >
              <Shield className="h-6 w-6" />
              <span>Dashboard Sécurité</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => {
                fetch("/api/admin/security-test", { method: "POST" })
                  .then((res) => res.json())
                  .then((data) => {
                    alert(`Tests de sécurité terminés. Score: ${data.summary?.score}%`)
                  })
                  .catch(() => alert("Erreur lors des tests"))
              }}
            >
              <FileText className="h-6 w-6" />
              <span>Tests Sécurité</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => window.open("/admin/analytics", "_blank")}
            >
              <Rocket className="h-6 w-6" />
              <span>Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
