"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../../../../../components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../../../components/ui/form"
import { Input } from "../../../../../components/ui/input"
import { useAuth } from "../../../../../contexts/AuthContext"
import { paymentApi } from "../../../../../lib/api"
import { useToast } from "../../../../../components/ui/use-toast"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../../../../../components/ui/alert"

const paymentSchema = z.object({
  transactionId: z.string().min(5, { message: "Transaction ID must be at least 5 characters" }),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

interface PaymentFormProps {
  itemId: string
  itemType: "course" | "pdf"
  itemName: string
  price: string
  onSuccess?: () => void
}

export function PaymentForm({ itemId, itemType, itemName, price, onSuccess }: PaymentFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      transactionId: "",
    },
  })

  async function onSubmit(data: PaymentFormValues) {
    if (!user) return

    setIsLoading(true)

    try {
      await paymentApi.create({
        user: user.id,
        item: itemId,
        itemType,
        amount: Number.parseInt(price.replace(/[^0-9]/g, "")), // Remove non-numeric characters
        transactionId: data.transactionId,
      })

      setIsSubmitted(true)

      toast({
        title: "Payment Submitted",
        description: "Your payment is pending approval by an administrator.",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error("Failed to submit payment:", error)
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to submit payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle>Payment Submitted</AlertTitle>
        <AlertDescription>
          Your payment for {itemName} has been submitted and is pending approval. You will be notified once it's
          approved.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Item: {itemName}</h3>
          <p className="text-muted-foreground">Type: {itemType === "course" ? "Course" : "PDF"}</p>
        </div>
        <div className="text-2xl font-bold">{price}</div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Payment Instructions</AlertTitle>
        <AlertDescription>
          <p className="mb-2">Please send the payment to the following mobile banking number:</p>
          <p className="font-medium">bKash: 01XXXXXXXXX</p>
          <p className="mt-2 text-sm">After sending the payment, enter the transaction ID below.</p>
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="transactionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction ID</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., TRX123456789" {...field} />
                </FormControl>
                <FormDescription>Enter the transaction ID you received after making the payment.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Payment"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

