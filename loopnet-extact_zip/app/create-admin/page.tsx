"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Crown, Check, AlertCircle } from "lucide-react"

export default function CreateAdminPage() {
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(false)
  const { toast } = useToast()

  const createAdmin = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/create-admin", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setCreated(true)
        toast({
          title: "✅ Admin créé avec succès !",
          description: "Louis Olivier est maintenant administrateur",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'admin",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Crown className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <CardTitle>Créer le Compte Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!created ? (
            <>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">👑 Coordonnées Admin</h3>
                <p>
                  <strong>Nom :</strong> Louis Olivier
                </p>
                <p>
                  <strong>Email :</strong> louiscyrano@gmail.com
                </p>
                <p>
                  <strong>Mot de passe :</strong> Figoro21
                </p>
                <p>
                  <strong>Rôle :</strong> Admin
                </p>
              </div>

              <Button onClick={createAdmin} disabled={loading} className="w-full">
                {loading ? "Création en cours..." : "Créer le Compte Admin"}
              </Button>

              <div className="text-xs text-muted-foreground text-center">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                Cette action créera votre compte administrateur principal
              </div>
            </>
          ) : (
            <div className="text-center space-y-4">
              <Check className="h-16 w-16 mx-auto text-green-500" />
              <h3 className="text-lg font-semibold text-green-600">✅ Compte Admin Créé !</h3>
              <p className="text-sm text-muted-foreground">
                Vous pouvez maintenant vous connecter avec vos identifiants
              </p>
              <Button asChild className="w-full">
                <a href="/auth/signin">Se Connecter</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
