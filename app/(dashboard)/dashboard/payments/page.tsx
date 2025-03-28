"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { CheckCircle, XCircle, Clock, FileText, BookOpen, RefreshCcw } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { Badge } from "../../../../components/ui/badge"
import { useToast } from "../../../../components/ui/use-toast"
import { api } from "../../../../lib/api"
import { Skeleton } from "../../../../components/ui/skeleton"
import Link from "next/link"

interface Payment {
  _id: string
  item: {
    _id: string
    name?: string
    title?: string
  }
  itemType: "course" | "pdf"
  amount: number
  paymentMethod: string
  transactionId: string
  accountNumber: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export default function UserPaymentsPage() {
  const { toast } = useToast()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const data = await api.get("/payments/user")
      setPayments(data)
    } catch (error) {
      console.error("Error fetching payments:", error)
      toast({
        title: "Error",
        description: "Failed to load your payments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" /> Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" /> Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
    }
  }

  const getTypeIcon = (type: string) => {
    return type === "course" ? (
      <BookOpen className="h-4 w-4 text-blue-500" />
    ) : (
      <FileText className="h-4 w-4 text-purple-500" />
    )
  }

  const getItemName = (payment: Payment) => {
    if (payment.itemType === "course" && payment.item?.name) {
      return payment.item.name
    } else if (payment.itemType === "pdf" && payment.item?.title) {
      return payment.item.title
    }
    return "Unknown Item"
  }

  const getItemLink = (payment: Payment) => {
    if (payment.status !== "approved") {
      return null
    }

    if (payment.itemType === "course") {
      return `/courses/${payment.item._id}`
    } else if (payment.itemType === "pdf") {
      return `/pdfs/${payment.item._id}`
    }

    return null
  }

  if (loading) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-6">My Payments</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md">
                <div className="p-4">
                  <div className="grid grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-6" />
                    ))}
                  </div>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-t p-4">
                    <div className="grid grid-cols-5 gap-4">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <Skeleton key={j} className="h-6" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Payments</h1>
        <Button variant="outline" size="sm" onClick={fetchPayments}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>View all your payment submissions and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">You haven't made any payments yet</p>
              <Button asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => {
                    const itemLink = getItemLink(payment)

                    return (
                      <TableRow key={payment._id}>
                        <TableCell>
                          <div className="flex items-center">
                            {getTypeIcon(payment.itemType)}
                            <span className="ml-2">
                              {itemLink ? (
                                <Link href={itemLink} className="hover:underline">
                                  {getItemName(payment)}
                                </Link>
                              ) : (
                                getItemName(payment)
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>${payment.amount.toFixed(2)}</TableCell>
                        <TableCell className="capitalize">{payment.paymentMethod}</TableCell>
                        <TableCell>{format(new Date(payment.createdAt), "MMM d, yyyy")}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

