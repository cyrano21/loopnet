'use client'

import type { ReactNode } from 'react'
import { usePermissions } from '@/hooks/use-permissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock, Crown, Star, Zap } from 'lucide-react'

interface AccessRestrictionProps {
  action: string
  children: ReactNode
  fallback?: ReactNode
  showUpgradePrompt?: boolean
  requiredLevel?: 'simple' | 'premium' | 'agent' | 'admin'
}

export function AccessRestriction ({
  action,
  children,
  fallback,
  showUpgradePrompt = true,
  requiredLevel
}: AccessRestrictionProps) {
  const { can, requiresUpgrade, userRole } = usePermissions()

  if (can(action as any)) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  if (!showUpgradePrompt) {
    return null
  }

  // Utiliser le niveau requis spécifié si disponible, sinon utiliser l'approche générique
  const upgradeLevel = requiredLevel || requiresUpgrade(action as any)

  const upgradeInfo = {
    simple: {
      title: 'Compte Utilisateur Requis',
      description:
        'Créez un compte gratuit pour accéder à cette fonctionnalité',
      icon: Star,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      price: 'Gratuit'
    },
    premium: {
      title: 'Compte Premium Requis',
      description: 'Passez au Premium pour débloquer cette fonctionnalité',
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      price: '19€/mois'
    },
    agent: {
      title: 'Compte Agent Requis',
      description: 'Devenez agent pour accéder aux outils professionnels',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      price: '99€/mois'
    }
  }

  const info = upgradeInfo[upgradeLevel as keyof typeof upgradeInfo]

  if (!info) return null

  return (
    <Card className='border-dashed'>
      <CardHeader className='text-center'>
        <div className={`mx-auto p-3 rounded-full ${info.bgColor} w-fit`}>
          <Lock className={`h-6 w-6 ${info.color}`} />
        </div>
        <CardTitle className='flex items-center justify-center gap-2'>
          <info.icon className={`h-5 w-5 ${info.color}`} />
          {info.title}
        </CardTitle>
        <p className='text-gray-600'>{info.description}</p>
      </CardHeader>
      <CardContent className='text-center space-y-4'>
        <Badge variant='secondary' className='text-lg px-4 py-2'>
          {info.price}
        </Badge>
        <div className='space-y-2'>
          <Button className='w-full'>
            Passer au{' '}
            {upgradeLevel === 'simple' ? 'compte gratuit' : upgradeLevel}
          </Button>
          <Button variant='outline' className='w-full'>
            En savoir plus
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
