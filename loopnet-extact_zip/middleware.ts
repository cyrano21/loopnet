import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Chemins publics qui ne nécessitent pas d'authentification
const publicPaths = [
  '/api/auth',
  '/auth',
  '/api/properties',
  '/properties',
  '/api/stats',
  '/api/search',
  '/api/seo',
  '/',
  '/about',
  '/contact',
  '/pricing',
  '/terms',
  '/privacy'
]

// Ressources statiques qui doivent toujours être accessibles
const staticPaths = [
  '/favicon',
  '/images',
  '/icons',
  '/api/auth/signin',
  '/api/auth/callback',
  '/api/auth/session',
  '/api/auth/providers',
  '/api/auth/csrf',
  '/_next',
  '/manifest',
  '/robots.txt',
  '/sitemap.xml'
]

function isPublicPath(pathname: string): boolean {
  return publicPaths.some(path => pathname.startsWith(path))
}

function isStaticPath(pathname: string): boolean {
  return staticPaths.some(path => pathname.startsWith(path))
}

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Toujours autoriser les ressources statiques
    if (isStaticPath(pathname)) {
      return NextResponse.next()
    }

    // Autoriser les chemins publics
    if (isPublicPath(pathname)) {
      return NextResponse.next()
    }

    // Pour les autres routes, l'authentification est gérée par withAuth
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Toujours autoriser les ressources statiques
        if (isStaticPath(pathname)) {
          return true
        }

        // Autoriser les chemins publics
        if (isPublicPath(pathname)) {
          return true
        }

        // Routes admin nécessitent un token et le rôle admin
        if (pathname.startsWith('/admin')) {
          return token?.role === 'admin'
        }

        // Routes agent nécessitent un token et le rôle agent ou admin
        if (pathname.startsWith('/agent')) {
          return token?.role === 'agent' || token?.role === 'admin'
        }

        // Routes dashboard nécessitent juste un token
        if (pathname.startsWith('/dashboard')) {
          return !!token
        }

        // Pour les autres routes protégées, vérifier le token
        return !!token
      },
    },
  }
)

export const config = {
  // Exclure explicitement les ressources statiques du middleware
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (static images)
     * - icons (static icons)
     */
    '/((?!api/auth|_next/static|_next/image|favicon|images|icons|manifest|robots|sitemap).*)',
  ],
}
