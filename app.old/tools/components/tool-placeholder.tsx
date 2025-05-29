'use client'

import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft, Construction } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface ToolPlaceholderProps {
  title: string
  description: string
  features: string[]
  comingSoon?: boolean
}

export default function ToolPlaceholder ({
  title,
  description,
  features,
  comingSoon = false
}: ToolPlaceholderProps) {
  return (
    <div className='container mx-auto py-8 max-w-4xl'>
      <div className='flex items-center mb-4'>
        <Link href='/tools'>
          <Button variant='ghost' size='sm'>
            <ChevronLeft className='mr-2 h-4 w-4' />
            Retour aux outils
          </Button>
        </Link>
      </div>

      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2 flex items-center'>
          {title}
          {comingSoon && (
            <span className='ml-3 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full'>
              Bientôt disponible
            </span>
          )}
        </h1>
        <p className='text-muted-foreground'>{description}</p>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center space-x-2'>
            <Construction className='h-6 w-6 text-primary' />
            <CardTitle>Aperçu des fonctionnalités</CardTitle>
          </div>
          <CardDescription>
            Cet outil est en cours de développement et sera disponible
            prochainement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>
              Fonctionnalités principales
            </h3>
            <ul className='list-disc pl-6 space-y-2'>
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <Separator className='my-4' />
            <div className='flex flex-col items-center justify-center py-8'>
              <Construction className='h-16 w-16 text-muted-foreground mb-4' />
              <p className='text-center text-muted-foreground'>
                Cette fonctionnalité est en cours de développement et sera
                disponible prochainement.
              </p>
              <p className='text-center text-muted-foreground mt-2'>
                Restez informé des nouvelles fonctionnalités en consultant
                régulièrement la section outils.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
