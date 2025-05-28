"use client"

import { useAuth } from "./use-auth"

export function useRoleAccess() {
  const { user } = useAuth()

  const roleHierarchy = {
    guest: 0,
    user: 1,
    premium: 2,
    agent: 3,
    admin: 4,
  }

  const getUserLevel = (role: string): number => {
    return roleHierarchy[role as keyof typeof roleHierarchy] || 0
  }

  const canAccess = (requiredRole: string): boolean => {
    if (!user) return false

    const userLevel = getUserLevel(user.role)
    const requiredLevel = getUserLevel(requiredRole)

    return userLevel >= requiredLevel
  }

  const requiresUpgrade = (targetRole: string): boolean => {
    if (!user) return true

    const userLevel = getUserLevel(user.role)
    const targetLevel = getUserLevel(targetRole)

    return userLevel < targetLevel
  }

  const getUpgradeMessage = (targetRole: string): string => {
    if (!user) return "Connexion requise"

    const messages = {
      premium: "Passez à Premium pour accéder à cette fonctionnalité",
      agent: "Devenez Agent pour accéder à cette fonctionnalité",
      admin: "Accès réservé aux administrateurs",
    }

    return messages[targetRole as keyof typeof messages] || "Mise à niveau requise"
  }

  const isAdmin = (): boolean => canAccess("admin")
  const isAgent = (): boolean => canAccess("agent")
  const isPremium = (): boolean => canAccess("premium")
  const isUser = (): boolean => canAccess("user")

  return {
    canAccess,
    requiresUpgrade,
    getUpgradeMessage,
    isAdmin,
    isAgent,
    isPremium,
    isUser,
    userRole: user?.role || "guest",
  }
}
