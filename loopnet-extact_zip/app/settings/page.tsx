"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { NotificationManager } from "@/components/notification-manager"
import { Settings, Shield, Bell, Palette, Database } from "lucide-react"
import { CacheService } from "@/lib/cache/redis-cache"

export default function SettingsPage() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    priceAlerts: true,
    newListings: true,
    darkMode: false,
    compactView: false,
  })

  const [cacheStats, setCacheStats] = useState<any>(null)

  const updatePreference = (key: string, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const clearCache = async () => {
    await CacheService.invalidateAllCache()
    const stats = CacheService.getCacheStats()
    setCacheStats(stats)
    alert("Cache vidé avec succès !")
  }

  const loadCacheStats = () => {
    const stats = CacheService.getCacheStats()
    setCacheStats(stats)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Paramètres</h1>
      </div>

      {/* Notifications Push */}
      <NotificationManager />

      {/* Préférences de notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Préférences de Notifications
          </CardTitle>
          <CardDescription>Choisissez quand et comment vous souhaitez être notifié.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Notifications par email</Label>
            <Switch
              id="email-notifications"
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) => updatePreference("emailNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="price-alerts">Alertes de prix</Label>
            <Switch
              id="price-alerts"
              checked={preferences.priceAlerts}
              onCheckedChange={(checked) => updatePreference("priceAlerts", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="new-listings">Nouvelles annonces</Label>
            <Switch
              id="new-listings"
              checked={preferences.newListings}
              onCheckedChange={(checked) => updatePreference("newListings", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="marketing-emails">Emails marketing</Label>
            <Switch
              id="marketing-emails"
              checked={preferences.marketingEmails}
              onCheckedChange={(checked) => updatePreference("marketingEmails", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Préférences d'affichage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Préférences d'Affichage
          </CardTitle>
          <CardDescription>Personnalisez l'apparence de l'interface.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Mode sombre</Label>
            <Switch
              id="dark-mode"
              checked={preferences.darkMode}
              onCheckedChange={(checked) => updatePreference("darkMode", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="compact-view">Vue compacte</Label>
            <Switch
              id="compact-view"
              checked={preferences.compactView}
              onCheckedChange={(checked) => updatePreference("compactView", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Gestion du cache */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Gestion du Cache
          </CardTitle>
          <CardDescription>Gérez le cache local pour améliorer les performances.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Cache local</p>
              <p className="text-sm text-gray-500">Vider le cache peut améliorer les performances</p>
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={loadCacheStats}>
                Voir les stats
              </Button>
              <Button variant="destructive" onClick={clearCache}>
                Vider le cache
              </Button>
            </div>
          </div>

          {cacheStats && (
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm">
                <strong>Total:</strong> {cacheStats.totalKeys} éléments en cache
              </p>
              <div className="text-xs text-gray-600 mt-1">
                {Object.entries(cacheStats.byType).map(([type, count]) => (
                  <span key={type} className="mr-3">
                    {type}: {count as number}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sécurité
          </CardTitle>
          <CardDescription>Paramètres de sécurité et confidentialité.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full">
            Changer le mot de passe
          </Button>
          <Button variant="outline" className="w-full">
            Télécharger mes données
          </Button>
          <Separator />
          <Button variant="destructive" className="w-full">
            Supprimer mon compte
          </Button>
        </CardContent>
      </Card>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end">
        <Button size="lg">Sauvegarder les paramètres</Button>
      </div>
    </div>
  )
}
