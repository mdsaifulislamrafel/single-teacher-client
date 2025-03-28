// "use client"

// import { useEffect, useState } from "react"
// import { useAuth } from "../contexts/AuthContext"

// declare global {
//   interface Window {
//     google?: {
//       accounts: {
//         id: {
//           initialize: (config: any) => void
//           renderButton: (element: HTMLElement, config: any) => void
//           prompt: () => void
//         }
//       }
//     }
//   }
// }

// export function GoogleAuthButton() {
//   const { googleLogin } = useAuth()
//   const [isLoading, setIsLoading] = useState(false)
//   const [buttonRendered, setButtonRendered] = useState(false)

//   useEffect(() => {
//     // Load the Google Sign-In API script
//     const script = document.createElement("script")
//     script.src = "https://accounts.google.com/gsi/client"
//     script.async = true
//     script.defer = true
//     document.body.appendChild(script)

//     script.onload = () => {
//       if (window.google && !buttonRendered) {
//         window.google.accounts.id.initialize({
//           client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//           callback: handleCredentialResponse,
//         })

//         const buttonDiv = document.getElementById("google-signin-button")
//         if (buttonDiv) {
//           window.google.accounts.id.renderButton(buttonDiv, {
//             theme: "outline",
//             size: "large",
//             width: 320,
//           })
//           setButtonRendered(true)
//         }
//       }
//     }

//     return () => {
//       document.body.removeChild(script)
//     }
//   }, [buttonRendered])

//   const handleCredentialResponse = async (response: any) => {
//     setIsLoading(true)
//     try {
//       // Decode the JWT token to get user info
//       const base64Url = response.credential.split(".")[1]
//       const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split("")
//           .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//           .join(""),
//       )

//       const { name, email, sub } = JSON.parse(jsonPayload)

//       // Call the googleLogin function from AuthContext
//       await googleLogin({ name, email, sub })
//     } catch (error) {
//       console.error("Google authentication error:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="w-full">
//       <div id="google-signin-button" className="flex justify-center"></div>
//       {isLoading && <p className="text-center mt-2">Authenticating...</p>}
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useRouter } from "next/navigation"

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

export function GoogleAuthButton() {
  const { googleAuth } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [buttonRendered, setButtonRendered] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Load the Google Sign-In API script
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.google && !buttonRendered) {
        try {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
          })

          const buttonDiv = document.getElementById("google-signin-button")
          if (buttonDiv) {
            window.google.accounts.id.renderButton(buttonDiv, {
              theme: "outline",
              size: "large",
              width: 320,
            })
            setButtonRendered(true)
          }
        } catch (err) {
          console.error("Error initializing Google Sign-In:", err)
          setError("Failed to initialize Google Sign-In")
        }
      }
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [buttonRendered])

  const handleCredentialResponse = async (response: any) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Google credential response received:", response)

      // Decode the JWT token to get user info
      const base64Url = response.credential.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )

      const { name, email, sub } = JSON.parse(jsonPayload)
      console.log("Decoded Google user data:", { name, email, sub })

      // Call the googleAuth function from AuthContext
      const result = await googleAuth({ name, email, googleId: sub })
      console.log("Google auth result:", result)

      if (result?.success) {
        router.push("/dashboard")
      } else {
        setError("Authentication failed. Please try again.")
      }
    } catch (error) {
      console.error("Google authentication error:", error)
      setError("Authentication failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div id="google-signin-button" className="flex justify-center"></div>
      {isLoading && <p className="text-center mt-2">Authenticating...</p>}
      {error && <p className="text-center mt-2 text-red-500">{error}</p>}
    </div>
  )
}

