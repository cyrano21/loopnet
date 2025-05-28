"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export type TestRole = "guest" | "simple" | "premium" | "agent" | "admin"

export function useRoleSwitcher() {
  const { data: session } = useSession()
  const [testRole, setTestRole] = useState<TestRole | null>(null)
  const [isTestMode, setIsTestMode] = useState(false)

  // Seuls les admins peuvent changer de rôle
  const canSwitchRole = session?.user?.role === "admin"

  const switchToRole = (role: TestRole) => {
    if (!canSwitchRole) return
    setTestRole(role)
    setIsTestMode(true)
    localStorage.setItem("testRole", role)
  }

  const exitTestMode = () => {
    setTestRole(null)
    setIsTestMode(false)
    localStorage.removeItem("testRole")
  }

  const getCurrentRole = (): TestRole => {
    if (isTestMode && testRole && canSwitchRole) return testRole
    return (session?.user?.role as TestRole) || "guest"
  }

  useEffect(() => {
    if (canSwitchRole) {
      const savedTestRole = localStorage.getItem("testRole") as TestRole
      if (savedTestRole) {
        setTestRole(savedTestRole)
        setIsTestMode(true)
      }
    } else {
      // Si l'utilisateur n'est plus admin, sortir du mode test
      setTestRole(null)
      setIsTestMode(false)
      localStorage.removeItem("testRole")
    }
  }, [canSwitchRole])

  return {
    testRole,
    isTestMode,
    canSwitchRole,
    switchToRole,
    exitTestMode,
    getCurrentRole,
  }
}
