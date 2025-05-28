'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, User, Shield } from 'lucide-react'

interface Role {
  id: string
  name: string
  label: string
}

const roles: Role[] = [
  { id: 'user', name: 'Utilisateur', label: 'Utilisateur standard' },
  { id: 'admin', name: 'Administrateur', label: 'Accès administrateur' },
]

export function RoleSwitcher() {
  const [currentRole, setCurrentRole] = useState<Role>(roles[1]) // Default to admin

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {currentRole.id === 'admin' ? (
            <Shield className="h-4 w-4" />
          ) : (
            <User className="h-4 w-4" />
          )}
          <span>{currentRole.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {roles.map((role) => (
          <DropdownMenuItem
            key={role.id}
            onClick={() => setCurrentRole(role)}
            className="flex items-center gap-2"
          >
            {role.id === 'admin' ? (
              <Shield className="h-4 w-4" />
            ) : (
              <User className="h-4 w-4" />
            )}
            <div className="flex flex-col">
              <span>{role.name}</span>
              <span className="text-xs text-muted-foreground">{role.label}</span>
            </div>
            {currentRole.id === role.id && (
              <Badge variant="secondary" className="ml-auto">
                Actuel
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
