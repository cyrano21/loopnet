/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Configuration pour servir les fichiers statiques
  async rewrites () {
    return [
      {
        source: '/images/:path*',
        destination: '/images/:path*'
      },
      {
        source: '/favicon:path*',
        destination: '/favicon:path*'
      },
      {
        source: '/icons/:path*',
        destination: '/icons/:path*'
      },
      {
        source: '/articles/:slug*',
        destination: '/news/:slug*'
      }
    ]
  },

  // Headers de sécurité
  async headers () {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/favicon:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },

  // Configuration expérimentale
  experimental: {
    // Améliorer les performances
    optimizePackageImports: ['lucide-react']
  },

  // Configuration TypeScript
  typescript: {
    // Permettre le build même avec des erreurs TypeScript en développement
    ignoreBuildErrors: process.env.NODE_ENV === 'development'
  },

  // Configuration ESLint
  eslint: {
    // Permettre le build même avec des erreurs ESLint en développement
    ignoreDuringBuilds: process.env.NODE_ENV === 'development'
  }
}

module.exports = nextConfig
