"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, TrendingUp, Users, Search, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useNews } from "@/hooks/use-news"

const newsCategories = [
  { id: "all", label: "Toutes" },
  { id: "market", label: "Marché" },
  { id: "investment", label: "Investissement" },
  { id: "development", label: "Développement" },
  { id: "regulation", label: "Réglementation" },
  { id: "technology", label: "Technologie" },
]

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("featured")

  // Utiliser la vraie API
  const { articles, loading, error, pagination, refetch } = useNews({
    category: selectedCategory,
    search: searchQuery,
    featured: activeTab === "featured" ? true : undefined,
    limit: 10,
  })

  const featuredArticles = articles.filter((article) => article.featured)
  const recentArticles = articles.filter((article) => !article.featured)

  if (loading) {
    return (
      <PageLayout title="Actualités Immobilières">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Chargement des actualités...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout title="Actualités Immobilières">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Erreur : {error}</p>
          <Button onClick={refetch}>Réessayer</Button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Actualités Immobilières">
      <div className="space-y-8">
        {/* Header avec recherche */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Actualités Immobilières</h1>
            <p className="text-gray-600">Restez informé des dernières tendances du marché</p>
          </div>
          <div className="flex gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher des articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon" onClick={refetch}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Catégories */}
        <div className="flex flex-wrap gap-2">
          {newsCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="featured">À la Une ({featuredArticles.length})</TabsTrigger>
            <TabsTrigger value="recent">Récentes ({recentArticles.length})</TabsTrigger>
            <TabsTrigger value="trending">Tendances</TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="space-y-6">
            {featuredArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Aucun article à la une pour le moment</p>
              </div>
            ) : (
              <>
                {featuredArticles[0] && (
                  <Card className="overflow-hidden">
                    <div className="lg:flex">
                      <div className="lg:w-1/2">
                        <Image
                          src={featuredArticles[0].image || "/placeholder.svg?height=400&width=600&query=news article"}
                          alt={featuredArticles[0].title}
                          width={600}
                          height={400}
                          className="w-full h-64 lg:h-full object-cover"
                        />
                      </div>
                      <div className="lg:w-1/2 p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="default">{featuredArticles[0].category}</Badge>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />À la une
                          </Badge>
                        </div>
                        <h2 className="text-2xl font-bold mb-3">{featuredArticles[0].title}</h2>
                        <p className="text-gray-600 mb-4">{featuredArticles[0].excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {featuredArticles[0].author.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(featuredArticles[0].publishedAt).toLocaleDateString("fr-FR")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {featuredArticles[0].readTime} min
                          </span>
                        </div>
                        <Button>Lire l'article</Button>
                      </div>
                    </div>
                  </Card>
                )}

                {featuredArticles.length > 1 && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {featuredArticles.slice(1).map((article) => (
                      <Card key={article._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <Image
                          src={article.image || "/placeholder.svg?height=200&width=400&query=news article"}
                          alt={article.title}
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                        <CardContent className="p-4">
                          <Badge variant="outline" className="mb-2">
                            {article.category}
                          </Badge>
                          <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{article.author.name}</span>
                            <span>{new Date(article.publishedAt).toLocaleDateString("fr-FR")}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            {recentArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Aucun article récent</p>
              </div>
            ) : (
              recentArticles.map((article) => (
                <Card key={article._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{article.category}</Badge>
                        </div>
                        <h3 className="font-semibold mb-1">{article.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{article.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {article.author.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(article.publishedAt).toLocaleDateString("fr-FR")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.readTime} min
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Lire
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="trending">
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Articles tendances</h3>
              <p className="text-gray-600">Fonctionnalité en cours de développement</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Newsletter */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Newsletter Immobilière</h3>
            <p className="text-gray-600 mb-4">Recevez les dernières actualités directement dans votre boîte mail</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input placeholder="Votre email" type="email" />
              <Button>S'abonner</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
