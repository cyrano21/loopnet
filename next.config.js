/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com'
      },
      {
        protocol: 'https',
        hostname: 'placehold.co'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      }
    ]
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
