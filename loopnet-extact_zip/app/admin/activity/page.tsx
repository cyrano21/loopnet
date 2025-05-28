"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Activity, Users, Search, Calendar, User, Crown, Star, Eye, RefreshCw } from "lucide-react"

// Configuration pour désactiver le prerendering
export const dynamic = "force-dynamic"
export const revalidate = 0

interface ActivityLog {
  _id: string
  userId: string
  userEmail: string
  userName: string
  userRole: string
  action: string
  description: string
  details: any
  timestamp: string
}

const roleColors = {
  guest: "bg-gray-500",
  simple: "bg-blue-500",
  premium: "bg-purple-500",
  agent: "bg-green-500",
  admin: "bg-red-500",
}

const roleIcons = {
  guest: Eye,
  simple: User,
  premium: Star,
  agent: Users,
  admin: Crown,
}

export default function ActivityMonitoring() {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [actionFilter, setActionFilter] = useState("all")
  const [page, setPage] = useState(1)
  const { toast } = useToast()

  useEffect(() => {
    fetchActivities()
  }, [page, roleFilter, actionFilter])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
      })

      if (roleFilter !== "all") params.append("userRole", roleFilter)
      if (actionFilter !== "all") params.append("action", actionFilter)

      const response = await fetch(`/api/admin/activity-log?${params}`)
      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les activités",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredActivities = activities.filter(
    (activity) =>
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.userEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getActionColor = (action: string) => {
    switch (action) {
      case "login":
        return "bg-green-100 text-green-800"
      case "logout":
        return "bg-gray-100 text-gray-800"
      case "create":
        return "bg-blue-100 text-blue-800"
      case "update":
        return "bg-yellow-100 text-yellow-800"
      case "delete":
        return "bg-red-100 text-red-800"
      case "view":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📊 Monitoring des Activités</h1>
        <Button onClick={fetchActivities} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{activities.length}</div>
            <div className="text-sm text-muted-foreground">Activités Récentes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{new Set(activities.map((a) => a.userId)).size}</div>
            <div className="text-sm text-muted-foreground">Utilisateurs Actifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">
              {activities.filter((a) => new Date(a.timestamp).toDateString() === new Date().toDateString()).length}
            </div>
            <div className="text-sm text-muted-foreground">Aujourd'hui</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Crown className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">{activities.filter((a) => a.userRole === "admin").length}</div>
            <div className="text-sm text-muted-foreground">Actions Admin</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par utilisateur, email ou description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="agent">Agent</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="simple">Simple</SelectItem>
            <SelectItem value="guest">Invité</SelectItem>
          </SelectContent>
        </Select>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les actions</SelectItem>
            <SelectItem value="login">Connexions</SelectItem>
            <SelectItem value="create">Créations</SelectItem>
            <SelectItem value="update">Modifications</SelectItem>
            <SelectItem value="delete">Suppressions</SelectItem>
            <SelectItem value="view">Consultations</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Liste des activités */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center p-8">Chargement des activités...</div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">Aucune activité trouvée</div>
        ) : (
          filteredActivities.map((activity) => {
            const RoleIcon = roleIcons[activity.userRole as keyof typeof roleIcons]
            return (
              <Card key={activity._id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <RoleIcon className="h-4 w-4" />
                        <span className="font-medium">{activity.userName}</span>
                        <Badge
                          className={`${roleColors[activity.userRole as keyof typeof roleColors]} text-white text-xs`}
                        >
                          {activity.userRole.toUpperCase()}
                        </Badge>
                      </div>
                      <Badge className={getActionColor(activity.action)}>{activity.action}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.userEmail}</p>
                    {activity.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-blue-600 cursor-pointer">Voir les détails</summary>
                        <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto">
                          {JSON.stringify(activity.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
