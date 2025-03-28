"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authApi } from "../lib/api"
import { useRouter } from "next/navigation"

interface User {
  _id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<any>
  register: (userData: any) => Promise<any>
  logout: () => void
  googleAuth: (googleData: any) => Promise<any>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
  login: async () => null,
  register: async () => null,
  logout: () => {},
  googleAuth: async () => null,
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Compute isAdmin from user role
  const isAdmin = user?.role === "admin"

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setLoading(false)
          return
        }

        const userData = await authApi.getCurrentUser()
        console.log("Current user data:", userData)

        if (userData && userData._id) {
          setUser(userData)
        } else {
          // Clear token if invalid
          localStorage.removeItem("token")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const data = await authApi.login(email, password)

      if (data && data.token) {
        localStorage.setItem("token", data.token)

        // Get user data
        const userData = await authApi.getCurrentUser()
        setUser(userData)

        // Redirect based on role
        if (userData.role === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/dashboard")
        }

        return { success: true, data }
      } else {
        throw new Error("Invalid login response")
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: any) => {
    try {
      setLoading(true)
      const data = await authApi.register(userData)

      if (data && data.token) {
        localStorage.setItem("token", data.token)

        // Get user data after registration
        const userInfo = await authApi.getCurrentUser()
        setUser(userInfo)

        // Redirect to dashboard after registration
        router.push("/dashboard")

        return { success: true, data }
      }

      return { success: true, data }
    } catch (error) {
      console.error("Register error:", error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const googleAuth = async (googleData: any) => {
    try {
      setLoading(true)
      console.log("AuthContext: Processing Google auth with data:", googleData)

      const data = await authApi.googleAuth(googleData)
      console.log("AuthContext: Google auth response:", data)

      if (data && data.token) {
        localStorage.setItem("token", data.token)
        console.log("AuthContext: Token saved to localStorage")

        // Get user data
        const userData = await authApi.getCurrentUser()
        console.log("AuthContext: User data after Google auth:", userData)

        if (userData && userData._id) {
          setUser(userData)

          // Redirect based on role
          if (userData.role === "admin") {
            router.push("/admin/dashboard")
          } else {
            router.push("/dashboard")
          }

          return { success: true, data }
        } else {
          console.error("AuthContext: Invalid user data received after Google auth")
          return { success: false, error: "Invalid user data" }
        }
      } else {
        console.error("AuthContext: Invalid Google auth response - no token")
        return { success: false, error: "Invalid authentication response" }
      }
    } catch (error) {
      console.error("AuthContext: Google auth error:", error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        loading,
        login,
        register,
        logout,
        googleAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

