"use client"

import type React from "react"

import { useEffect } from "react"
import { ClientProtection } from "@/lib/security/client-protection"

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialiser les protections côté client
    ClientProtection.initialize()

    // Ajouter des protections supplémentaires
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // L'utilisateur a changé d'onglet, on peut nettoyer des données sensibles
        console.clear()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Détecter les tentatives de débogage
    let devtools = false
    setInterval(() => {
      const start = performance.now()
      debugger // Cette ligne sera détectée si les DevTools sont ouverts
      const end = performance.now()

      if (end - start > 100) {
        devtools = true
        // Rediriger ou masquer le contenu
      }
    }, 1000)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return <>{children}</>
}
