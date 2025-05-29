"use client"

import dynamic from "next/dynamic"
import { usePermissions } from "@/hooks/use-permissions"
import { AccessRestriction } from "./access-restriction"
import { UsageLimit } from "./usage-limit"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// Composants d'icônes SVG en ligne
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const BellIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
)

const FilterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
)

interface SearchRestrictionsProps {
  currentSearches: number
  currentAlerts: number
}

export function SearchRestrictions({ currentSearches, currentAlerts }: SearchRestrictionsProps) {
  const { can, limit } = usePermissions()

  return (
    <div className="space-y-4">
      {/* Recherche avancée */}
      <AccessRestriction action="canUseAdvancedSearch">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FilterIcon className="h-5 w-5" />
              Filtres Avancés
            </CardTitle>
          </CardHeader>
          <CardContent>{/* Filtres avancés ici */}</CardContent>
        </Card>
      </AccessRestriction>

      {/* Recherches sauvegardées */}
      <AccessRestriction action="canSaveSearches">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SearchIcon className="h-5 w-5" />
              Recherches Sauvegardées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UsageLimit limitType="maxSavedSearches" currentUsage={currentSearches} label="Recherches sauvegardées" />
          </CardContent>
        </Card>
      </AccessRestriction>

      {/* Alertes */}
      <AccessRestriction action="canSetAlerts">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellIcon className="h-5 w-5" />
              Alertes de Prix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UsageLimit limitType="maxAlerts" currentUsage={currentAlerts} label="Alertes actives" />
          </CardContent>
        </Card>
      </AccessRestriction>
    </div>
  )
}
