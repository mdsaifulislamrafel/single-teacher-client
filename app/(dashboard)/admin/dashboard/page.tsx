"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Users, FileText, BookOpen, Video } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import Link from "next/link"
import { categoryApi, videoApi, pdfApi, userApi, paymentApi } from "../../../../lib/api"
import { useToast } from "../../../../components/ui/use-toast"
import { useAuth } from "../../../../contexts/AuthContext"
import api from "../../../../lib/axios"

interface Payment {
  _id: string
  user: {
    _id: string
    name: string
    email: string
  }
  item: {
    _id: string
    title: string
  }
  amount: number
  status: string
  itemType: string
  transactionId: string
  createdAt: string
}

interface User {
  _id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export default function AdminDashboardPage() {
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [categoryCount, setCategoryCount] = useState(0)
  const [videoCount, setVideoCount] = useState(0)
  const [pdfCount, setPdfCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [recentPayments, setRecentPayments] = useState<Payment[]>([])
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [pendingPayments, setPendingPayments] = useState(0)
  const [approvedPayments, setApprovedPayments] = useState(0)
  const [rejectedPayments, setRejectedPayments] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch categories count
        const categoriesResponse = await categoryApi.getAll()
        if (Array.isArray(categoriesResponse)) {
          setCategoryCount(categoriesResponse.length)
        } else if (categoriesResponse && Array.isArray(categoriesResponse.data)) {
          setCategoryCount(categoriesResponse.data.length)
        } else {
          setCategoryCount(0)
        }

        // Fetch videos count
        const videosResponse = await videoApi.getAll()
        if (Array.isArray(videosResponse)) {
          setVideoCount(videosResponse.length)
        } else if (videosResponse && Array.isArray(videosResponse.data)) {
          setVideoCount(videosResponse.data.length)
        } else {
          setVideoCount(0)
        }

        // Fetch PDFs count
        const pdfsResponse = await pdfApi.getAll()
        if (Array.isArray(pdfsResponse)) {
          setPdfCount(pdfsResponse.length)
        } else if (pdfsResponse && Array.isArray(pdfsResponse.data)) {
          setPdfCount(pdfsResponse.data.length)
        } else {
          setPdfCount(0)
        }

        // Fetch users count
        const usersResponse = await userApi.getAll()
        if (Array.isArray(usersResponse)) {
          setUserCount(usersResponse.length)
        } else if (usersResponse && Array.isArray(usersResponse.data)) {
          setUserCount(usersResponse.data.length)
        } else {
          setUserCount(0)
        }

        // Fetch payments data
        const paymentsResponse = await api.get("/payments")
        let paymentsData = []

        if (Array.isArray(paymentsResponse)) {
          paymentsData = paymentsResponse
        } else if (paymentsResponse && Array.isArray(paymentsResponse.payments)) {
          paymentsData = paymentsResponse.payments
        } else if (paymentsResponse && typeof paymentsResponse === "object") {
          // Try to find an array in the response
          const possiblePayments = Object.values(paymentsResponse).find((val) => Array.isArray(val))
          if (possiblePayments) {
            paymentsData = possiblePayments as any[]
          }
        }

        // Calculate payment stats
        let pendingCount = 0
        let approvedCount = 0
        let rejectedCount = 0
        let totalAmount = 0

        paymentsData.forEach((payment: any) => {
          if (payment.status === "pending") pendingCount++
          if (payment.status === "approved") {
            approvedCount++
            totalAmount += payment.amount || 0
          }
          if (payment.status === "rejected") rejectedCount++
        })

        setPendingPayments(pendingCount)
        setApprovedPayments(approvedCount)
        setRejectedPayments(rejectedCount)
        setTotalRevenue(totalAmount)

        // Set recent payments
        setRecentPayments(paymentsData.slice(0, 5))

        // Set monthly data for charts
        // ... (keep existing chart data logic)

        // Fetch recent users
        const usersData = Array.isArray(usersResponse) ? usersResponse : usersResponse?.data ? usersResponse.data : []
        setRecentUsers(usersData.slice(0, 5))
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, isAdmin, toast])

  // Calculate stats
  const stats = [
    {
      title: "Total Users",
      value: userCount.toString(),
      change: "+12%", // You would calculate this in a real app
      icon: Users,
    },
    {
      title: "Total Categories",
      value: categoryCount.toString(),
      change: "+2",
      icon: BookOpen,
    },
    {
      title: "Total Videos",
      value: videoCount.toString(),
      change: "+6",
      icon: Video,
    },
    {
      title: "Total PDFs",
      value: pdfCount.toString(),
      change: "+4",
      icon: FileText,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleApprovePayment = async (paymentId: string) => {
    try {
      await paymentApi.updateStatus(paymentId, { status: "approved" })

      // Update the UI
      setRecentPayments((prevPayments) =>
        prevPayments.map((payment) => (payment._id === paymentId ? { ...payment, status: "approved" } : payment)),
      )

      toast({
        title: "Payment approved",
        description: "The payment has been approved successfully",
      })
    } catch (error) {
      console.error("Error approving payment:", error)
      toast({
        title: "Error",
        description: "Failed to approve payment",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin/categories/new">
            <Button size="sm">Add Category</Button>
          </Link>
          <Link href="/admin/videos/new">
            <Button size="sm" variant="outline">
              Add Video
            </Button>
          </Link>
          <Link href="/admin/pdfs/new">
            <Button size="sm" variant="outline">
              Add PDF
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList>
          <TabsTrigger value="payments">Recent Payments</TabsTrigger>
          <TabsTrigger value="users">Recent Users</TabsTrigger>
        </TabsList>
        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Approvals</CardTitle>
              <CardDescription>Manage recent payment requests from users.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">ID</th>
                      <th className="text-left py-3 px-2">User</th>
                      <th className="text-left py-3 px-2">Amount</th>
                      <th className="text-left py-3 px-2">Type</th>
                      <th className="text-left py-3 px-2">Item</th>
                      <th className="text-left py-3 px-2">Date</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4">
                          No payments found.
                        </td>
                      </tr>
                    ) : (
                      recentPayments.map((payment) => (
                        <tr key={payment._id} className="border-b">
                          <td className="py-3 px-2">{payment._id.substring(0, 8)}</td>
                          <td className="py-3 px-2">{payment.user.name}</td>
                          <td className="py-3 px-2">৳{payment.amount}</td>
                          <td className="py-3 px-2">{payment.itemType === "course" ? "Course" : "PDF"}</td>
                          <td className="py-3 px-2">{payment.item.title}</td>
                          <td className="py-3 px-2">{new Date(payment.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-2">
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                payment.status === "approved"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                  : payment.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                              }`}
                            >
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            {payment.status === "pending" && (
                              <Button size="sm" variant="outline" onClick={() => handleApprovePayment(payment._id)}>
                                Approve
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>New Users</CardTitle>
              <CardDescription>Recently registered users on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">ID</th>
                      <th className="text-left py-3 px-2">Name</th>
                      <th className="text-left py-3 px-2">Email</th>
                      <th className="text-left py-3 px-2">Join Date</th>
                      <th className="text-left py-3 px-2">Role</th>
                      <th className="text-left py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      recentUsers.map((user) => (
                        <tr key={user._id} className="border-b">
                          <td className="py-3 px-2">{user._id.substring(0, 8)}</td>
                          <td className="py-3 px-2">{user.name}</td>
                          <td className="py-3 px-2">{user.email}</td>
                          <td className="py-3 px-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-2">
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                              }`}
                            >
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <Link href={`/admin/users/${user._id}`}>
                              <Button size="sm" variant="outline">
                                View
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

