'use client'

import { usePermissions } from '@/hooks/use-permissions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Users, Zap, Lock, Camera, Eye, Clock } from 'lucide-react'
import Link from 'next/link'

interface FreemiumListingGuardProps {
  children: React.ReactNode
  action: 'create' | 'contact' | 'view_details'
  currentListingCount?: number
}

export function FreemiumListingGuard ({
  children,
  action,
  currentListingCount = 0
}: FreemiumListingGuardProps) {
  const { userRole } = usePermissions()

  // Limites selon les plans (utilise userRole au lieu de userPlan)
  const limits = {
    guest: {
      maxListings: 0,
      maxPhotos: 0,
      durationDays: 0,
      canViewContacts: false,
      canCreateListings: false
    },
    user: {
      maxListings: 3,
      maxPhotos: 3,
      durationDays: 30,
      canViewContacts: false,
      canCreateListings: true
    },
    premium: {
      maxListings: 15,
      maxPhotos: 10,
      durationDays: 90,
      canViewContacts: true,
      canCreateListings: true
    },
    agent: {
      maxListings: -1, // illimité
      maxPhotos: -1, // illimité
      durationDays: -1, // illimité
      canViewContacts: true,
      canCreateListings: true
    },
    admin: {
      maxListings: -1, // illimité
      maxPhotos: -1, // illimité
      durationDays: -1, // illimité
      canViewContacts: true,
      canCreateListings: true
    }
  } as const

  const currentLimits = limits[userRole as keyof typeof limits] || limits.user

  // Vérifications selon l'action
  switch (action) {
    case 'create':
      if (
        currentLimits.maxListings !== -1 &&
        currentListingCount >= currentLimits.maxListings
      ) {
        return (
          <div className='min-h-screen bg-background flex items-center justify-center'>
            <Card className='max-w-md'>
              <CardHeader className='text-center'>
                <div className='mx-auto mb-4 p-3 bg-yellow-100 rounded-full w-fit'>
                  <Lock className='h-8 w-8 text-yellow-600' />
                </div>
                <CardTitle>Limite d'annonces atteinte</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='text-center text-gray-600'>
                  <p>
                    Votre plan <Badge variant='outline'>{userRole}</Badge>{' '}
                    permet {currentLimits.maxListings} annonces actives.
                  </p>
                  <p className='mt-2'>
                    Vous avez actuellement{' '}
                    <span className='font-bold'>{currentListingCount}</span>{' '}
                    annonces.
                  </p>
                </div>

                <div className='space-y-3'>
                  <div className='border rounded-lg p-3'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <Crown className='h-5 w-5 text-blue-600 mr-2' />
                        <span className='font-medium'>Plan Premium</span>
                      </div>
                      <Badge className='bg-blue-600'>19€/mois</Badge>
                    </div>
                    <ul className='text-sm text-gray-600 mt-2 space-y-1'>
                      <li className='flex items-center'>
                        <Eye className='h-3 w-3 mr-1' />
                        15 annonces actives
                      </li>
                      <li className='flex items-center'>
                        <Camera className='h-3 w-3 mr-1' />
                        10 photos par annonce
                      </li>
                      <li className='flex items-center'>
                        <Clock className='h-3 w-3 mr-1' />
                        90 jours de durée
                      </li>
                    </ul>
                  </div>

                  <div className='border rounded-lg p-3'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <Zap className='h-5 w-5 text-purple-600 mr-2' />
                        <span className='font-medium'>Plan Agent</span>
                      </div>
                      <Badge className='bg-purple-600'>199€/mois</Badge>
                    </div>
                    <ul className='text-sm text-gray-600 mt-2 space-y-1'>
                      <li className='flex items-center'>
                        <Eye className='h-3 w-3 mr-1' />
                        Annonces illimitées
                      </li>
                      <li className='flex items-center'>
                        <Camera className='h-3 w-3 mr-1' />
                        Photos illimitées
                      </li>
                      <li className='flex items-center'>
                        <Users className='h-3 w-3 mr-1' />
                        Contacts directs
                      </li>
                    </ul>
                  </div>
                </div>

                <div className='flex space-x-2'>
                  <Button asChild className='flex-1'>
                    <Link href='/pricing'>Upgrader mon plan</Link>
                  </Button>
                  <Button variant='outline' asChild className='flex-1'>
                    <Link href='/my-properties'>Mes annonces</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      }
      break

    case 'contact':
      if (!currentLimits.canViewContacts) {
        return (
          <Card className='border-yellow-200 bg-yellow-50'>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <Lock className='h-5 w-5 text-yellow-600 mr-2' />
                  <div>
                    <p className='font-medium'>Contacts masqués</p>
                    <p className='text-sm text-gray-600'>
                      Upgrader pour voir les coordonnées
                    </p>
                  </div>
                </div>
                <Button size='sm' asChild>
                  <Link href='/pricing'>Upgrader</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      }
      break
  }

  // Si toutes les vérifications passent, afficher le contenu
  return <>{children}</>
}
