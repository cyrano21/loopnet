"use client"

import { useState, useEffect } from "react"
import { useMessages } from "@/hooks/use-messages"
import { useSession } from "next-auth/react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Send, Search, MoreVertical, Paperclip, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

export default function MessagesPage() {
  const { data: session } = useSession()
  const {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    selectConversation,
    sendMessage,
    markAsRead,
    archiveConversation,
  } = useMessages()

  const [messageContent, setMessageContent] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filtrer les conversations en fonction de la recherche
  const filteredConversations = conversations.filter((conversation) => {
    const otherParticipant = conversation.participants.find(
      (p) => p._id !== session?.user?.id
    )
    const propertyTitle = conversation.property?.title || ""
    const searchLower = searchQuery.toLowerCase()

    return (
      otherParticipant?.name.toLowerCase().includes(searchLower) ||
      propertyTitle.toLowerCase().includes(searchLower) ||
      (conversation.lastMessage?.content || "").toLowerCase().includes(searchLower)
    )
  })

  // Trouver la conversation actuelle
  const activeConversation = conversations.find(
    (conv) => conv._id === currentConversation
  )

  // Trouver l'autre participant dans la conversation
  const otherParticipant = activeConversation?.participants.find(
    (p) => p._id !== session?.user?.id
  )

  // Gérer l'envoi d'un message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageContent.trim()) return

    try {
      setIsSubmitting(true)
      await sendMessage(messageContent, attachments)
      setMessageContent("")
      setAttachments([])
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Gérer l'ajout de pièces jointes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files))
    }
  }

  // Marquer les messages non lus comme lus lorsqu'ils sont affichés
  useEffect(() => {
    if (messages.length > 0 && session?.user?.id) {
      messages.forEach((message) => {
        if (
          !message.isRead &&
          message.recipient._id === session.user.id
        ) {
          markAsRead(message._id)
        }
      })
    }
  }, [messages, session, markAsRead])

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Messagerie</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Liste des conversations */}
        <div className="border rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher une conversation..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-280px)]">
            {loading && !conversations.length ? (
              // Squelettes de chargement
              <div className="space-y-4 p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[160px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                {searchQuery
                  ? "Aucune conversation ne correspond à votre recherche"
                  : "Aucune conversation"}
              </div>
            ) : (
              <div className="divide-y">
                {filteredConversations.map((conversation) => {
                  const otherParticipant = conversation.participants.find(
                    (p) => p._id !== session?.user?.id
                  )
                  const isActive = conversation._id === currentConversation
                  const hasUnread = conversation.unreadCount > 0

                  return (
                    <div
                      key={conversation._id}
                      className={`p-4 cursor-pointer hover:bg-muted/50 ${isActive ? "bg-muted" : ""}`}
                      onClick={() => selectConversation(conversation._id)}
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          {otherParticipant?.avatar && (
                            <img
                              src={otherParticipant.avatar}
                              alt={otherParticipant.name}
                            />
                          )}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">
                              {otherParticipant?.name}
                            </p>
                            {conversation.lastMessage && (
                              <p className="text-xs text-muted-foreground">
                                {format(
                                  new Date(conversation.lastMessage.createdAt),
                                  "d MMM",
                                  { locale: fr }
                                )}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.property?.title ? (
                                <span className="text-primary font-medium">
                                  {conversation.property.title}:{" "}
                                </span>
                              ) : null}
                              {conversation.lastMessage?.content ||
                                "Nouvelle conversation"}
                            </p>
                            {hasUnread && (
                              <Badge variant="default" className="ml-2">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Zone de conversation */}
        <div className="border rounded-lg overflow-hidden md:col-span-2">
          {currentConversation && activeConversation ? (
            <>
              {/* En-tête de la conversation */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    {otherParticipant?.avatar && (
                      <img
                        src={otherParticipant.avatar}
                        alt={otherParticipant.name}
                      />
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">{otherParticipant?.name}</p>
                    {activeConversation.property && (
                      <p className="text-sm text-muted-foreground">
                        {activeConversation.property.title}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => archiveConversation(currentConversation)}
                    >
                      Archiver la conversation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Messages */}
              <ScrollArea className="h-[calc(100vh-380px)] p-4">
                {loading && !messages.length ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
                      >
                        <div className="max-w-[70%]">
                          <Skeleton
                            className={`h-20 w-[300px] rounded-lg ${i % 2 === 0 ? "rounded-tl-none" : "rounded-tr-none"}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Aucun message. Commencez la conversation !
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwnMessage = message.sender._id === session?.user?.id
                      const messageDate = new Date(message.createdAt)

                      return (
                        <div
                          key={message._id}
                          className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                        >
                          <div className="flex items-start gap-2 max-w-[70%]">
                            {!isOwnMessage && (
                              <Avatar className="h-8 w-8 mt-1">
                                {message.sender.avatar && (
                                  <img
                                    src={message.sender.avatar}
                                    alt={message.sender.name}
                                  />
                                )}
                              </Avatar>
                            )}
                            <div>
                              <div
                                className={`p-3 rounded-lg ${isOwnMessage
                                  ? "bg-primary text-primary-foreground rounded-tr-none"
                                  : "bg-muted rounded-tl-none"}`}
                              >
                                <p>{message.content}</p>
                                {message.attachments && message.attachments.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {message.attachments.map((attachment, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-2 p-2 bg-background/50 rounded">
                                        <Paperclip className="h-4 w-4" />
                                        <a
                                          href={attachment.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm underline truncate max-w-[200px]"
                                        >
                                          {attachment.name}
                                        </a>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center mt-1 space-x-2">
                                <p className="text-xs text-muted-foreground">
                                  {format(messageDate, "HH:mm")}
                                </p>
                                {isOwnMessage && (
                                  <div className="flex items-center">
                                    {message.isRead ? (
                                      <Check className="h-3 w-3 text-primary" />
                                    ) : (
                                      <Check className="h-3 w-3 text-muted-foreground" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </ScrollArea>

              {/* Zone de saisie */}
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <Textarea
                    placeholder="Écrivez votre message..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    className="min-h-[100px]"
                  />
                  
                  {/* Affichage des pièces jointes sélectionnées */}
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-muted rounded-md"
                        >
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm truncate max-w-[200px]">
                            {file.name}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => {
                              const newAttachments = [...attachments]
                              newAttachments.splice(index, 1)
                              setAttachments(newAttachments)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        multiple
                        onChange={handleFileChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => document.getElementById("file-upload")?.click()}
                      >
                        <Paperclip className="h-5 w-5" />
                      </Button>
                    </div>
                    <Button type="submit" disabled={isSubmitting || !messageContent.trim()}>
                      <Send className="h-5 w-5 mr-2" />
                      Envoyer
                    </Button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium">Aucune conversation sélectionnée</h3>
                <p className="text-muted-foreground mt-1">
                  Sélectionnez une conversation pour afficher les messages
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}