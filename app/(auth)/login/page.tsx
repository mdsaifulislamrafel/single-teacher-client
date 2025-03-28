// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { Button } from "../../../components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form"
// import { Input } from "../../../components/ui/input"
// import { Separator } from "../../../components/ui/separator"
// import { useAuth } from "../../../contexts/AuthContext"
// import { useToast } from "../../../components/ui/use-toast"
// import Script from "next/script"
// import { GoogleAuthButton } from "../../../components/google-auth-button"

// const loginSchema = z.object({
//   email: z.string().email({ message: "Please enter a valid email address" }),
//   password: z.string().min(8, { message: "Password must be at least 8 characters" }),
// })

// type LoginFormValues = z.infer<typeof loginSchema>

// export default function LoginPage() {
//   const { login, googleLogin } = useAuth()
//   const { toast } = useToast()
//   const [isLoading, setIsLoading] = useState(false)

//   const form = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   })

//   async function onSubmit(data: LoginFormValues) {
//     setIsLoading(true)

//     try {
//       await login(data.email, data.password)

//       toast({
//         title: "Login successful",
//         description: "You have been logged in successfully.",
//       })
//     } catch (error: any) {
//       console.error("Login failed:", error)

//       toast({
//         title: "Login failed",
//         description: error.response?.data?.error || "Invalid email or password",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleGoogleLogin = () => {
//     if (window.google && window.google.accounts) {
//       window.google.accounts.id.initialize({
//         client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
//         callback: async (response: any) => {
//           try {
//             setIsLoading(true)
//             // Decode the JWT token to get user info
//             const base64Url = response.credential.split(".")[1]
//             const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
//             const jsonPayload = decodeURIComponent(
//               atob(base64)
//                 .split("")
//                 .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//                 .join(""),
//             )

//             const decodedToken = JSON.parse(jsonPayload)

//             // Pass the decoded token to our auth context
//             await googleLogin(decodedToken)

//             toast({
//               title: "Login successful",
//               description: "You have been logged in with Google successfully.",
//             })
//           } catch (error: any) {
//             console.error("Google login failed:", error)
//             toast({
//               title: "Login failed",
//               description: error.response?.data?.error || "Failed to login with Google",
//               variant: "destructive",
//             })
//           } finally {
//             setIsLoading(false)
//           }
//         },
//       })

//       window.google.accounts.id.prompt()
//     } else {
//       toast({
//         title: "Google login",
//         description: "Google authentication is not available. Please try again later.",
//         variant: "destructive",
//       })
//     }
//   }

//   useEffect(() => {
//     // Render the Google button when the component mounts
//     if (window.google && window.google.accounts) {
//       window.google.accounts.id.renderButton(document.getElementById("google-login-button") as HTMLElement, {
//         theme: "outline",
//         size: "large",
//         width: "100%",
//       })
//     }
//   }, [])

//   return (
//     <div className="container flex h-screen w-screen flex-col items-center justify-center">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold">Login</CardTitle>
//           <CardDescription>Enter your email and password to login to your account</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input placeholder="example@example.com" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl>
//                       <Input type="password" placeholder="********" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? "Logging in..." : "Login"}
//               </Button>
//             </form>
//           </Form>
//           <div className="mt-4 flex items-center">
//             <Separator className="flex-1" />
//             <span className="mx-2 text-xs text-muted-foreground">OR</span>
//             <Separator className="flex-1" />
//           </div>
//           <div className="mt-4">
//             <GoogleAuthButton />
//           </div>
//         </CardContent>
//         <CardFooter className="flex flex-col">
//           <p className="text-sm text-muted-foreground">
//             Don&apos;t have an account?{" "}
//             <Link href="/register" className="text-primary hover:underline">
//               Register
//             </Link>
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }

"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../contexts/AuthContext"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { toast } from "sonner"
import { GoogleAuthButton } from "../../../components/google-auth-button"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(email, password)

      if (result.success) {
        toast.success("Login successful")
        // No need to redirect here as it's handled in the AuthContext
      } else {
        toast.error(result.error?.message || "Login failed. Please check your credentials.")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your email and password to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="mt-4 flex items-center">
            <div className="flex-1 border-t" />
            <div className="mx-4 text-sm text-muted-foreground">OR</div>
            <div className="flex-1 border-t" />
          </div>
          <GoogleAuthButton />
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

