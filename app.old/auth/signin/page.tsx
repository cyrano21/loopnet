'use client'

import * as React from 'react'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Building, Mail, Lock, Chrome, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SignIn () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Récupérer les erreurs d'authentification depuis l'URL
    const errorParam = searchParams.get('error')
    if (errorParam) {
      if (errorParam === 'OAuthAccountNotLinked') {
        setError(
          'Un compte existe déjà avec cette adresse e-mail mais avec une méthode de connexion différente. Veuillez utiliser la même méthode que vous avez utilisée précédemment.'
        )
      } else {
        setError(`Erreur d'authentification: ${errorParam}`)
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Email ou mot de passe incorrect')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      setError('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <div className='flex items-center justify-center mb-4'>
            <Building className='h-8 w-8 text-blue-600' />
            <span className='ml-2 text-2xl font-bold text-gray-900'>
              LoopNet
            </span>
          </div>
          <CardTitle className='text-2xl text-center'>Se connecter</CardTitle>
          <CardDescription className='text-center'>
            Connectez-vous à votre compte pour accéder à votre dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            variant='outline'
            className='w-full'
            onClick={handleGoogleSignIn}
          >
            <Chrome className='mr-2 h-4 w-4' />
            Continuer avec Google
          </Button>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white px-2 text-muted-foreground'>Ou</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input
                  id='email'
                  type='email'
                  placeholder='votre@email.com'
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  className='pl-10'
                  required
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Mot de passe</Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input
                  id='password'
                  type='password'
                  placeholder='••••••••'
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  className='pl-10'
                  required
                />
              </div>
            </div>

            {error && (
              <div className='text-red-600 text-sm text-center'>{error}</div>
            )}

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className='text-center text-sm'>
            <span className='text-gray-600'>Pas encore de compte ? </span>
            <Link href='/auth/signup' className='text-blue-600 hover:underline'>
              S'inscrire
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
