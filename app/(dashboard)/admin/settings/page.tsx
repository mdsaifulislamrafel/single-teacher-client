"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../../components/ui/form"
import { Input } from "../../../../components/ui/input"
import { Textarea } from "../../../../components/ui/textarea"
import { Switch } from "../../../../components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { useToast } from "../../../../components/ui/use-toast"

const generalSettingsSchema = z.object({
  siteName: z.string().min(2, { message: "Site name must be at least 2 characters" }),
  siteDescription: z.string().min(10, { message: "Site description must be at least 10 characters" }),
  contactEmail: z.string().email({ message: "Please enter a valid email address" }),
  enableRegistration: z.boolean(),
  maintenanceMode: z.boolean(),
})

const paymentSettingsSchema = z.object({
  bkashNumber: z.string().min(11, { message: "bKash number must be at least 11 characters" }),
  nagadNumber: z.string().min(11, { message: "Nagad number must be at least 11 characters" }).optional(),
  rocketNumber: z.string().min(11, { message: "Rocket number must be at least 11 characters" }).optional(),
  paymentInstructions: z.string().min(10, { message: "Payment instructions must be at least 10 characters" }),
})

const emailSettingsSchema = z.object({
  smtpHost: z.string().min(1, { message: "SMTP host is required" }),
  smtpPort: z.coerce.number().int().positive({ message: "SMTP port must be a positive integer" }),
  smtpUser: z.string().min(1, { message: "SMTP username is required" }),
  smtpPassword: z.string().min(1, { message: "SMTP password is required" }),
  fromEmail: z.string().email({ message: "Please enter a valid email address" }),
  fromName: z.string().min(1, { message: "From name is required" }),
})

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>
type PaymentSettingsValues = z.infer<typeof paymentSettingsSchema>
type EmailSettingsValues = z.infer<typeof emailSettingsSchema>

export default function SettingsPage() {
  const { toast } = useToast()
  const [isGeneralLoading, setIsGeneralLoading] = useState(false)
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  const [isEmailLoading, setIsEmailLoading] = useState(false)

  const generalForm = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      siteName: "Learning Platform",
      siteDescription: "A comprehensive learning platform with courses and PDFs",
      contactEmail: "contact@example.com",
      enableRegistration: true,
      maintenanceMode: false,
    },
  })

  const paymentForm = useForm<PaymentSettingsValues>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      bkashNumber: "01XXXXXXXXX",
      nagadNumber: "",
      rocketNumber: "",
      paymentInstructions: "Please send the payment to the bKash number and enter the transaction ID in the form.",
    },
  })

  const emailForm = useForm<EmailSettingsValues>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpHost: "smtp.example.com",
      smtpPort: 587,
      smtpUser: "user@example.com",
      smtpPassword: "password",
      fromEmail: "noreply@example.com",
      fromName: "Learning Platform",
    },
  })

  async function onGeneralSubmit(data: GeneralSettingsValues) {
    setIsGeneralLoading(true)

    try {
      // In a real implementation, you would save the settings to the database
      console.log("General settings:", data)

      toast({
        title: "Settings saved",
        description: "General settings have been saved successfully.",
      })
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneralLoading(false)
    }
  }

  async function onPaymentSubmit(data: PaymentSettingsValues) {
    setIsPaymentLoading(true)

    try {
      // In a real implementation, you would save the settings to the database
      console.log("Payment settings:", data)

      toast({
        title: "Settings saved",
        description: "Payment settings have been saved successfully.",
      })
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPaymentLoading(false)
    }
  }

  async function onEmailSubmit(data: EmailSettingsValues) {
    setIsEmailLoading(true)

    try {
      // In a real implementation, you would save the settings to the database
      console.log("Email settings:", data)

      toast({
        title: "Settings saved",
        description: "Email settings have been saved successfully.",
      })
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEmailLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Platform Settings</h1>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your platform's general settings.</CardDescription>
            </CardHeader>
            <Form {...generalForm}>
              <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={generalForm.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>The name of your learning platform.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={generalForm.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>A brief description of your platform.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={generalForm.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormDescription>The email address users can contact for support.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={generalForm.control}
                    name="enableRegistration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Registration</FormLabel>
                          <FormDescription>Allow new users to register on the platform.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={generalForm.control}
                    name="maintenanceMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Maintenance Mode</FormLabel>
                          <FormDescription>Put the site in maintenance mode. Only admins can access.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isGeneralLoading}>
                    {isGeneralLoading ? "Saving..." : "Save Settings"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        <TabsContent value="payment" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment methods and instructions.</CardDescription>
            </CardHeader>
            <Form {...paymentForm}>
              <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={paymentForm.control}
                    name="bkashNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>bKash Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>The bKash number where users will send payments.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={paymentForm.control}
                    name="nagadNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nagad Number (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>The Nagad number where users will send payments.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={paymentForm.control}
                    name="rocketNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rocket Number (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>The Rocket number where users will send payments.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={paymentForm.control}
                    name="paymentInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Instructions</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>Instructions for users on how to make payments.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isPaymentLoading}>
                    {isPaymentLoading ? "Saving..." : "Save Settings"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        <TabsContent value="email" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email server settings for notifications.</CardDescription>
            </CardHeader>
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={emailForm.control}
                      name="smtpHost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Host</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="smtpPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Port</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={emailForm.control}
                      name="smtpUser"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Username</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="smtpPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={emailForm.control}
                      name="fromEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormDescription>The email address that will appear as the sender.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="fromName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>The name that will appear as the sender.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isEmailLoading}>
                    {isEmailLoading ? "Saving..." : "Save Settings"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

