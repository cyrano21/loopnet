"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { motion } from "framer-motion"
import { AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu as MenuIcon } from "lucide-react"
import { X } from "lucide-react"
import { User } from "lucide-react"
import { LogOut } from "lucide-react"
import { Heart } from "lucide-react"
import { Building } from "lucide-react"
import { Sparkles } from "lucide-react"
import { Zap } from "lucide-react"
import { Star } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()

  const isLoading = status === "loading"

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50 sticky top-0 z-50 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        animate={{
          x: ['-100%', '100%'],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <Building className="h-8 w-8 text-blue-600 transition-all duration-300 group-hover:text-blue-500" />
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="h-3 w-3 text-blue-400" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 -left-1"
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [360, 180, 0],
                    opacity: [0, 0.7, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <Star className="h-2 w-2 text-purple-400" />
                </motion.div>
              </motion.div>
              <motion.span 
                className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0px 0px 8px rgba(59, 130, 246, 0.5)"
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  backgroundPosition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                LoopNet
              </motion.span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/properties"
              className="relative text-muted-foreground hover:text-blue-600 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 group"
            >
              Propriétés
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2"></span>
            </Link>
            <Link
              href="/professionals"
              className="relative text-muted-foreground hover:text-blue-600 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 group"
            >
              Professionnels
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2"></span>
            </Link>
            <Link
              href="/market-data"
              className="relative text-muted-foreground hover:text-blue-600 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 group"
            >
              Données Marché
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2"></span>
            </Link>
            <Link
              href="/cre-explained"
              className="relative text-muted-foreground hover:text-blue-600 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 group"
            >
              CRE Expliqué
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2"></span>
            </Link>
            <Link
              href="/tools"
              className="relative text-muted-foreground hover:text-blue-600 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 group"
            >
              Outils
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2"></span>
            </Link>
            <Link
              href="/pricing"
              className="relative text-muted-foreground hover:text-blue-600 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 group"
            >
              Abonnements
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2"></span>
            </Link>

            {/* Theme Toggle */}
            <div className="ml-4 pl-4 border-l border-border/50">
              <ThemeToggle />
            </div>

            {/* Auth Section */}
            {isLoading ? (
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link href="/list-property">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Publier une annonce
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-blue-500/20 transition-all duration-300">
                      <Avatar className="h-8 w-8 ring-2 ring-blue-500/20 transition-all duration-300 hover:ring-blue-500/40">
                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {session.user?.name && <p className="font-medium">{session.user.name}</p>}
                        {session.user?.email && (
                          <p className="w-[200px] truncate text-sm text-muted-foreground">{session.user.email}</p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
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
                      <Link href="/agent-dashboard" className="flex items-center">
                        <Building className="mr-2 h-4 w-4" />
                        Dashboard Agent
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Administration
                      </Link>
                    </DropdownMenuItem>
                    {process.env.NODE_ENV === 'development' && (
                      <DropdownMenuItem asChild>
                        <a href="/api/seed" className="flex items-center" target="_blank">
                          <User className="mr-2 h-4 w-4" />
                          Seed Database
                        </a>
                      </DropdownMenuItem>
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30 transition-all duration-300 hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Publier une annonce
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300"
                  >
                    Se connecter
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300 hover:scale-110"
            >
              {isOpen ? 
                <X className="h-6 w-6 transition-transform duration-300 rotate-90" /> : 
                <MenuIcon className="h-6 w-6 transition-transform duration-300" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden animate-in slide-in-from-top-2 duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background/95 backdrop-blur-md border-t border-border/50 shadow-lg">
            <Link
              href="/properties"
              className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all duration-300 hover:translate-x-1"
            >
              Propriétés
            </Link>
            <Link
              href="/professionals"
              className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all duration-300 hover:translate-x-1"
            >
              Professionnels
            </Link>
            <Link
              href="/market-data"
              className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all duration-300 hover:translate-x-1"
            >
              Données Marché
            </Link>
            <Link
              href="/cre-explained"
              className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all duration-300 hover:translate-x-1"
            >
              CRE Expliqué
            </Link>
            <Link
              href="/tools"
              className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all duration-300 hover:translate-x-1"
            >
              Outils
            </Link>

            <div className="border-t border-border/50 pt-3 mt-3">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all duration-300 hover:translate-x-1"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/my-properties"
                    className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all duration-300 hover:translate-x-1"
                  >
                    Mes Propriétés
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="block w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all duration-300 hover:translate-x-1"
                  >
                    Se déconnecter
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all duration-300 hover:translate-x-1"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-4 py-3 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:scale-105 text-center"
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  )
}

export default Navigation

// Export nommé pour la compatibilité
export { Navigation }
