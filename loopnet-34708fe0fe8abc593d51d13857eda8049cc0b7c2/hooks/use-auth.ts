"use client"

import { useSession } from "next-auth/react"
import { useRoleSwitcher } from "./use-role-switcher"

export function useAuth() {
  const { data: session, status } = useSession()
  const { getCurrentRole, isTestMode } = useRoleSwitcher()

  const isAuthenticated = !!session?.user
  const isLoading = status === "loading"

  // Utiliser le rôle de la session ou le rôle de test
  let userRole = "guest"

  if (isAuthenticated) {
    // Si on est en mode test et qu'on a une session, utiliser le rôle de test
    if (isTestMode) {
      userRole = getCurrentRole()
    } else {
      // Sinon utiliser le rôle de la session
      userRole = (session.user as any)?.role || "user"
    }
  }

  return {
    user: session?.user
      ? {
          ...session.user,
          role: userRole,
          isTestMode,
        }
      : null,
    isAuthenticated,
    isLoading,
    userRole,
    isAdmin: userRole === "admin",
    isAgent: userRole === "agent",
    isPremium: userRole === "premium",
    isSimple: userRole === "simple" || userRole === "user",
    isGuest: userRole === "guest",
  }
}
