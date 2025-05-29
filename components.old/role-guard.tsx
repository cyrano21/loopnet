'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Lock, Crown, Star, RefreshCw } from 'lucide-react'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles?: string[]
  requiredRole?: 'admin' | 'agent' | 'premium' | 'simple' | 'user'
  fallback?: ReactNode
  redirectTo?: string
}

export function RoleGuard ({
  children,
  allowedRoles = [],
  requiredRole,
  fallback,
  redirectTo
}: RoleGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const userRole = user?.role || 'guest'

  // Affichage pendant le chargement
  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <RefreshCw className='h-8 w-8 animate-spin mx-auto mb-4 text-blue-600' />
          <p className='text-gray-600'>Vérification des permissions...</p>
        </div>
      </div>
    )
  }

  // Utilisateur non connecté
  if (!isAuthenticated) {
    if (redirectTo) {
      router.push(redirectTo)
      return null
    }

    if (fallback) return <>{fallback}</>

    return (
      <div className='container mx-auto px-4 py-8'>
        <Card className='max-w-md mx-auto'>
          <CardHeader className='text-center'>
            <Lock className='h-12 w-12 mx-auto text-gray-400 mb-4' />
            <CardTitle>Connexion Requise</CardTitle>
            <CardDescription>
              Vous devez être connecté pour accéder à cette page
            </CardDescription>
          </CardHeader>
          <CardContent className='text-center'>
            <Button
              onClick={() => router.push('/auth/signin')}
              className='w-full'
            >
              Se Connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Vérification des rôles
  const hasAccess = checkRoleAccess(userRole, allowedRoles, requiredRole)

  if (!hasAccess) {
    if (fallback) return <>{fallback}</>

    const targetRole = requiredRole || allowedRoles[allowedRoles.length - 1]

    return (
      <div className='container mx-auto px-4 py-8'>
        <Card className='max-w-md mx-auto'>
          <CardHeader className='text-center'>
            <Shield className='h-12 w-12 mx-auto text-red-400 mb-4' />
            <CardTitle>Accès Restreint</CardTitle>
            <CardDescription>
              {getRoleMessage(targetRole, userRole)}
            </CardDescription>
          </CardHeader>
          <CardContent className='text-center space-y-4'>
            {targetRole !== 'admin' && (
              <Button
                onClick={() => router.push(`/pricing?upgrade=${targetRole}`)}
                className='w-full'
              >
                {getRoleIcon(targetRole)}
                Passer à {getRoleLabel(targetRole)}
              </Button>
            )}
            <Button
              variant='outline'
              onClick={() => router.push('/dashboard')}
              className='w-full'
            >
              Retour au Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

// Fonction pour vérifier l'accès selon le rôle
function checkRoleAccess (
  userRole: string,
  allowedRoles: string[],
  requiredRole?: string
): boolean {
  // Si allowedRoles est spécifié, vérifier si le rôle utilisateur est dans la liste
  if (allowedRoles.length > 0) {
    return allowedRoles.includes(userRole)
  }

  // Sinon utiliser la hiérarchie des rôles
  if (requiredRole) {
    const roleHierarchy = {
      guest: 0,
      simple: 1,
      user: 1,
      premium: 2,
      agent: 3,
      admin: 4
    }

    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0
    const requiredLevel =
      roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0

    return userLevel >= requiredLevel
  }

  return true
}

// Messages selon le rôle requis
function getRoleMessage (requiredRole: string, userRole: string): string {
  const messages = {
    admin: 'Cette page est réservée aux administrateurs.',
    agent: `Vous devez être agent ou administrateur. Votre rôle actuel : ${userRole}`,
    premium: `Vous devez avoir un compte Premium ou supérieur. Votre rôle actuel : ${userRole}`,
    simple: 'Vous devez être connecté pour accéder à cette page.',
    user: 'Vous devez être connecté pour accéder à cette page.'
  }

  return messages[requiredRole as keyof typeof messages] || 'Accès non autorisé'
}

// Labels des rôles
function getRoleLabel (role: string): string {
  const labels = {
    premium: 'Premium',
    agent: 'Agent',
    admin: 'Admin',
    simple: 'Utilisateur',
    user: 'Utilisateur'
  }

  return labels[role as keyof typeof labels] || role
}

// Icônes des rôles
function getRoleIcon (role: string) {
  const icons = {
    premium: <Star className='h-4 w-4 mr-2' />,
    agent: <Crown className='h-4 w-4 mr-2' />,
    admin: <Shield className='h-4 w-4 mr-2' />
  }

  return icons[role as keyof typeof icons] || null
}
