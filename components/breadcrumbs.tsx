"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href: string
}

const routeLabels: Record<string, string> = {
  "": "Accueil",
  properties: "Propriétés",
  professionals: "Professionnels",
  "market-data": "Données Marché",
  "cre-explained": "CRE Expliqué",
  dashboard: "Tableau de bord",
  "my-properties": "Mes Propriétés",
  favorites: "Favoris",
  "list-property": "Publier une annonce",
  auth: "Authentification",
  signin: "Connexion",
  signup: "Inscription",
  admin: "Administration",
  "agent-dashboard": "Tableau de bord Agent",
  analytics: "Analytics",
  notifications: "Notifications",
  onboarding: "Intégration",
  pricing: "Tarifs",
  "property-management": "Gestion Propriétés",
  leads: "Prospects",
  "commission-tracker": "Suivi Commissions",
  "marketing-suite": "Suite Marketing",
  "ai-assistant": "Assistant IA",
  "data-import": "Import de données",
  checkout: "Commande",
  property: "Propriété",
}

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname()

  // Ne pas afficher sur la page d'accueil
  if (pathname === "/") return null

  const pathSegments = pathname.split("/").filter(Boolean)

  const breadcrumbs: BreadcrumbItem[] = [{ label: "Accueil", href: "/" }]

  let currentPath = ""
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    breadcrumbs.push({
      label,
      href: currentPath,
    })
  })

  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index === 0 && <Home className="w-4 h-4 mr-1" />}
          {index < breadcrumbs.length - 1 ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
          {index < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 mx-2" />}
        </div>
      ))}
    </nav>
  )
}
