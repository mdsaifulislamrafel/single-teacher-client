"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../../../components/ui/form"
import { Input } from "../../../../../components/ui/input"
import { useAuth } from "../../../../../contexts/AuthContext"
import { userApi } from "../../../../../lib/api"
import { useToast } from "../../../../../components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../components/ui/avatar"

const profileSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    avatar: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }).optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // If any password field is filled, all must be filled
      const { currentPassword, newPassword, confirmPassword } = data
      if (currentPassword || newPassword || confirmPassword) {
        return !!(currentPassword && newPassword && confirmPassword)
      }
      return true
    },
    {
      message: "All password fields are required to change password",
      path: ["currentPassword"],
    },
  )
  .refine(
    (data) => {
      // If new password is provided, it must match confirm password
      if (data.newPassword && data.confirmPassword) {
        return data.newPassword === data.confirmPassword
      }
      return true
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  )

type ProfileFormValues = z.infer<typeof profileSchema>

export default function EditProfilePage() {
  const router = useRouter()
  const { user, updateUserInfo } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      avatar: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        avatar: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }
  }, [user, form])

  async function onSubmit(data: ProfileFormValues) {
    if (!user) return

    setIsLoading(true)

    try {
      // Prepare update data
      const updateData: any = {
        name: data.name,
      }

      if (data.avatar) {
        updateData.avatar = data.avatar
      }

      if (data.currentPassword && data.newPassword) {
        updateData.currentPassword = data.currentPassword
        updateData.newPassword = data.newPassword
      }

      // Update user profile
      const response = await userApi.update(user.id, updateData)

      // Update local user info
      if (updateUserInfo) {
        updateUserInfo({
          ...user,
          name: data.name,
        })
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      // Reset password fields
      form.setValue("currentPassword", "")
      form.setValue("newPassword", "")
      form.setValue("confirmPassword", "")

      // Redirect to profile page
      router.push("/dashboard/profile")
    } catch (error: any) {
      console.error("Failed to update profile:", error)

      // Handle specific error for incorrect current password
      if (error.response?.data?.error === "Current password is incorrect") {
        form.setError("currentPassword", {
          type: "manual",
          message: "Current password is incorrect",
        })
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.error || "Failed to update profile. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Edit Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account profile information.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/avatar.jpg" {...field} />
                    </FormControl>
                    <FormDescription>Enter a URL for your profile picture.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/profile")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

