"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "../components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form"
import { Input } from "../components/ui/input"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Textarea } from "../components/ui/textarea"
import { useToast } from "../components/ui/use-toast"
import { api } from "../lib/api"
import { useAuth } from "../contexts/AuthContext"

const formSchema = z.object({
  paymentMethod: z.enum(["bkash", "nagad", "rocket", "other"], {
    required_error: "Please select a payment method",
  }),
  transactionId: z.string().optional(),
  accountNumber: z.string().min(5, {
    message: "Account/phone number must be at least 5 characters",
  }),
  notes: z.string().optional(),
})

interface PaymentFormProps {
  itemId: string
  itemType: string
  amount: number
  itemName?: string
  onSuccess?: () => void
}

export function PaymentForm({ itemId, itemType, amount, itemName, onSuccess }: PaymentFormProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: "bkash",
      transactionId: "",
      accountNumber: "",
      notes: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to make a payment",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const paymentData = {
        itemId: itemId,
        itemType: itemType,
        amount: amount,
        paymentMethod: values.paymentMethod,
        transactionId: values.transactionId || "N/A",
        accountNumber: values.accountNumber,
        notes: values.notes || "",
      }

      await api.post("/payments", paymentData)

      toast({
        title: "Payment submitted successfully",
        description: "Your payment is being processed and will be approved soon.",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Payment Method</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="bkash" />
                    </FormControl>
                    <FormLabel className="font-normal">bKash</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="nagad" />
                    </FormControl>
                    <FormLabel className="font-normal">Nagad</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="rocket" />
                    </FormControl>
                    <FormLabel className="font-normal">Rocket</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="other" />
                    </FormControl>
                    <FormLabel className="font-normal">Other</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account/Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter the number you used for payment" {...field} />
              </FormControl>
              <FormDescription>Enter the account or phone number you used for payment</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transactionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction ID (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter transaction ID if available" {...field} />
              </FormControl>
              <FormDescription>If you have a transaction ID from your payment receipt, enter it here</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional information about your payment"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Submit Payment"}
        </Button>
      </form>
    </Form>
  )
}

