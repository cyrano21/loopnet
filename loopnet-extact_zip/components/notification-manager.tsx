"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Bell, BellOff, Settings } from "lucide-react"
import { usePushNotifications } from "@/lib/notifications/push-notifications"

export function NotificationManager() {
  const [status, setStatus] = useState({
    supported: false,
    permission: "default" as NotificationPermission,
    subscribed: false,
  })
  const [loading, setLoading] = useState(false)

  const { initialize, subscribe, unsubscribe, showNotification, getStatus } = usePushNotifications()

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    const currentStatus = await getStatus()
    setStatus(currentStatus)
  }

  const handleInitialize = async () => {
    setLoading(true)
    try {
      const success = await initialize()
      if (success) {
        await checkStatus()
      }
    } catch (error) {
      console.error("Failed to initialize notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const subscription = await subscribe()
      if (subscription) {
        await checkStatus()
        await showNotification("Notifications activées !", {
          body: "Vous recevrez maintenant des notifications pour les nouvelles propriétés et mises à jour.",
        })
      }
    } catch (error) {
      console.error("Failed to subscribe:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnsubscribe = async () => {
    setLoading(true)
    try {
      const success = await unsubscribe()
      if (success) {
        await checkStatus()
      }
    } catch (error) {
      console.error("Failed to unsubscribe:", error)
    } finally {
      setLoading(false)
    }
  }

  const testNotification = async () => {
    await showNotification("Notification de test", {
      body: "Ceci est une notification de test pour vérifier que tout fonctionne correctement.",
      tag: "test",
    })
  }

  if (!status.supported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Notifications non supportées
          </CardTitle>
          <CardDescription>Votre navigateur ne supporte pas les notifications push.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Gestion des Notifications
        </CardTitle>
        <CardDescription>Configurez vos préférences de notifications push.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statut actuel */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Statut des notifications</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={status.permission === "granted" ? "default" : "secondary"}>
                Permission: {status.permission}
              </Badge>
              <Badge variant={status.subscribed ? "default" : "secondary"}>
                {status.subscribed ? "Activées" : "Désactivées"}
              </Badge>
            </div>
          </div>
          <Switch
            checked={status.subscribed}
            onCheckedChange={status.subscribed ? handleUnsubscribe : handleSubscribe}
            disabled={loading || status.permission === "denied"}
          />
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {status.permission === "default" && (
            <Button onClick={handleInitialize} disabled={loading} className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Activer les notifications
            </Button>
          )}

          {status.permission === "granted" && !status.subscribed && (
            <Button onClick={handleSubscribe} disabled={loading} className="w-full">
              <Bell className="h-4 w-4 mr-2" />
              S'abonner aux notifications
            </Button>
          )}

          {status.subscribed && (
            <Button onClick={testNotification} variant="outline" className="w-full">
              Tester les notifications
            </Button>
          )}
        </div>

        {/* Informations */}
        {status.permission === "denied" && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              Les notifications ont été bloquées. Veuillez autoriser les notifications dans les paramètres de votre
              navigateur.
            </p>
          </div>
        )}

        {status.subscribed && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              ✅ Vous recevrez des notifications pour les nouvelles propriétés, mises à jour de prix, et messages
              importants.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
