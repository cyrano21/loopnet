"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, MoreHorizontal, Phone, Mail, Calendar } from "lucide-react"

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState("all")

  // Données fictives pour les leads
  const leads = [
    {
      id: 1,
      name: "Jean Dupont",
      email: "jean.dupont@example.com",
      phone: "+33 6 12 34 56 78",
      status: "hot",
      source: "Site web",
      interest: "Bureaux commerciaux",
      lastContact: "2023-11-15",
      avatar: "/avatars/01.png",
    },
    {
      id: 2,
      name: "Marie Martin",
      email: "marie.martin@example.com",
      phone: "+33 6 23 45 67 89",
      status: "warm",
      source: "Référence",
      interest: "Entrepôt logistique",
      lastContact: "2023-11-12",
      avatar: "/avatars/02.png",
    },
    {
      id: 3,
      name: "Pierre Durand",
      email: "pierre.durand@example.com",
      phone: "+33 6 34 56 78 90",
      status: "cold",
      source: "Salon immobilier",
      interest: "Local commercial",
      lastContact: "2023-11-08",
      avatar: "/avatars/03.png",
    },
    {
      id: 4,
      name: "Sophie Bernard",
      email: "sophie.bernard@example.com",
      phone: "+33 6 45 67 89 01",
      status: "hot",
      source: "LinkedIn",
      interest: "Bureaux open space",
      lastContact: "2023-11-14",
      avatar: "/avatars/04.png",
    },
    {
      id: 5,
      name: "Thomas Petit",
      email: "thomas.petit@example.com",
      phone: "+33 6 56 78 90 12",
      status: "warm",
      source: "Site web",
      interest: "Immeuble de bureaux",
      lastContact: "2023-11-10",
      avatar: "/avatars/05.png",
    },
  ]

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusBadge = (status) => {
    switch (status) {
      case "hot":
        return <Badge className="bg-red-500 hover:bg-red-600">Chaud</Badge>
      case "warm":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Tiède</Badge>
      case "cold":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Froid</Badge>
      default:
        return <Badge>Inconnu</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Leads</h1>
        <Button>
          Nouveau Lead
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un lead..."
            className="pl-8"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="hot">Chauds</TabsTrigger>
          <TabsTrigger value="warm">Tièdes</TabsTrigger>
          <TabsTrigger value="cold">Froids</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tous les leads</CardTitle>
              <CardDescription>Gérez tous vos prospects immobiliers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={lead.avatar} alt={lead.name} />
                        <AvatarFallback>{lead.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-muted-foreground">{lead.interest}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-right">
                        <div>Source: {lead.source}</div>
                        <div>Dernier contact: {new Date(lead.lastContact).toLocaleDateString()}</div>
                      </div>
                      {getStatusBadge(lead.status)}
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="hot" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Leads chauds</CardTitle>
              <CardDescription>Prospects avec un fort potentiel de conversion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads
                  .filter((lead) => lead.status === "hot")
                  .map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={lead.avatar} alt={lead.name} />
                          <AvatarFallback>{lead.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-muted-foreground">{lead.interest}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-right">
                          <div>Source: {lead.source}</div>
                          <div>Dernier contact: {new Date(lead.lastContact).toLocaleDateString()}</div>
                        </div>
                        {getStatusBadge(lead.status)}
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="warm" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Leads tièdes</CardTitle>
              <CardDescription>Prospects intéressés nécessitant un suivi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads
                  .filter((lead) => lead.status === "warm")
                  .map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={lead.avatar} alt={lead.name} />
                          <AvatarFallback>{lead.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-muted-foreground">{lead.interest}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-right">
                          <div>Source: {lead.source}</div>
                          <div>Dernier contact: {new Date(lead.lastContact).toLocaleDateString()}</div>
                        </div>
                        {getStatusBadge(lead.status)}
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cold" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Leads froids</CardTitle>
              <CardDescription>Prospects en phase initiale ou moins actifs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads
                  .filter((lead) => lead.status === "cold")
                  .map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={lead.avatar} alt={lead.name} />
                          <AvatarFallback>{lead.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-muted-foreground">{lead.interest}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-right">
                          <div>Source: {lead.source}</div>
                          <div>Dernier contact: {new Date(lead.lastContact).toLocaleDateString()}</div>
                        </div>
                        {getStatusBadge(lead.status)}
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}