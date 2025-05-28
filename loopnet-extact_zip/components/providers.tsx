'use client'

import { useEffect, useState } from 'react'
import { AuthProvider } from '@/components/auth-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { NotificationProvider } from '@/components/notification-provider'
import { SessionProvider } from 'next-auth/react'
import { AnalyticsProvider } from '@/components/analytics-provider'

export function Providers ({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Évite le rendu côté serveur avec un thème par défaut
  if (!mounted) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='light'
        enableSystem={false}
      >
        <NotificationProvider>
          <SessionProvider>
            <AnalyticsProvider>{children}</AnalyticsProvider>
          </SessionProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
