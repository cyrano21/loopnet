"use client"

import { usePermissions } from "@/hooks/use-permissions"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp } from "lucide-react"

interface UsageLimitProps {
  limitType: string
  currentUsage: number
  label: string
  showUpgradePrompt?: boolean
}

export function UsageLimit({ limitType, currentUsage, label, showUpgradePrompt = true }: UsageLimitProps) {
  const { limit, requiresUpgrade, userRole } = usePermissions()

  const maxLimit = limit(limitType as any)

  if (maxLimit === null) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <TrendingUp className="h-4 w-4" />
        <span>{label}: Illimité</span>
        <Badge variant="secondary">Premium</Badge>
      </div>
    )
  }

  const percentage = (currentUsage / maxLimit) * 100
  const isNearLimit = percentage >= 80
  const isAtLimit = currentUsage >= maxLimit

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className={isAtLimit ? "text-red-600" : isNearLimit ? "text-orange-600" : "text-gray-600"}>
            {currentUsage} / {maxLimit}
          </span>
          {isNearLimit && <AlertTriangle className="h-4 w-4 text-orange-500" />}
        </div>
      </div>

      <Progress value={percentage} className={`h-2 ${isAtLimit ? "bg-red-100" : isNearLimit ? "bg-orange-100" : ""}`} />

      {isAtLimit && showUpgradePrompt && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
          Limite atteinte. Passez au niveau supérieur pour continuer.
        </div>
      )}

      {isNearLimit && !isAtLimit && (
        <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
          Vous approchez de votre limite. Pensez à upgrader.
        </div>
      )}
    </div>
  )
}
