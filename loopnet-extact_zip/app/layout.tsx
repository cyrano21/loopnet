import type React from 'react'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth-provider'
import { Toaster } from '@/components/ui/toaster'
import { NotificationProvider } from '@/components/notification-provider'
import { ComparisonProvider } from '@/components/comparison-provider'
import { SecurityProvider } from '@/components/security-provider'
import { AnalyticsProvider } from '@/components/analytics-provider'
import Navigation from '@/components/navigation'
import { SEOService } from '@/lib/seo/seo-config'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

// Configuration du viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ]
}

// Configuration des métadonnées de base
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  ...SEOService.generateMetadata({
    title: 'Accueil',
    description:
      "Plateforme leader pour l'immobilier commercial. Trouvez, analysez et gérez vos propriétés commerciales avec nos outils professionnels.",
    keywords: [
      'immobilier commercial',
      'bureaux à vendre',
      'locaux commerciaux',
      'investissement immobilier',
      'agents immobiliers',
      'propriétés commerciales',
      'analyse marché immobilier',
      'CRE',
      'commercial real estate'
    ]
  }),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#3b82f6',
    'format-detection': 'telephone=no'
  }
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  // Schema.org pour l'organisation
  const organizationSchema = SEOService.generateSchema('Organization', {})

  return (
    <html lang='fr'>
      <head>
        {/* Schema.org JSON-LD */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />

        {/* Preconnect pour les performances */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />

        {/* DNS Prefetch pour les domaines externes */}
        <link rel='dns-prefetch' href='//js.stripe.com' />
        <link rel='dns-prefetch' href='//api.stripe.com' />

        {/* Protection contre le clickjacking */}
        <meta httpEquiv='X-Frame-Options' content='DENY' />

        {/* Désactiver la traduction automatique */}
        <meta name='google' content='notranslate' />
      </head>
      <body className={inter.className}>
        <SecurityProvider>
          <AnalyticsProvider>
            <AuthProvider>
              <ThemeProvider
                attribute='class'
                defaultTheme='light'
                enableSystem
              >
                <NotificationProvider>
                  <ComparisonProvider>
                    <Suspense
                      fallback={<div className='h-16 bg-background border-b' />}
                    >
                      <Navigation />
                    </Suspense>
                    <main role='main'>{children}</main>
                    <Toaster />
                  </ComparisonProvider>
                </NotificationProvider>
              </ThemeProvider>
            </AuthProvider>
          </AnalyticsProvider>
        </SecurityProvider>

        {/* Script de protection en fin de body - uniquement en production */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Protection basique contre l'inspection
                (function() {
                  'use strict';
                  
                  // Désactiver le clic droit
                  document.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    return false;
                  });
                  
                  // Désactiver les raccourcis clavier
                  document.addEventListener('keydown', function(e) {
                    if (e.key === 'F12' || 
                        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
                        (e.ctrlKey && e.key === 'u')) {
                      e.preventDefault();
                      return false;
                    }
                  });
                  
                  // Message de copyright
                  console.log('%c🔒 Code protégé', 'color: red; font-size: 20px; font-weight: bold;');
                  console.log('%c© 2024 LoopNet Clone. Tous droits réservés.', 'color: red; font-size: 14px;');
                })();
              `
            }}
          />
        )}
      </body>
    </html>
  )
}
