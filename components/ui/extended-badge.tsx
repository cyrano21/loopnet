import React from 'react'
import { badgeVariants } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Type étendu pour inclure explicitement les enfants
export interface ExtendedBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  children?: React.ReactNode
}

/**
 * Badge étendu qui accepte explicitement des enfants
 * Ce composant résout les problèmes de typage avec React 19
 * et le composant Badge d'origine dans l'application LoopNet
 */
export function ExtendedBadge ({
  className,
  variant = 'default',
  children,
  ...props
}: ExtendedBadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </div>
  )
}

/**
 * Solution alternative simple sous forme de fonction pour créer un badge
 * sans avoir à gérer les problèmes de typage
 */
export function createBadge (
  text: string,
  variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default',
  className?: string
) {
  return <div className={cn(badgeVariants({ variant }), className)}>{text}</div>
}

// Pour l'utiliser:
// import { ExtendedBadge, createBadge } from '@/components/ui/extended-badge';
// <ExtendedBadge>Text</ExtendedBadge>
// ou
// {createBadge('Agent')}
