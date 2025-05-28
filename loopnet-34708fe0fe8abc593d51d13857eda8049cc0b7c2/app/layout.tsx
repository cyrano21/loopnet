import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { NotificationProvider } from "@/components/notification-provider"
import { ComparisonProvider } from "@/components/comparison-provider"
import Navigation from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <NotificationProvider>
              <ComparisonProvider>
                <Navigation />
                {children}
                <Toaster />
              </ComparisonProvider>
            </NotificationProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
