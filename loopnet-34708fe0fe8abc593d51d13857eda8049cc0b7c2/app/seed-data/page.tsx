"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Activity, RefreshCw, CheckCircle, AlertCircle, Mail, UserCheck } from "lucide-react"

export default function SeedDataPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<{ [key: string]: boolean }>({})

  const seedAll = async () => {
    setIsLoading(true)
    setResults({})

    try {
      // Seed Properties
      console.log("Seeding properties...")
      const propertiesResponse = await fetch("/api/seed", { method: "POST" })
      setResults((prev) => ({ ...prev, properties: propertiesResponse.ok }))

      // Seed Users
      console.log("Seeding users...")
      const usersResponse = await fetch("/api/seed-users", { method: "POST" })
      setResults((prev) => ({ ...prev, users: usersResponse.ok }))

      // Seed Inquiries
      console.log("Seeding inquiries...")
      const inquiriesResponse = await fetch("/api/seed-inquiries", { method: "POST" })
      setResults((prev) => ({ ...prev, inquiries: inquiriesResponse.ok }))

      // Seed News
      console.log("Seeding news...")
      const newsResponse = await fetch("/api/seed-news", { method: "POST" })
      setResults((prev) => ({ ...prev, news: newsResponse.ok }))

      // Seed Professionals
      console.log("Seeding professionals...")
      const professionalsResponse = await fetch("/api/professionals", { method: "POST" })
      setResults((prev) => ({ ...prev, professionals: professionalsResponse.ok }))

      const allSuccess =
        propertiesResponse.ok && usersResponse.ok && inquiriesResponse.ok && newsResponse.ok && professionalsResponse.ok

      if (allSuccess) {
        alert("✅ Toutes les données ont été ajoutées avec succès !")
      } else {
        alert("⚠️ Certaines données n'ont pas pu être ajoutées")
      }
    } catch (error) {
      console.error("Erreur lors du peuplement:", error)
      alert("❌ Erreur lors du peuplement de la base de données")
    } finally {
      setIsLoading(false)
    }
  }

  const seedIndividual = async (type: string, endpoint: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(endpoint, { method: "POST" })
      setResults((prev) => ({ ...prev, [type]: response.ok }))

      if (response.ok) {
        alert(`✅ ${type} ajouté(s) avec succès !`)
      } else {
        alert(`❌ Erreur lors de l'ajout de ${type}`)
      }
    } catch (error) {
      console.error(`Erreur lors du peuplement de ${type}:`, error)
      alert(`❌ Erreur lors de l'ajout de ${type}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Peuplement de la Base de Données</h1>
            <p className="text-gray-600 text-lg">
              Ajoutez des données d'exemple complètes pour tester l'application LoopNet
            </p>
          </div>

          {/* Actions principales */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={seedAll}
                  disabled={isLoading}
                  className="w-full h-16 text-lg bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <RefreshCw className="w-6 h-6 mr-2 animate-spin" />
                  ) : (
                    <Building2 className="w-6 h-6 mr-2" />
                  )}
                  Peupler Toute la Base
                </Button>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Ou individuellement :</p>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      onClick={() => seedIndividual("Propriétés", "/api/seed")}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Propriétés
                      {results.properties !== undefined &&
                        (results.properties ? (
                          <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 ml-2 text-red-600" />
                        ))}
                    </Button>

                    <Button
                      onClick={() => seedIndividual("Utilisateurs", "/api/seed-users")}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Utilisateurs
                      {results.users !== undefined &&
                        (results.users ? (
                          <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 ml-2 text-red-600" />
                        ))}
                    </Button>

                    <Button
                      onClick={() => seedIndividual("Demandes", "/api/seed-inquiries")}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Demandes
                      {results.inquiries !== undefined &&
                        (results.inquiries ? (
                          <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 ml-2 text-red-600" />
                        ))}
                    </Button>

                    <Button
                      onClick={() => seedIndividual("Articles", "/api/seed-news")}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Articles
                      {results.news !== undefined &&
                        (results.news ? (
                          <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 ml-2 text-red-600" />
                        ))}
                    </Button>

                    <Button
                      onClick={() => seedIndividual("Professionnels", "/api/professionals")}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Professionnels
                      {results.professionals !== undefined &&
                        (results.professionals ? (
                          <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 ml-2 text-red-600" />
                        ))}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Données qui seront ajoutées */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Propriétés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline">5 propriétés complètes</Badge>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Bureau moderne Paris 8e</li>
                    <li>• Local commercial Lyon</li>
                    <li>• Entrepôt logistique Marseille</li>
                    <li>• Immeuble de bureaux Toulouse</li>
                    <li>• Local d'activité Lille</li>
                  </ul>
                  <p className="text-xs text-blue-600">Avec images, prix, descriptions détaillées</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Utilisateurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline">3 utilisateurs</Badge>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Marie (Premium) - Investisseuse</li>
                    <li>• Pierre (Agent Pro) - Agent 15 ans exp.</li>
                    <li>• Sophie (Simple) - Consultante</li>
                  </ul>
                  <p className="text-xs text-purple-600">Avec abonnements, profils, statistiques</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-orange-600" />
                  Demandes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline">3 demandes</Badge>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Demande de visite (En attente)</li>
                    <li>• Demande d'infos (En cours)</li>
                    <li>• Négociation prix (Fermée)</li>
                  </ul>
                  <p className="text-xs text-orange-600">Avec budgets, exigences, historique</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline">5 articles</Badge>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Tendances marché immobilier</li>
                    <li>• Investissement commercial</li>
                    <li>• Réglementation urbaine</li>
                    <li>• Technologies PropTech</li>
                    <li>• Développement durable</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                  Professionnels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline">5 professionnels</Badge>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Agents immobiliers</li>
                    <li>• Courtiers spécialisés</li>
                    <li>• Experts en évaluation</li>
                    <li>• Conseillers investissement</li>
                    <li>• Gestionnaires patrimoine</li>
                  </ul>
                  <p className="text-xs text-indigo-600">Avec ratings, spécialités, certifications</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>1.</strong> Cliquez sur "Peupler Toute la Base" pour ajouter toutes les données d'exemple
                </p>
                <p>
                  <strong>2.</strong> Ou utilisez les boutons individuels pour ajouter des types de données spécifiques
                </p>
                <p>
                  <strong>3.</strong> Les données seront ajoutées à votre base MongoDB
                </p>
                <p>
                  <strong>4.</strong> Vous pourrez ensuite naviguer sur l'application avec des données réelles
                </p>
                <p className="text-blue-600">
                  <strong>Note :</strong> Cette opération peut prendre quelques secondes
                </p>
              </div>
              {process.env.NODE_ENV === "production" && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded">
                  <p className="text-orange-700 font-medium">⚠️ Mode Production</p>
                  <p className="text-orange-600 text-sm">
                    Vous devez être connecté en tant qu'administrateur pour peupler la base en production.
                  </p>
                  <p className="text-orange-600 text-sm">
                    Si vous n'avez pas de compte admin, allez sur{" "}
                    <a href="/create-admin-prod" className="underline">
                      /create-admin-prod
                    </a>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
