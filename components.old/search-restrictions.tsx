"use client"

import { usePermissions } from "@/hooks/use-permissions"
import { AccessRestriction } from "./access-restriction"
import { UsageLimit } from "./usage-limit"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, Bell } from "lucide-react"

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
              <Filter className="h-5 w-5" />
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
              <Search className="h-5 w-5" />
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
              <Bell className="h-5 w-5" />
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
