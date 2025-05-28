"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Settings, Database, Mail, Shield, Globe, DollarSign } from "lucide-react"

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: "LoopNet Clone",
    siteDescription: "Plateforme immobilière commerciale",
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    maxFileSize: "10",
    defaultUserRole: "simple",
    stripePublishableKey: "",
    emailProvider: "smtp",
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
  })

  const { toast } = useToast()

  const handleSave = async () => {
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Paramètres sauvegardés avec succès",
        })
      } else {
        throw new Error("Erreur lors de la sauvegarde")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      })
    }
  }

  const handleDatabaseAction = async (action: string) => {
    try {
      const response = await fetch(`/api/admin/database/${action}`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: `Action ${action} exécutée avec succès`,
        })
      } else {
        throw new Error(`Erreur lors de l'action ${action}`)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Impossible d'exécuter l'action ${action}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Paramètres Système</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paramètres généraux */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Paramètres Généraux
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Nom du site</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenanceMode">Mode maintenance</Label>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="allowRegistration">Autoriser les inscriptions</Label>
              <Switch
                id="allowRegistration"
                checked={settings.allowRegistration}
                onCheckedChange={(checked) => setSettings({ ...settings, allowRegistration: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Paramètres utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Paramètres Utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="defaultUserRole">Rôle par défaut</Label>
              <select
                id="defaultUserRole"
                value={settings.defaultUserRole}
                onChange={(e) => setSettings({ ...settings, defaultUserRole: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="simple">Simple</option>
                <option value="premium">Premium</option>
                <option value="agent">Agent</option>
              </select>
            </div>
            <div>
              <Label htmlFor="maxFileSize">Taille max fichier (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => setSettings({ ...settings, maxFileSize: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications">Notifications email</Label>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Paramètres Stripe */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Paramètres Stripe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="stripePublishableKey">Clé publique Stripe</Label>
              <Input
                id="stripePublishableKey"
                value={settings.stripePublishableKey}
                onChange={(e) => setSettings({ ...settings, stripePublishableKey: e.target.value })}
                placeholder="pk_test_..."
              />
            </div>
            <p className="text-sm text-muted-foreground">
              La clé secrète Stripe est configurée dans les variables d'environnement
            </p>
          </CardContent>
        </Card>

        {/* Paramètres Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Paramètres Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="smtpHost">Serveur SMTP</Label>
              <Input
                id="smtpHost"
                value={settings.smtpHost}
                onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <Label htmlFor="smtpPort">Port SMTP</Label>
              <Input
                id="smtpPort"
                value={settings.smtpPort}
                onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="smtpUser">Utilisateur SMTP</Label>
              <Input
                id="smtpUser"
                value={settings.smtpUser}
                onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions base de données */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Gestion Base de Données
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" onClick={() => handleDatabaseAction("backup")}>
              Sauvegarder
            </Button>
            <Button variant="outline" onClick={() => handleDatabaseAction("optimize")}>
              Optimiser
            </Button>
            <Button variant="outline" onClick={() => handleDatabaseAction("clean")}>
              Nettoyer
            </Button>
            <Button variant="destructive" onClick={() => handleDatabaseAction("reset")}>
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Sauvegarder les Paramètres
        </Button>
      </div>
    </div>
  )
}
