"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { useAuth } from "../../contexts/AuthContext"
import { toast } from "sonner"
import { cn } from "../../lib/utils"

interface GoogleAuthButtonProps {
  mode: "login" | "register"
  className?: string
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (element: HTMLElement, config: any) => void
          prompt: () => void
        }
      }
    }
  }
}

export function GoogleAuthButton({ mode, className }: GoogleAuthButtonProps) {
  const { googleLogin } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false)

  useEffect(() => {
    // Check if Google script is already loaded
    if (window.google?.accounts) {
      setIsGoogleScriptLoaded(true)
      initializeGoogleButton()
      return
    }

    // Load Google script
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = () => {
      setIsGoogleScriptLoaded(true)
      initializeGoogleButton()
    }
    script.onerror = () => {
      console.error("Failed to load Google script")
      toast.error("Failed to load Google authentication")
    }
    document.body.appendChild(script)

    return () => {
      // Clean up script if component unmounts
      document.body.removeChild(script)
    }
  }, [])

  const initializeGoogleButton = () => {
    if (!window.google || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return

    try {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
      })

      const buttonContainer = document.getElementById("google-button-container")
      if (buttonContainer) {
        window.google.accounts.id.renderButton(buttonContainer, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: mode === "login" ? "signin_with" : "signup_with",
          shape: "rectangular",
          width: "100%",
        })
      }
    } catch (error) {
      console.error("Error initializing Google button:", error)
    }
  }

  const handleGoogleResponse = async (response: any) => {
    setIsLoading(true)
    try {
      // Decode the JWT token to get user info
      const payload = decodeJwtResponse(response.credential)
      await googleLogin(payload)
    } catch (error: any) {
      console.error("Google authentication error:", error)
      // Toast is handled in the googleLogin function
    } finally {
      setIsLoading(false)
    }
  }

  const decodeJwtResponse = (token: string) => {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  }

  const handleManualGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt()
    } else {
      toast.error("Google authentication is not available")
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {isGoogleScriptLoaded ? (
        <div id="google-button-container" className="w-full"></div>
      ) : (
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          className="w-full"
          onClick={handleManualGoogleLogin}
        >
          {isLoading ? "Processing..." : `Continue with Google`}
        </Button>
      )}
    </div>
  )
}

