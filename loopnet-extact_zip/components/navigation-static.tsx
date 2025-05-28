"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Building } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

function NavigationStatic() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-foreground">LoopNet</span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              href="/properties"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-blue-600"
            >
              Propriétés
            </Link>
            <Link
              href="/professionals"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-blue-600"
            >
              Professionnels
            </Link>
            <Link
              href="/news"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-blue-600"
            >
              Actualités
            </Link>
            <Link
              href="/cre-explained"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-blue-600"
            >
              CRE Expliqué
            </Link>
          </div>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <div className="flex items-center space-x-3">
              <Link href="/list-property">
                <Button variant="outline" size="sm">
                  Publier
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  Se connecter
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">S'inscrire</Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              href="/properties"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Propriétés
            </Link>
            <Link
              href="/professionals"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Professionnels
            </Link>
            <Link
              href="/news"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Actualités
            </Link>
            <Link
              href="/auth/signin"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Se connecter
            </Link>
            <Link
              href="/auth/signup"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              S'inscrire
            </Link>
            <Link
              href="/list-property"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Publier une annonce
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavigationStatic
export { NavigationStatic }
