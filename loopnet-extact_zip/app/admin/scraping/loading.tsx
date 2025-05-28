import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Globe } from "lucide-react"

export default function ScrapingAdminLoading() {
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

      {/* Statistiques - Loading */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contrôles de scraping - Loading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Contrôle du Scraping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
            </div>

            {/* Sources configurées - Loading */}
            <div>
              <h4 className="font-semibold mb-3">Sources Configurées</h4>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logs de Scraping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 p-4 rounded-lg h-64 overflow-y-auto">
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full bg-gray-700" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Avertissement légal - Loading */}
      <Card className="mt-8 border-yellow-200 bg-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Skeleton className="h-6 w-6 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <div className="space-y-1 mt-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-3/4" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
