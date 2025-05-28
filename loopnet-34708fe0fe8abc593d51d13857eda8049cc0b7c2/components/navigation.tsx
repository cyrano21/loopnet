"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Menu,
  X,
  User,
  LogOut,
  Heart,
  Building,
  Shield,
  Database,
  BarChart3,
  Users,
  Settings,
  Activity,
  DollarSign,
  Bot,
  TrendingUp,
  Bell,
  FileText,
  Search,
  UserCheck,
  Building2,
  Briefcase,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { RoleSwitcher } from "./role-switcher"
import { useAuth } from "@/hooks/use-auth"

function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()
  const { isAdmin, userRole, isAuthenticated, isLoading } = useAuth()

  // Vérifier si l'utilisateur est vraiment admin (pas en mode test)
  const isRealAdmin = session?.user?.role === "admin"
  const isAgent = ["admin", "agent"].includes(userRole)
  const isPremium = ["admin", "agent", "premium"].includes(userRole)

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
            {isPremium && (
              <Link
                href="/market-data"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-blue-600"
              >
                Marché
              </Link>
            )}
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

            {/* Role Switcher SEULEMENT pour les vrais admins */}
            {isRealAdmin && <RoleSwitcher />}

            {/* Auth Section */}
            {isLoading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link href="/list-property">
                  <Button variant="outline" size="sm">
                    Publier
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                        <AvatarFallback className="text-xs">
                          {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    {/* Profil utilisateur */}
                    <div className="flex items-center justify-start gap-2 p-3">
                      <div className="flex flex-col space-y-1 leading-none">
                        {session?.user?.name && <p className="font-medium text-sm">{session.user.name}</p>}
                        {session?.user?.email && (
                          <p className="w-[200px] truncate text-xs text-muted-foreground">{session.user.email}</p>
                        )}
                        <p className="text-xs text-blue-600 font-medium">Rôle: {userRole}</p>
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    {/* Dashboards */}
                    <DropdownMenuLabel>Dashboards</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard Personnel
                      </Link>
                    </DropdownMenuItem>

                    {isAgent && (
                      <DropdownMenuItem asChild>
                        <Link href="/agent-dashboard" className="flex items-center">
                          <Briefcase className="mr-2 h-4 w-4" />
                          Dashboard Agent
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {isRealAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard" className="flex items-center">
                          <Shield className="mr-2 h-4 w-4" />
                          Dashboard Admin
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    {/* Mes contenus */}
                    <DropdownMenuLabel>Mes Contenus</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href="/my-properties" className="flex items-center">
                        <Building className="mr-2 h-4 w-4" />
                        Mes Propriétés
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favorites" className="flex items-center">
                        <Heart className="mr-2 h-4 w-4" />
                        Favoris
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/notifications" className="flex items-center">
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                      </Link>
                    </DropdownMenuItem>

                    {/* Fonctionnalités Premium */}
                    {isPremium && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Fonctionnalités Premium</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href="/analytics" className="flex items-center">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Analytics
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/ai-assistant" className="flex items-center">
                            <Bot className="mr-2 h-4 w-4" />
                            Assistant IA
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/property-management" className="flex items-center">
                            <Building2 className="mr-2 h-4 w-4" />
                            Gestion Propriétés
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {/* Fonctionnalités Agent */}
                    {isAgent && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Outils Agent</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href="/leads" className="flex items-center">
                            <UserCheck className="mr-2 h-4 w-4" />
                            Prospects
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/commission-tracker" className="flex items-center">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Commissions
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/marketing-suite" className="flex items-center">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Marketing
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {/* Fonctionnalités Admin */}
                    {isRealAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Administration</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/users" className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            Gestion Utilisateurs
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/analytics" className="flex items-center">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Analytics Admin
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/settings" className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            Paramètres
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/activity" className="flex items-center">
                            <Activity className="mr-2 h-4 w-4" />
                            Logs d'Activité
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/scraping" className="flex items-center">
                            <Search className="mr-2 h-4 w-4" />
                            Scraping
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/seed-data" className="flex items-center">
                            <Database className="mr-2 h-4 w-4" />
                            Seed Data
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/data-import" className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            Import Données
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/create-admin-prod" className="flex items-center">
                            <UserCheck className="mr-2 h-4 w-4" />
                            Créer Admin Prod
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onSelect={() => signOut({ callbackUrl: "/" })}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Se déconnecter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
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
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            {isRealAdmin && <RoleSwitcher />}
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
          <div className="space-y-1 px-4 pb-3 pt-2 max-h-96 overflow-y-auto">
            {/* Navigation publique */}
            <div className="space-y-1">
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Navigation
              </p>
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
            </div>

            {isAuthenticated ? (
              <>
                {/* Profil utilisateur mobile */}
                <div className="border-t pt-4 pb-3">
                  <div className="flex items-center px-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                      <AvatarFallback>{session?.user?.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <div className="text-base font-medium text-foreground">{session?.user?.name}</div>
                      <div className="text-sm text-muted-foreground">{session?.user?.email}</div>
                      <div className="text-xs text-blue-600 font-medium">Rôle: {userRole}</div>
                    </div>
                  </div>
                </div>

                {/* Dashboards */}
                <div className="space-y-1">
                  <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Dashboards
                  </p>
                  <Link
                    href="/dashboard"
                    className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard Personnel
                  </Link>
                  {isAgent && (
                    <Link
                      href="/agent-dashboard"
                      className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard Agent
                    </Link>
                  )}
                  {isRealAdmin && (
                    <Link
                      href="/admin/dashboard"
                      className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard Admin
                    </Link>
                  )}
                </div>

                {/* Mes contenus */}
                <div className="space-y-1">
                  <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Mes Contenus
                  </p>
                  <Link
                    href="/my-properties"
                    className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Mes Propriétés
                  </Link>
                  <Link
                    href="/favorites"
                    className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Favoris
                  </Link>
                  <Link
                    href="/list-property"
                    className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Publier une annonce
                  </Link>
                </div>

                {/* Fonctionnalités Admin */}
                {isRealAdmin && (
                  <div className="space-y-1">
                    <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Administration
                    </p>
                    <Link
                      href="/seed-data"
                      className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      🗄️ Seed Data
                    </Link>
                    <Link
                      href="/admin/users"
                      className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      👥 Utilisateurs
                    </Link>
                    <Link
                      href="/admin/scraping"
                      className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      🔍 Scraping
                    </Link>
                    <Link
                      href="/data-import"
                      className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      📊 Import Données
                    </Link>
                    <Link
                      href="/create-admin-prod"
                      className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      👑 Créer Admin Prod
                    </Link>
                  </div>
                )}

                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/" })
                    setIsOpen(false)
                  }}
                  className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mt-4"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation
export { Navigation }
