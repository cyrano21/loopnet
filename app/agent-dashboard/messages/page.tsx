"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, MoreHorizontal, Phone, Mail, Calendar, Paperclip, Send, Smile } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState(1)
  const [messageText, setMessageText] = useState("")

  // Données fictives pour les conversations
  const conversations = [
    {
      id: 1,
      contact: {
        name: "Jean Dupont",
        email: "jean.dupont@example.com",
        avatar: "/avatars/01.png",
        status: "online",
      },
      messages: [
        {
          id: 1,
          sender: "them",
          text: "Bonjour, je suis intéressé par la propriété commerciale sur l'avenue des Champs-Élysées. Est-elle toujours disponible ?",
          time: "10:32",
          date: "2023-11-15",
        },
        {
          id: 2,
          sender: "me",
          text: "Bonjour Jean, merci pour votre intérêt ! Oui, cette propriété est toujours disponible. Souhaitez-vous organiser une visite ?",
          time: "10:45",
          date: "2023-11-15",
        },
        {
          id: 3,
          sender: "them",
          text: "Ce serait parfait. Quelles sont vos disponibilités cette semaine ?",
          time: "11:02",
          date: "2023-11-15",
        },
      ],
      unread: 0,
      property: "Bureaux commerciaux, Champs-Élysées",
    },
    {
      id: 2,
      contact: {
        name: "Marie Martin",
        email: "marie.martin@example.com",
        avatar: "/avatars/02.png",
        status: "offline",
      },
      messages: [
        {
          id: 1,
          sender: "them",
          text: "Avez-vous des entrepôts disponibles dans la zone industrielle nord ?",
          time: "14:22",
          date: "2023-11-14",
        },
        {
          id: 2,
          sender: "me",
          text: "Bonjour Marie, nous avons actuellement 3 entrepôts disponibles dans cette zone. Je peux vous envoyer les détails si vous êtes intéressée.",
          time: "15:30",
          date: "2023-11-14",
        },
      ],
      unread: 2,
      property: "Entrepôts, Zone Industrielle Nord",
    },
    {
      id: 3,
      contact: {
        name: "Pierre Durand",
        email: "pierre.durand@example.com",
        avatar: "/avatars/03.png",
        status: "online",
      },
      messages: [
        {
          id: 1,
          sender: "me",
          text: "Bonjour Pierre, suite à notre discussion d'hier, je vous confirme que le propriétaire est ouvert à une négociation sur le prix.",
          time: "09:15",
          date: "2023-11-13",
        },
        {
          id: 2,
          sender: "them",
          text: "C'est une excellente nouvelle ! Quelle est sa meilleure offre ?",
          time: "09:45",
          date: "2023-11-13",
        },
        {
          id: 3,
          sender: "me",
          text: "Il pourrait accepter une réduction de 5% sur le prix affiché, ce qui ramènerait le montant à 450 000 €.",
          time: "10:30",
          date: "2023-11-13",
        },
      ],
      unread: 1,
      property: "Local commercial, Rue de Rivoli",
    },
  ]

  const handleSendMessage = () => {
    if (messageText.trim() === "") return
    // Dans une application réelle, vous enverriez ce message à votre backend
    console.log("Message envoyé:", messageText)
    setMessageText("")
  }

  const getStatusIndicator = (status) => {
    return status === "online" ? (
      <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
    ) : (
      <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-gray-300 border-2 border-white" />
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier"
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      })
    }
  }

  const activeChat = conversations.find((conv) => conv.id === activeConversation)

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden border rounded-lg">
        {/* Liste des conversations */}
        <div className="w-1/3 border-r overflow-y-auto">
          <div className="p-4 border-b">
            <Input
              type="search"
              placeholder="Rechercher une conversation..."
              className="w-full"
            />
          </div>
          <div className="divide-y">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 cursor-pointer hover:bg-muted/50 ${activeConversation === conversation.id ? "bg-muted" : ""}`}
                onClick={() => setActiveConversation(conversation.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.contact.avatar} alt={conversation.contact.name} />
                        <AvatarFallback>{conversation.contact.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      {getStatusIndicator(conversation.contact.status)}
                    </div>
                    <div>
                      <div className="font-medium">{conversation.contact.name}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[180px]">
                        {conversation.property}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(conversation.messages[conversation.messages.length - 1].date)}
                    {conversation.unread > 0 && (
                      <Badge className="ml-2 bg-blue-500">{conversation.unread}</Badge>
                    )}
                  </div>
                </div>
                <div className="mt-1 text-sm text-muted-foreground truncate max-w-[280px]">
                  {conversation.messages[conversation.messages.length - 1].text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation active */}
        {activeChat ? (
          <div className="w-2/3 flex flex-col">
            {/* En-tête de la conversation */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={activeChat.contact.avatar} alt={activeChat.contact.name} />
                    <AvatarFallback>{activeChat.contact.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  {getStatusIndicator(activeChat.contact.status)}
                </div>
                <div>
                  <div className="font-medium">{activeChat.contact.name}</div>
                  <div className="text-sm text-muted-foreground">{activeChat.property}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeChat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "them" && (
                    <Avatar className="mr-2">
                      <AvatarImage src={activeChat.contact.avatar} alt={activeChat.contact.name} />
                      <AvatarFallback>{activeChat.contact.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${message.sender === "me" ? "bg-blue-500 text-white" : "bg-muted"}`}
                  >
                    <div>{message.text}</div>
                    <div className={`text-xs mt-1 ${message.sender === "me" ? "text-blue-100" : "text-muted-foreground"}`}>
                      {message.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Zone de saisie */}
            <div className="p-4 border-t">
              <div className="flex items-end space-x-2">
                <Textarea
                  placeholder="Écrivez votre message..."
                  className="min-h-[80px]"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <div className="flex flex-col space-y-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleSendMessage} disabled={messageText.trim() === ""}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-2/3 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Aucune conversation sélectionnée</h3>
              <p className="text-muted-foreground">Sélectionnez une conversation pour commencer à discuter</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}