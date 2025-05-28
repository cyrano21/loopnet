"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRoleSwitcher, type TestRole } from "@/hooks/use-role-switcher"
import { Crown, User, Users, Star, Shield, Eye } from "lucide-react"

const roleIcons = {
  guest: Eye,
  simple: User,
  premium: Star,
  agent: Users,
  admin: Crown,
}

const roleLabels = {
  guest: "Invité",
  simple: "Simple",
  premium: "Premium",
  agent: "Agent",
  admin: "Admin",
}

const roleColors = {
  guest: "bg-gray-500",
  simple: "bg-blue-500",
  premium: "bg-purple-500",
  agent: "bg-green-500",
  admin: "bg-red-500",
}

export function RoleSwitcher() {
  const { testRole, isTestMode, canSwitchRole, switchToRole, exitTestMode, getCurrentRole } = useRoleSwitcher()
  const [selectedRole, setSelectedRole] = useState<TestRole>("guest")

  if (!canSwitchRole) return null

  const currentRole = getCurrentRole()
  const Icon = roleIcons[currentRole]

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Test des Rôles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Rôle actuel :</span>
          <Badge className={`${roleColors[currentRole]} text-white`}>
            <Icon className="h-3 w-3 mr-1" />
            {roleLabels[currentRole]}
          </Badge>
          {isTestMode && (
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              MODE TEST
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tester un rôle :</label>
          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as TestRole)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(roleLabels).map(([role, label]) => {
                const RoleIcon = roleIcons[role as TestRole]
                return (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center gap-2">
                      <RoleIcon className="h-4 w-4" />
                      {label}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => switchToRole(selectedRole)} className="flex-1" variant="outline">
            Tester ce rôle
          </Button>
          {isTestMode && (
            <Button onClick={exitTestMode} variant="destructive">
              Sortir du test
            </Button>
          )}
        </div>

        {isTestMode && (
          <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
            ⚠️ Vous testez les limitations du rôle "{roleLabels[testRole!]}". Vos permissions admin réelles sont
            temporairement masquées.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
