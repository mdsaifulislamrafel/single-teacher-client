// // "use client";

// // import { useState, useEffect } from "react";
// // import Link from "next/link";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { useForm } from "react-hook-form";
// // import { z } from "zod";
// // import { Button } from "../../../components/ui/button";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardFooter,
// //   CardHeader,
// //   CardTitle,
// // } from "../../../components/ui/card";
// // import {
// //   Form,
// //   FormControl,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from "../../../components/ui/form";
// // import { Input } from "../../../components/ui/input";
// // import { Separator } from "../../../components/ui/separator";
// // import { useAuth } from "../../../contexts/AuthContext";
// // import { useToast } from "../../../components/ui/use-toast";
// // import Script from "next/script";
// // import { GoogleAuthButton } from "../../../components/google-auth-button";

// // const registerSchema = z
// //   .object({
// //     name: z.string().min(2, { message: "Name must be at least 2 characters" }),
// //     email: z.string().email({ message: "Please enter a valid email address" }),
// //     password: z
// //       .string()
// //       .min(8, { message: "Password must be at least 8 characters" }),
// //     confirmPassword: z.string(),
// //   })
// //   .refine((data) => data.password === data.confirmPassword, {
// //     message: "Passwords do not match",
// //     path: ["confirmPassword"],
// //   });

// // type RegisterFormValues = z.infer<typeof registerSchema>;

// // export default function RegisterPage() {
// //   const { register, googleLogin } = useAuth();
// //   const { toast } = useToast();
// //   const [isLoading, setIsLoading] = useState(false);

// //   const form = useForm<RegisterFormValues>({
// //     resolver: zodResolver(registerSchema),
// //     defaultValues: {
// //       name: "",
// //       email: "",
// //       password: "",
// //       confirmPassword: "",
// //     },
// //   });

// //   async function onSubmit(data: RegisterFormValues) {
// //     setIsLoading(true);

// //     try {
// //       await register(data.name, data.email, data.password);

// //       toast({
// //         title: "Registration successful",
// //         description: "Your account has been created successfully.",
// //       });
// //     } catch (error: any) {
// //       console.error("Registration failed:", error);

// //       toast({
// //         title: "Registration failed",
// //         description: error.response?.data?.error || "Failed to create account",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   }

// //   const handleGoogleLogin = () => {
// //     if (window.google && window.google.accounts) {
// //       window.google.accounts.id.initialize({
// //         client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
// //         callback: async (response: any) => {
// //           try {
// //             setIsLoading(true);
// //             // Decode the JWT token to get user info
// //             const base64Url = response.credential.split(".")[1];
// //             const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
// //             const jsonPayload = decodeURIComponent(
// //               atob(base64)
// //                 .split("")
// //                 .map(
// //                   (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
// //                 )
// //                 .join("")
// //             );

// //             const decodedToken = JSON.parse(jsonPayload);

// //             // Pass the decoded token to our auth context
// //             await googleLogin(decodedToken);

// //             toast({
// //               title: "Registration successful",
// //               description:
// //                 "Your account has been created with Google successfully.",
// //             });
// //           } catch (error: any) {
// //             console.error("Google registration failed:", error);
// //             toast({
// //               title: "Registration failed",
// //               description:
// //                 error.response?.data?.error || "Failed to register with Google",
// //               variant: "destructive",
// //             });
// //           } finally {
// //             setIsLoading(false);
// //           }
// //         },
// //       });

// //       window.google.accounts.id.prompt();
// //     } else {
// //       toast({
// //         title: "Google registration",
// //         description:
// //           "Google authentication is not available. Please try again later.",
// //         variant: "destructive",
// //       });
// //     }
// //   };

// //   useEffect(() => {
// //     // Render the Google button when the component mounts
// //     if (window.google && window.google.accounts) {
// //       window.google.accounts.id.renderButton(
// //         document.getElementById("google-register-button") as HTMLElement,
// //         {
// //           theme: "outline",
// //           size: "large",
// //           width: "100%",
// //         }
// //       );
// //     }
// //   }, []);

// //   return (
// //     <div className="container flex h-screen w-screen flex-col items-center justify-center">
// //       <Card className="w-full max-w-md">
// //         <CardHeader className="space-y-1">
// //           <CardTitle className="text-2xl font-bold">
// //             Create an account
// //           </CardTitle>
// //           <CardDescription>
// //             Enter your information to create an account
// //           </CardDescription>
// //         </CardHeader>
// //         <CardContent>
// //           <Form {...form}>
// //             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
// //               <FormField
// //                 control={form.control}
// //                 name="name"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Name</FormLabel>
// //                     <FormControl>
// //                       <Input placeholder="John Doe" {...field} />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //               <FormField
// //                 control={form.control}
// //                 name="email"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Email</FormLabel>
// //                     <FormControl>
// //                       <Input placeholder="example@example.com" {...field} />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //               <FormField
// //                 control={form.control}
// //                 name="password"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Password</FormLabel>
// //                     <FormControl>
// //                       <Input
// //                         type="password"
// //                         placeholder="********"
// //                         {...field}
// //                       />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //               <FormField
// //                 control={form.control}
// //                 name="confirmPassword"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Confirm Password</FormLabel>
// //                     <FormControl>
// //                       <Input
// //                         type="password"
// //                         placeholder="********"
// //                         {...field}
// //                       />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />
// //               <Button type="submit" className="w-full" disabled={isLoading}>
// //                 {isLoading ? "Creating account..." : "Register"}
// //               </Button>
// //             </form>
// //           </Form>
// //           <div className="mt-4 flex items-center">
// //             <Separator className="flex-1" />
// //             <span className="mx-2 text-xs text-muted-foreground">OR</span>
// //             <Separator className="flex-1" />
// //           </div>
// //           <div className="mt-4">
// //             <GoogleAuthButton />
// //           </div>
// //         </CardContent>
// //         <CardFooter className="flex flex-col">
// //           <p className="text-sm text-muted-foreground">
// //             Already have an account?{" "}
// //             <Link href="/login" className="text-primary hover:underline">
// //               Login
// //             </Link>
// //           </p>
// //         </CardFooter>
// //       </Card>
// //     </div>
// //   );
// // }

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
// import { GoogleAuthButton } from "../../../components/google-auth-button"

// const registerSchema = z
//   .object({
//     name: z.string().min(2, { message: "Name must be at least 2 characters" }),
//     email: z.string().email({ message: "Please enter a valid email address" }),
//     password: z.string().min(8, { message: "Password must be at least 8 characters" }),
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   })

// type RegisterFormValues = z.infer<typeof registerSchema>

// export default function RegisterPage() {
//   const { register, googleLogin } = useAuth()
//   const { toast } = useToast()
//   const [isLoading, setIsLoading] = useState(false)

//   const form = useForm<RegisterFormValues>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     },
//   })

//   async function onSubmit(data: RegisterFormValues) {
//     setIsLoading(true)

//     try {
//       await register(data.name, data.email, data.password)

//       toast({
//         title: "Registration successful",
//         description: "Your account has been created successfully.",
//       })
//     } catch (error: any) {
//       console.error("Registration failed:", error)

//       toast({
//         title: "Registration failed",
//         description: error.response?.data?.error || "Failed to create account",
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
//               title: "Registration successful",
//               description: "Your account has been created with Google successfully.",
//             })
//           } catch (error: any) {
//             console.error("Google registration failed:", error)
//             toast({
//               title: "Registration failed",
//               description: error.response?.data?.error || "Failed to register with Google",
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
//         title: "Google registration",
//         description: "Google authentication is not available. Please try again later.",
//         variant: "destructive",
//       })
//     }
//   }

//   useEffect(() => {
//     // Render the Google button when the component mounts
//     if (window.google && window.google.accounts) {
//       window.google.accounts.id.renderButton(document.getElementById("google-register-button") as HTMLElement, {
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
//           <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
//           <CardDescription>Enter your information to create an account</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="John Doe" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
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
//               <FormField
//                 control={form.control}
//                 name="confirmPassword"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Confirm Password</FormLabel>
//                     <FormControl>
//                       <Input type="password" placeholder="********" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? "Creating account..." : "Register"}
//               </Button>
//             </form>
//           </Form>
//           <div className="mt-4 flex items-center">
//             <Separator className="flex-1" />
//             <span className="mx-2 text-xs text-muted-foreground">OR</span>
//             <Separator className="flex-1" />
//           </div>
//           <div className="mt-4">
//             <GoogleAuthButton mode="register" className="w-full" />
//           </div>
//         </CardContent>
//         <CardFooter className="flex flex-col">
//           <p className="text-sm text-muted-foreground">
//             Already have an account?{" "}
//             <Link href="/login" className="text-primary hover:underline">
//               Login
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

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const result = await register({ name, email, password })

      if (result.success) {
        toast.success("Registration successful")
        // No need to redirect here as it's handled in the AuthContext
      } else {
        toast.error(result.error?.message || "Registration failed. Please try again.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
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
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

