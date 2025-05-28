"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, Activity, Ban } from "lucide-react"

// Force dynamic rendering to avoid prerendering issues with useSearchParams
export const dynamic = "force-dynamic"
export const revalidate = 0

interface SecurityEvent {
  type: string
  ip: string
  userAgent: string
  timestamp: string
  details: Record<string, any>
  severity: "low" | "medium" | "high" | "critical"
}

interface SecurityStats {
  total: number
  last24h: number
  lastHour: number
  byType: Record<string, number>
  bySeverity: Record<string, number>
  topIPs: Array<{ ip: string; count: number }>
}

export default function SecurityMonitoringPage() {
  const [stats, setStats] = useState<SecurityStats | null>(null)
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSecurityData()
    const interval = setInterval(fetchSecurityData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const fetchSecurityData = async () => {
    try {
      const [statsRes, eventsRes] = await Promise.all([
        fetch("/api/admin/security?action=stats"),
        fetch("/api/admin/security?action=events&limit=20"),
      ])

      if (statsRes.ok && eventsRes.ok) {
        const statsData = await statsRes.json()
        const eventsData = await eventsRes.json()
        setStats(statsData)
        setEvents(eventsData)
      }
    } catch (error) {
      console.error("Failed to fetch security data:", error)
    } finally {
      setLoading(false)
    }
  }

  const blockIP = async (ip: string) => {
    try {
      const response = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "block_ip", ip }),
      })

      if (response.ok) {
        alert(`IP ${ip} bloquée avec succès`)
        fetchSecurityData()
      }
    } catch (error) {
      console.error("Failed to block IP:", error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Monitoring de Sécurité</h1>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Événements</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dernières 24h</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.last24h}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dernière Heure</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lastHour}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Événements Critiques</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.bySeverity.critical || 0}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top IPs suspectes */}
      {stats && stats.topIPs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>IPs les Plus Actives</CardTitle>
            <CardDescription>IPs avec le plus d'événements de sécurité</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topIPs.slice(0, 5).map(({ ip, count }) => (
                <div key={ip} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-mono">{ip}</span>
                    <span className="ml-2 text-sm text-gray-500">({count} événements)</span>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => blockIP(ip)}>
                    <Ban className="h-4 w-4 mr-1" />
                    Bloquer
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Événements récents */}
      <Card>
        <CardHeader>
          <CardTitle>Événements Récents</CardTitle>
          <CardDescription>Les 20 derniers événements de sécurité</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.map((event, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(event.severity)}>{event.severity}</Badge>
                    <span className="font-medium">{event.type}</span>
                  </div>
                  <span className="text-sm text-gray-500">{new Date(event.timestamp).toLocaleString("fr-FR")}</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>
                    <strong>IP:</strong> <span className="font-mono">{event.ip}</span>
                  </div>
                  <div>
                    <strong>User-Agent:</strong> <span className="text-gray-600">{event.userAgent}</span>
                  </div>
                  {Object.keys(event.details).length > 0 && (
                    <div>
                      <strong>Détails:</strong>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                        {JSON.stringify(event.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {events.length === 0 && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>Aucun événement de sécurité récent détecté. Votre système est sécurisé !</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
