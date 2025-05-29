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
    <nav className={cn(
      "flex items-center space-x-1 text-sm text-muted-foreground p-2 rounded-lg bg-background/80 backdrop-blur-sm shadow-sm border border-border/30 transition-all duration-300 hover:shadow-md",
      className
    )}>
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index === 0 && (
            <Home className="w-4 h-4 mr-1 text-blue-500 transition-all duration-300 group-hover:text-blue-600" />
          )}
          {index < breadcrumbs.length - 1 ? (
            <Link 
              href={item.href} 
              className="relative group hover:text-blue-600 transition-all duration-300 px-1 py-0.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/30"
            >
              {item.label}
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2"></span>
            </Link>
          ) : (
            <span className="text-foreground font-medium px-1 py-0.5 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-md">
              {item.label}
            </span>
          )}
          {index < breadcrumbs.length - 1 && (
            <ChevronRight className="w-4 h-4 mx-1 text-blue-400" />
          )}
        </div>
      ))}
    </nav>
  )
}
