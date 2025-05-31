"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"

interface Message {
  _id: string
  conversation: string
  sender: {
    _id: string
    name: string
    avatar?: string
  }
  recipient: {
    _id: string
    name: string
    avatar?: string
  }
  content: string
  attachments?: Array<{
    url: string
    type: string
    name: string
    size?: number
  }>
  isRead: boolean
  readAt?: string
  createdAt: string
  updatedAt: string
}

interface Conversation {
  _id: string
  participants: Array<{
    _id: string
    name: string
    avatar?: string
  }>
  property?: {
    _id: string
    title: string
    images: Array<{ url: string }>
  }
  lastMessage?: {
    content: string
    createdAt: string
    sender: string
  }
  unreadCount: number
  updatedAt: string
}

interface UseMessagesReturn {
  conversations: Conversation[]
  currentConversation: string | null
  messages: Message[]
  loading: boolean
  error: string | null
  sendMessage: (content: string, attachments?: File[]) => Promise<void>
  selectConversation: (conversationId: string) => void
  startNewConversation: (recipientId: string, propertyId?: string) => Promise<string>
  markAsRead: (messageId: string) => Promise<void>
  archiveConversation: (conversationId: string) => Promise<void>
}

export function useMessages(): UseMessagesReturn {
  const { data: session } = useSession()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger les conversations
  const fetchConversations = useCallback(async () => {
    if (!session?.user) return

    try {
      setLoading(true)
      const response = await fetch("/api/messages/conversations")
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      console.error("Error fetching conversations:", err)
    } finally {
      setLoading(false)
    }
  }, [session])

  // Charger les messages d'une conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!session?.user || !conversationId) return

    try {
      setLoading(true)
      const response = await fetch(`/api/messages/conversations/${conversationId}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      console.error("Error fetching messages:", err)
    } finally {
      setLoading(false)
    }
  }, [session])

  // Sélectionner une conversation
  const selectConversation = useCallback((conversationId: string) => {
    setCurrentConversation(conversationId)
  }, [])

  // Envoyer un message
  const sendMessage = useCallback(async (content: string, attachments?: File[]) => {
    if (!session?.user || !currentConversation) {
      setError("Vous devez être connecté et avoir une conversation active pour envoyer un message")
      return
    }

    try {
      const formData = new FormData()
      formData.append("content", content)
      formData.append("conversationId", currentConversation)
      
      if (attachments && attachments.length > 0) {
        attachments.forEach(file => {
          formData.append("attachments", file)
        })
      }

      const response = await fetch("/api/messages", {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Ajouter le nouveau message à la liste
      setMessages(prev => [...prev, data.message])
      
      // Mettre à jour la dernière conversation
      setConversations(prev => {
        return prev.map(conv => {
          if (conv._id === currentConversation) {
            return {
              ...conv,
              lastMessage: {
                content: data.message.content,
                createdAt: data.message.createdAt,
                sender: data.message.sender._id
              },
              updatedAt: data.message.createdAt
            }
          }
          return conv
        })
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'envoi du message")
      console.error("Error sending message:", err)
    }
  }, [currentConversation, session])

  // Démarrer une nouvelle conversation
  const startNewConversation = useCallback(async (recipientId: string, propertyId?: string) => {
    if (!session?.user) {
      setError("Vous devez être connecté pour démarrer une conversation")
      throw new Error("User not authenticated")
    }

    try {
      const response = await fetch("/api/messages/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          recipientId,
          propertyId
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Ajouter la nouvelle conversation à la liste
      setConversations(prev => [data.conversation, ...prev])
      
      // Sélectionner la nouvelle conversation
      setCurrentConversation(data.conversation._id)
      
      // Initialiser les messages comme un tableau vide
      setMessages([])
      
      return data.conversation._id
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la création de la conversation")
      console.error("Error creating conversation:", err)
      throw err
    }
  }, [session])

  // Marquer un message comme lu
  const markAsRead = useCallback(async (messageId: string) => {
    if (!session?.user) return

    try {
      const response = await fetch(`/api/messages/${messageId}/read`, {
        method: "PUT"
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Mettre à jour le statut du message localement
      setMessages(prev => {
        return prev.map(msg => {
          if (msg._id === messageId) {
            return { ...msg, isRead: true, readAt: new Date().toISOString() }
          }
          return msg
        })
      })

      // Mettre à jour le compteur de non lus dans la conversation
      if (currentConversation) {
        setConversations(prev => {
          return prev.map(conv => {
            if (conv._id === currentConversation) {
              return { ...conv, unreadCount: Math.max(0, conv.unreadCount - 1) }
            }
            return conv
          })
        })
      }
    } catch (err) {
      console.error("Error marking message as read:", err)
    }
  }, [currentConversation, session])

  // Archiver une conversation
  const archiveConversation = useCallback(async (conversationId: string) => {
    if (!session?.user) return

    try {
      const response = await fetch(`/api/messages/conversations/${conversationId}/archive`, {
        method: "PUT"
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Supprimer la conversation de la liste
      setConversations(prev => prev.filter(conv => conv._id !== conversationId))
      
      // Si c'était la conversation active, réinitialiser
      if (currentConversation === conversationId) {
        setCurrentConversation(null)
        setMessages([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'archivage de la conversation")
      console.error("Error archiving conversation:", err)
    }
  }, [currentConversation, session])

  // Charger les conversations au chargement
  useEffect(() => {
    if (session?.user) {
      fetchConversations()
    }
  }, [fetchConversations, session])

  // Charger les messages quand la conversation change
  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation)
    } else {
      setMessages([])
    }
  }, [currentConversation, fetchMessages])

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    sendMessage,
    selectConversation,
    startNewConversation,
    markAsRead,
    archiveConversation
  }
}