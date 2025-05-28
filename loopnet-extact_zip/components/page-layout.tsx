"use client"

import type { ReactNode } from "react"
import { Navigation } from "@/components/navigation"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface PageLayoutProps {
  children: ReactNode
  title?: string
  showBackButton?: boolean
  className?: string
}

export function PageLayout({ children, title, showBackButton = false, className = "" }: PageLayoutProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header avec breadcrumbs et titre */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Breadcrumbs />
              {title && (
                <div className="flex items-center space-x-4">
                  {showBackButton && (
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-8 px-2">
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Retour
                    </Button>
                  )}
                  <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className={className}>{children}</main>
    </div>
  )
}
