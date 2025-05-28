"use client"

import { useMemo, useCallback } from "react"
import { useAuth } from "./use-auth"
import { getUserPermissions, canPerformAction, getLimit, type UserRole } from "@/lib/permissions"

export function usePermissions() {
  const { user, isAuthenticated } = useAuth()

  const userRole: UserRole = useMemo(() => {
    return isAuthenticated ? (user?.role as UserRole) || "simple" : "guest"
  }, [isAuthenticated, user?.role])

  const permissions = useMemo(() => {
    return getUserPermissions(userRole)
  }, [userRole])

  const can = useCallback((action: keyof typeof permissions) => {
    return canPerformAction(userRole, action)
  }, [userRole, permissions])

  const limit = useCallback((limitType: keyof typeof permissions) => {
    return getLimit(userRole, limitType)
  }, [userRole, permissions])

  const requiresUpgrade = useCallback((action: keyof typeof permissions) => {
    if (can(action)) return false

    // Suggère le niveau minimum requis
    if (userRole === "guest") return "simple"
    if (userRole === "simple") return "premium"
    if (userRole === "premium") return "agent"
    return null
  }, [can, userRole])

  return useMemo(() => ({
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
  }), [userRole, permissions, can, limit, requiresUpgrade])
}
