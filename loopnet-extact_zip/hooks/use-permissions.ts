"use client"

import { useAuth } from "./use-auth"
import { getUserPermissions, canPerformAction, getLimit, type UserRole } from "@/lib/permissions"

export function usePermissions() {
  const { userRole, isTestMode } = useAuth()

  const permissions = getUserPermissions(userRole as UserRole)

  const can = (action: keyof typeof permissions) => {
    return canPerformAction(userRole as UserRole, action)
  }

  const limit = (limitType: keyof typeof permissions) => {
    return getLimit(userRole as UserRole, limitType)
  }

  return {
    permissions,
    can,
    limit,
    userRole: userRole as UserRole,
    isAdmin: userRole === "admin",
    isAgent: userRole === "agent",
    isPremium: userRole === "premium",
    isSimple: userRole === "simple",
    isGuest: userRole === "guest",
    isTestMode,
  }
}
