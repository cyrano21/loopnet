"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function MessageNotification() {
  const { data: session } = useSession()
  const router = useRouter()
  const [unreadCount, setUnreadCount] = useState(0)

  // Récupérer le nombre de messages non lus
  useEffect(() => {
    if (!session?.user) return

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/messages/unread-count")
        if (response.ok) {
          const data = await response.json()
          setUnreadCount(data.count)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des messages non lus:", error)
      }
    }

    // Charger au démarrage
    fetchUnreadCount()

    // Mettre à jour toutes les minutes
    const interval = setInterval(fetchUnreadCount, 60000)

    return () => clearInterval(interval)
  }, [session])

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => router.push("/messages")}
      aria-label="Messages"
    >
      <MessageSquare className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </Badge>
      )}
    </Button>
  )
}