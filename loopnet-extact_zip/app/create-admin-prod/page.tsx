"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Eye, EyeOff } from "lucide-react"

export default function CreateAdminProdPage() {
  const [formData, setFormData] = useState({
    email: "louiscyrano@gmail.com",
    password: "",
    secretKey: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/create-admin-prod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        setFormData({ ...formData, password: "", secretKey: "" })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Erreur de connexion",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <CardTitle>Créer Admin Production</CardTitle>
          <CardDescription>Créez ou mettez à jour un compte administrateur pour la production</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="secretKey">Clé Secrète</Label>
              <div className="relative">
                <Input
                  id="secretKey"
                  type={showSecret ? "text" : "password"}
                  value={formData.secretKey}
                  onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                  placeholder="loopnet-admin-2024"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Clé par défaut : loopnet-admin-2024</p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Création..." : "Créer Admin"}
            </Button>
          </form>

          {result && (
            <div
              className={`mt-4 p-3 rounded ${result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
            >
              {result.message}
            </div>
          )}

          <div className="mt-6 text-sm text-gray-600">
            <h4 className="font-medium mb-2">Instructions :</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Entrez votre email</li>
              <li>Choisissez un mot de passe sécurisé</li>
              <li>
                Utilisez la clé secrète : <code>loopnet-admin-2024</code>
              </li>
              <li>Cliquez "Créer Admin"</li>
              <li>Connectez-vous ensuite avec ces identifiants</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
