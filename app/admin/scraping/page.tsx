"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, RefreshCw, Database, AlertTriangle, CheckCircle, Clock, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ScrapingAdminPage() {
  const [isScrapingActive, setIsScrapingActive] = useState(false)
  const [scrapingProgress, setScrapingProgress] = useState(0)
  const [stats, setStats] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/scraping/properties")
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Erreur récupération stats:", error)
    }
  }

  const startScraping = async () => {
    setIsScrapingActive(true)
    setScrapingProgress(0)
    setLogs(["🚀 Début du scraping..."])

    try {
      // Simulation du progrès
      const progressInterval = setInterval(() => {
        setScrapingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 1000)

      const response = await fetch("/api/scraping/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sources: ["government", "apis", "rss"],
          filters: {},
        }),
      })

      const result = await response.json()

      clearInterval(progressInterval)
      setScrapingProgress(100)

      if (result.success) {
        setLogs((prev) => [
          ...prev,
          `✅ Scraping terminé: ${result.saved} propriétés ajoutées`,
          `📊 Total scrapé: ${result.scraped} propriétés`,
        ])
        toast({
          title: "Scraping réussi",
          description: `${result.saved} nouvelles propriétés ajoutées`,
        })
        fetchStats()
      } else {
        setLogs((prev) => [...prev, `❌ Erreur: ${result.error}`])
        toast({
          title: "Erreur de scraping",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      setLogs((prev) => [...prev, `❌ Erreur réseau: ${error}`])
      toast({
        title: "Erreur",
        description: "Erreur lors du scraping",
        variant: "destructive",
      })
    } finally {
      setIsScrapingActive(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Administration Scraping</h1>
          <p className="text-gray-600">Gestion du scraping automatique de propriétés</p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <Globe className="h-4 w-4 mr-1" />
          Sources Légales Uniquement
        </Badge>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Scrapé</p>
                <p className="text-2xl font-bold">{stats?.totalScraped || 0}</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dernier Scraping</p>
                <p className="text-sm font-medium">
                  {stats?.lastScrapedAt ? new Date(stats.lastScrapedAt).toLocaleDateString() : "Jamais"}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sources Actives</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Globe className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Statut</p>
                <p className="text-sm font-medium">{isScrapingActive ? "En cours" : "Inactif"}</p>
              </div>
              {isScrapingActive ? (
                <RefreshCw className="h-8 w-8 text-orange-600 animate-spin" />
              ) : (
                <CheckCircle className="h-8 w-8 text-green-600" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contrôles de scraping */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Contrôle du Scraping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isScrapingActive && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progression</span>
                  <span>{scrapingProgress}%</span>
                </div>
                <Progress value={scrapingProgress} />
              </div>
            )}

            <div className="flex gap-4">
              <Button onClick={startScraping} disabled={isScrapingActive} className="flex-1">
                {isScrapingActive ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {isScrapingActive ? "Scraping en cours..." : "Démarrer Scraping"}
              </Button>

              <Button variant="outline" onClick={fetchStats}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>

            {/* Sources configurées */}
            <div>
              <h4 className="font-semibold mb-3">Sources Configurées</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Données Gouvernementales (DVF)</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Légal</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">APIs Publiques</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Légal</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Flux RSS Autorisés</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Légal</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logs de Scraping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    [{new Date().toLocaleTimeString()}] {log}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">Aucun log disponible</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Avertissement légal */}
      <Card className="mt-8 border-yellow-200 bg-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Avertissement Légal</h4>
              <p className="text-sm text-yellow-700">
                Ce système de scraping utilise uniquement des sources de données publiques et légales :
              </p>
              <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                <li>• Données gouvernementales ouvertes (data.gouv.fr)</li>
                <li>• APIs publiques avec autorisation</li>
                <li>• Flux RSS explicitement autorisés</li>
                <li>• Respect des robots.txt et conditions d'utilisation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
