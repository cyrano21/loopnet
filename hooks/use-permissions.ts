"use client"

import { useAuth } from "./use-auth"
import { getUserPermissions, canPerformAction, getLimit, type UserRole } from "@/lib/permissions"

export function usePermissions() {
  const { user, isAuthenticated } = useAuth()

  const userRole: UserRole = isAuthenticated ? (user?.role as UserRole) || "simple" : "guest"

  const permissions = getUserPermissions(userRole)

  const can = (action: keyof typeof permissions) => {
    return canPerformAction(userRole, action)
  }

  const limit = (limitType: keyof typeof permissions) => {
    return getLimit(userRole, limitType)
  }

  const requiresUpgrade = (action: keyof typeof permissions) => {
    if (can(action)) return false

    // Suggère le niveau minimum requis
    if (userRole === "guest") return "simple"
    if (userRole === "simple") return "premium"
    if (userRole === "premium") return "agent"
    return null
  }

  return {
    userRole,
    permissions,
    can,
    limit,
    requiresUpgrade,
    isGuest: userRole === "guest",
    isSimple: userRole === "simple",
    isPremium: userRole === "premium",
    isAgent: userRole === "agent",
    isAdmin: userRole === "admin",
  }
}
