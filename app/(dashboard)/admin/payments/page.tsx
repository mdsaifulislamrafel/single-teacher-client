"use client"

import { useState, useEffect } from "react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Separator } from "../../../../components/ui/separator"
import { useToast } from "../../../../components/ui/use-toast"
import { api } from "../../../../lib/api"
import { useAuth } from "../../../../contexts/AuthContext"
import { Check, X, AlertCircle } from "lucide-react"

export default function AdminPaymentsPage() {
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    // Redirect if not admin
    if (isAuthenticated && user && user.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page",
        variant: "destructive",
      })
      window.location.href = "/dashboard"
      return
    }

    const fetchPayments = async () => {
      try {
        const response = await api.get("/payments")
        console.log("Payments response:", response)

        // Handle different response formats
        let paymentsData = []
        if (Array.isArray(response)) {
          paymentsData = response
        } else if (response && typeof response === "object") {
          if (Array.isArray(response.payments)) {
            paymentsData = response.payments
          } else if (Array.isArray(response.data)) {
            paymentsData = response.data
          }
        }

        setPayments(paymentsData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching payments:", error)
        toast({
          title: "Error",
          description: "Failed to load payments",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    if (isAuthenticated && user && user.role === "admin") {
      fetchPayments()
    }
  }, [user, isAuthenticated, toast])

  const handleApprove = async (paymentId: string) => {
    setProcessingId(paymentId)
    try {
      const response = await api.put(`/payments/${paymentId}/approve`)

      if (response && (response.success || response._id)) {
        toast({
          title: "Payment Approved",
          description: "The payment has been successfully approved",
        })

        // Update the payment status in the list
        setPayments(
          payments.map((payment) => (payment._id === paymentId ? { ...payment, status: "approved" } : payment)),
        )
      } else {
        throw new Error("Failed to approve payment")
      }
    } catch (error) {
      console.error("Error approving payment:", error)
      toast({
        title: "Error",
        description: "Failed to approve payment",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (paymentId: string) => {
    setProcessingId(paymentId)
    try {
      const response = await api.put(`/payments/${paymentId}/reject`)

      if (response && (response.success || response._id)) {
        toast({
          title: "Payment Rejected",
          description: "The payment has been rejected",
        })

        // Update the payment status in the list
        setPayments(
          payments.map((payment) => (payment._id === paymentId ? { ...payment, status: "rejected" } : payment)),
        )
      } else {
        throw new Error("Failed to reject payment")
      }
    } catch (error) {
      console.error("Error rejecting payment:", error)
      toast({
        title: "Error",
        description: "Failed to reject payment",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            Pending
          </Badge>
        )
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-6">Payment Management</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Payment Management</h1>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No payments found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment._id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{payment.user?.name || "Unknown User"}</CardTitle>
                    <CardDescription>
                      {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "Unknown date"}
                    </CardDescription>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Payment Details</h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span>৳{payment.amount?.toFixed(2) || "0.00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Method</span>
                        <span className="capitalize">{payment.paymentMethod || "Unknown"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transaction ID</span>
                        <span>{payment.transactionId || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone</span>
                        <span>{payment.phoneNumber || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium">Item Details</h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type</span>
                        <span className="capitalize">{payment.type || "Unknown"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Item</span>
                        <span>{payment.item?.name || "Unknown item"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {payment.status === "pending" && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(payment._id)}
                        disabled={processingId === payment._id}
                      >
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(payment._id)}
                        disabled={processingId === payment._id}
                      >
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

