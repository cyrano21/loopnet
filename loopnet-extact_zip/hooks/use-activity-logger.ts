"use client"

import { useSession } from "next-auth/react"
import { useCallback } from "react"

export function useActivityLogger() {
  const { data: session } = useSession()

  const logActivity = useCallback(
    async (action: string, description: string, details?: any) => {
      if (!session?.user) return

      try {
        await fetch("/api/admin/activity-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.user.id,
            userEmail: session.user.email,
            userName: session.user.name,
            userRole: session.user.role,
            action,
            description,
            details,
          }),
        })
      } catch (error) {
        console.error("Erreur log activité:", error)
      }
    },
    [session],
  )

  return { logActivity }
}
