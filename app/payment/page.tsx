"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Separator } from "../../components/ui/separator"
import { useToast } from "../../components/ui/use-toast"
import { useAuth } from "../../contexts/AuthContext"
import { api } from "../../lib/api"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("bkash")
  const [transactionId, setTransactionId] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  const type = searchParams.get("type")
  const id = searchParams.get("id")
  const name = searchParams.get("name")
  const price = searchParams.get("price")

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to make a payment",
        variant: "destructive",
      })
      router.push("/login?redirect=/payment" + window.location.search)
    }

    if (!type || !id || !name || !price) {
      toast({
        title: "Invalid Payment Request",
        description: "Missing required payment information",
        variant: "destructive",
      })
      router.push("/courses")
    }
  }, [isAuthenticated, type, id, name, price, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!transactionId.trim()) {
      toast({
        title: "Transaction ID Required",
        description: "Please enter your transaction ID",
        variant: "destructive",
      })
      return
    }

    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const paymentData = {
        type,
        itemId: id,
        amount: Number.parseFloat(price || "0"),
        paymentMethod,
        transactionId,
        phoneNumber,
      }

      const response = await api.post("/payments", paymentData)

      if (response && response._id) {
        toast({
          title: "Payment Submitted",
          description: "Your payment has been submitted for verification",
        })

        // Redirect based on payment type
        if (type === "subcategory") {
          router.push(`/courses/${id}`)
        } else {
          router.push("/dashboard")
        }
      } else {
        throw new Error("Payment submission failed")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
          <CardDescription>Complete your payment to access the course</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Order Summary</h3>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Item</span>
                    <span className="font-medium">{name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium">৳{price}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-3">Payment Method</h3>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bkash" id="bkash" />
                    <Label htmlFor="bkash" className="flex items-center">
                      <span>bKash</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nagad" id="nagad" />
                    <Label htmlFor="nagad" className="flex items-center">
                      <span>Nagad</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rocket" id="rocket" />
                    <Label htmlFor="rocket" className="flex items-center">
                      <span>Rocket</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="01XXXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transactionId">Transaction ID</Label>
                  <Input
                    id="transactionId"
                    placeholder="Enter transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm">
                  <strong>Payment Instructions:</strong>
                </p>
                <ol className="text-sm mt-2 space-y-1 list-decimal list-inside">
                  <li>
                    Send ৳{price} to{" "}
                    {paymentMethod === "bkash"
                      ? "01XXXXXXXXX"
                      : paymentMethod === "nagad"
                        ? "01XXXXXXXXX"
                        : "01XXXXXXXXX"}
                  </li>
                  <li>Enter the phone number you used for payment</li>
                  <li>Enter the transaction ID from your payment confirmation</li>
                  <li>Submit your payment for verification</li>
                </ol>
              </div>
            </div>

            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? "Processing..." : "Submit Payment"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">Your payment will be verified by an admin</p>
        </CardFooter>
      </Card>
    </div>
  )
}

