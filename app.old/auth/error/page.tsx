"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Building } from "lucide-react"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "Il y a un problème avec la configuration du serveur."
      case "AccessDenied":
        return "Accès refusé. Vous n'avez pas les permissions nécessaires."
      case "Verification":
        return "Le token de vérification a expiré ou est invalide."
      default:
        return "Une erreur inattendue s'est produite lors de la connexion."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Building className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">LoopNet</span>
          </div>
          <div className="flex items-center justify-center">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-center">Erreur d'authentification</CardTitle>
          <CardDescription className="text-center">{getErrorMessage(error)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">Veuillez réessayer ou contactez le support si le problème persiste.</p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/auth/signin">Retour à la connexion</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">Retour à l'accueil</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
