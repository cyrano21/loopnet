"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus, Users, MapPin, Building2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState("month")

  // Fonction pour obtenir le premier jour du mois
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  // Fonction pour obtenir le nombre de jours dans un mois
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Fonction pour formater la date (mois et année)
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
  }

  // Fonction pour naviguer au mois précédent
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Fonction pour naviguer au mois suivant
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Fonction pour naviguer à aujourd'hui
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Données fictives pour les événements
  const events = [
    {
      id: 1,
      title: "Visite propriété",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10, 14, 30),
      duration: 60, // minutes
      type: "visit",
      client: {
        name: "Jean Dupont",
        avatar: "/avatars/01.png",
      },
      property: {
        name: "Bureaux commerciaux",
        address: "123 Avenue des Champs-Élysées, Paris",
      },
    },
    {
      id: 2,
      title: "Rendez-vous client",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15, 10, 0),
      duration: 45, // minutes
      type: "meeting",
      client: {
        name: "Marie Martin",
        avatar: "/avatars/02.png",
      },
      location: "Café de Paris, 10 Rue de Rivoli",
    },
    {
      id: 3,
      title: "Signature contrat",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18, 16, 0),
      duration: 90, // minutes
      type: "contract",
      client: {
        name: "Pierre Durand",
        avatar: "/avatars/03.png",
      },
      property: {
        name: "Local commercial",
        address: "45 Rue du Commerce, Lyon",
      },
    },
    {
      id: 4,
      title: "Évaluation propriété",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22, 11, 30),
      duration: 120, // minutes
      type: "evaluation",
      property: {
        name: "Entrepôt logistique",
        address: "Zone Industrielle Nord, Marseille",
      },
    },
    {
      id: 5,
      title: "Réunion d'équipe",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25, 9, 0),
      duration: 60, // minutes
      type: "team",
      location: "Salle de conférence, Bureau principal",
    },
  ]

  // Fonction pour obtenir les événements d'un jour spécifique
  const getEventsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.getDate() === day && 
             eventDate.getMonth() === date.getMonth() && 
             eventDate.getFullYear() === date.getFullYear()
    })
  }

  // Fonction pour formater l'heure
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  }

  // Fonction pour obtenir la couleur du badge en fonction du type d'événement
  const getEventColor = (type: string) => {
    switch (type) {
      case "visit":
        return "bg-blue-500 hover:bg-blue-600"
      case "meeting":
        return "bg-green-500 hover:bg-green-600"
      case "contract":
        return "bg-purple-500 hover:bg-purple-600"
      case "evaluation":
        return "bg-orange-500 hover:bg-orange-600"
      case "team":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  // Fonction pour obtenir l'icône en fonction du type d'événement
  const getEventIcon = (type: string) => {
    switch (type) {
      case "visit":
        return <Building2 className="h-4 w-4" />
      case "meeting":
        return <Users className="h-4 w-4" />
      case "contract":
        return <CalendarIcon className="h-4 w-4" />
      case "evaluation":
        return <Building2 className="h-4 w-4" />
      case "team":
        return <Users className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }

  // Génération du calendrier
  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)
    const today = new Date()

    // Ajustement pour commencer la semaine le lundi (0 = lundi, 6 = dimanche)
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

    const days = []
    const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

    // En-têtes des jours de la semaine
    const dayHeaders = daysOfWeek.map((day, index) => (
      <div key={`header-${index}`} className="text-center font-medium p-2">
        {day}
      </div>
    ))

    // Jours vides avant le premier jour du mois
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="p-2 border border-gray-100 min-h-[100px]" />
      )
    }

    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()

      const dayEvents = getEventsForDay(day)

      days.push(
        <div
          key={`day-${day}`}
          className={`p-2 border border-gray-100 min-h-[100px] ${isToday ? "bg-blue-50" : ""}`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className={`text-sm font-medium ${isToday ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center" : ""}`}>
              {day}
            </span>
            {dayEvents.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {dayEvents.length}
              </Badge>
            )}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded truncate flex items-center space-x-1 ${getEventColor(event.type)} text-white`}
              >
                <span>{formatTime(event.date)}</span>
                <span className="truncate">{event.title}</span>
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{dayEvents.length - 2} plus
              </div>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-7 gap-0">
        {dayHeaders}
        {days}
      </div>
    )
  }

  // Liste des événements du jour
  const renderDayEvents = () => {
    const today = new Date()
    const todayEvents = events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.getDate() === today.getDate() && 
             eventDate.getMonth() === today.getMonth() && 
             eventDate.getFullYear() === today.getFullYear()
    })

    todayEvents.sort((a, b) => a.date.getTime() - b.date.getTime())

    return (
      <div className="space-y-4">
        {todayEvents.length > 0 ? (
          todayEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex border-l-4 border-blue-500">
                  <div className="p-4 flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge className={getEventColor(event.type)}>
                        {event.type === "visit" && "Visite"}
                        {event.type === "meeting" && "Rendez-vous"}
                        {event.type === "contract" && "Contrat"}
                        {event.type === "evaluation" && "Évaluation"}
                        {event.type === "team" && "Équipe"}
                      </Badge>
                      <h4 className="font-medium">{event.title}</h4>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {formatTime(event.date)} - {formatTime(new Date(event.date.getTime() + event.duration * 60000))}
                      </span>
                    </div>
                    {event.client && (
                      <div className="mt-2 flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={event.client.avatar} alt={event.client.name} />
                          <AvatarFallback>{event.client.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{event.client.name}</span>
                      </div>
                    )}
                    {(event.location || event.property) && (
                      <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>
                          {event.location || event.property?.address}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col justify-center space-y-2 border-l">
                    <Button variant="outline" size="sm">
                      Détails
                    </Button>
                    <Button variant="ghost" size="sm">
                      Modifier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Aucun événement aujourd'hui</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Calendrier</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={goToToday}>
            Aujourd'hui
          </Button>
          <div className="flex items-center rounded-md border">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-4 py-2 font-medium">
              {formatMonthYear(currentDate)}
            </div>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Select defaultValue={view} onValueChange={setView}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Vue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mois</SelectItem>
              <SelectItem value="week">Semaine</SelectItem>
              <SelectItem value="day">Jour</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel événement
          </Button>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier mensuel</CardTitle>
              <CardDescription>
                Gérez vos rendez-vous, visites et événements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderCalendar()}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="today" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Événements d'aujourd'hui</CardTitle>
              <CardDescription>
                Vos rendez-vous et tâches pour aujourd'hui
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderDayEvents()}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upcoming" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Événements à venir</CardTitle>
              <CardDescription>
                Vos prochains rendez-vous et tâches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Fonctionnalité en cours de développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}