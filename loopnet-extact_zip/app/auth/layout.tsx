import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SEOService } from "@/lib/seo/seo-config"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Authentification",
  description: "Connectez-vous ou créez un compte pour accéder à votre espace personnel.",
  keywords: [
    "connexion",
    "inscription",
    "compte utilisateur",
    "authentification",
    "sécurité",
  ],
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
