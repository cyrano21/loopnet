"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { signIn } from "next-auth/react"
import { X, Mail } from "lucide-react"
import Image from "next/image"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSignIn = async () => {
    if (!email) return

    setIsLoading(true)
    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/dashboard",
      })

      if (result?.ok) {
        onSuccess?.()
        onClose()
      }
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = async (provider: string) => {
    setIsLoading(true)
    try {
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: "/dashboard",
      })

      if (result?.ok) {
        onSuccess?.()
        onClose()
      }
    } catch (error) {
      console.error("Social sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Log In / Sign Up</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email Section */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email*
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            onClick={handleEmailSignIn}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={!email || isLoading}
          >
            {isLoading ? "Connecting..." : "Continue"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">OR</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialSignIn("google")}
              disabled={isLoading}
            >
              <Image
                src="/placeholder.svg?height=20&width=20&text=G"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              Connect with Google
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialSignIn("facebook")}
              disabled={isLoading}
            >
              <div className="w-5 h-5 bg-blue-600 rounded mr-2 flex items-center justify-center">
                <span className="text-white text-xs font-bold">f</span>
              </div>
              Connect with Facebook
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialSignIn("linkedin")}
              disabled={isLoading}
            >
              <div className="w-5 h-5 bg-blue-700 rounded mr-2 flex items-center justify-center">
                <span className="text-white text-xs font-bold">in</span>
              </div>
              Connect with LinkedIn
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
