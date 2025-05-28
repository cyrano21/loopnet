import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Routes publiques - pas de protection
    const publicRoutes = [
      "/",
      "/properties",
      "/professionals",
      "/news",
      "/pricing",
      "/cre-explained",
      "/auth/signin",
      "/auth/signup",
      "/auth/error",
    ]

    // Vérifier si c'est une route publique
    const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))

    // Laisser passer les routes publiques et API
    if (isPublicRoute || pathname.startsWith("/api/")) {
      return NextResponse.next()
    }

    // Si pas de token pour les routes protégées, rediriger vers signin
    if (!token) {
      const signInUrl = new URL("/auth/signin", req.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }

    const userRole = (token.role as string) || "user"

    // Protection des routes admin
    if (pathname.startsWith("/admin")) {
      if (userRole !== "admin") {
        console.log(`🚫 Accès admin refusé pour ${token.email} (rôle: ${userRole})`)
        return NextResponse.redirect(new URL("/dashboard?error=access-denied", req.url))
      }
    }

    // Protection des routes agent
    if (
      pathname.startsWith("/agent-dashboard") ||
      pathname.startsWith("/leads") ||
      pathname.startsWith("/commission-tracker")
    ) {
      if (!["admin", "agent"].includes(userRole)) {
        console.log(`🚫 Accès agent refusé pour ${token.email} (rôle: ${userRole})`)
        return NextResponse.redirect(new URL("/pricing?upgrade=agent", req.url))
      }
    }

    // Protection des routes premium
    if (
      pathname.startsWith("/analytics") ||
      pathname.startsWith("/ai-assistant") ||
      pathname.startsWith("/property-management")
    ) {
      if (!["admin", "agent", "premium"].includes(userRole)) {
        console.log(`🚫 Accès premium refusé pour ${token.email} (rôle: ${userRole})`)
        return NextResponse.redirect(new URL("/pricing?upgrade=premium", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Routes publiques - toujours autorisées
        const publicRoutes = [
          "/",
          "/properties",
          "/professionals",
          "/news",
          "/pricing",
          "/cre-explained",
          "/auth",
          "/api/auth",
          "/api/properties",
          "/api/professionals",
          "/api/news",
        ]

        const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))

        if (isPublicRoute) {
          return true
        }

        // Routes protégées nécessitent une authentification
        return !!token
      },
    },
  },
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
