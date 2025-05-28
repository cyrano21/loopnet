import { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async authorized({ auth, request }) {
      // Ignore authentication for static files
      const path = request.nextUrl.pathname
      if (
        path.startsWith("/favicon") ||
        path.startsWith("/apple-touch-icon") ||
        path.startsWith("/_next") ||
        path.startsWith("/static")
      ) {
        return true
      }
      return !!auth?.user
    },
  },
} satisfies NextAuthConfig
