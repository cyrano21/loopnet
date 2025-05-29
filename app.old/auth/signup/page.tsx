'use client'

import type React from 'react'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
import { Building, Mail, Lock, User, Chrome } from 'lucide-react'

export default function SignUp () {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      if (response.ok) {
        // Auto sign in after successful registration
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false
        })

        if (result?.ok) {
          router.push('/onboarding')
        }
      } else {
        const data = await response.json()
        setError(data.message || 'Une erreur est survenue')
      }
    } catch (error) {
      setError('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/onboarding' })
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
          <CardTitle className='text-2xl text-center'>
            Créer un compte
          </CardTitle>
          <CardDescription className='text-center'>
            Rejoignez la plus grande plateforme immobilière commerciale
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
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
              <Label htmlFor='name'>Nom complet</Label>
              <div className='relative'>
                <User className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input
                  id='name'
                  type='text'
                  placeholder='Jean Dupont'
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className='pl-10'
                  required
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input
                  id='email'
                  type='email'
                  placeholder='votre@email.com'
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, email: e.target.value })
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
                  value={formData.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className='pl-10'
                  required
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirmer le mot de passe</Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input
                  id='confirmPassword'
                  type='password'
                  placeholder='••••••••'
                  value={formData.confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value
                    })
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
              {isLoading ? 'Création...' : 'Créer mon compte'}
            </Button>
          </form>

          <div className='text-center text-sm'>
            <span className='text-gray-600'>Déjà un compte ? </span>
            <Link href='/auth/signin' className='text-blue-600 hover:underline'>
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
