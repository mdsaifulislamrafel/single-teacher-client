"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../components/ui/avatar"
import { Badge } from "../../../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs"
import { userApi } from "../../../../../lib/api"
import { useToast } from "../../../../../components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../../components/ui/alert-dialog"
import { BookOpen, FileText, Ban, CheckCircle, Trash } from "lucide-react"

export default function UserDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [pdfs, setPdfs] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return

      try {
        setLoading(true)

        // Fetch user details
        const userResponse = await userApi.getById(id as string)
        setUser(userResponse.data)

        // Fetch user courses
        const coursesResponse = await userApi.getCourses(id as string)
        setCourses(coursesResponse.data)

        // Fetch user PDFs
        const pdfsResponse = await userApi.getPDFs(id as string)
        setPdfs(pdfsResponse.data)

        // Fetch user payments
        const paymentsResponse = await userApi.getPayments(id as string)
        setPayments(paymentsResponse.data)
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [id, toast])

  const handleToggleStatus = async () => {
    if (!user) return

    const newStatus = user.status === "active" ? "inactive" : "active"

    try {
      await userApi.update(id as string, { status: newStatus })

      // Update local state
      setUser({ ...user, status: newStatus })

      toast({
        title: `User ${newStatus}`,
        description: `The user has been ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
      })
    } catch (error) {
      console.error("Error updating user status:", error)
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async () => {
    try {
      await userApi.delete(id as string)

      toast({
        title: "User deleted",
        description: "The user has been deleted successfully",
      })

      router.push("/admin/users")
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-2xl font-semibold mb-2">User Not Found</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          The user you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={() => router.push("/admin/users")}>Back to Users</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Details</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleToggleStatus}>
            {user.status === "active" ? (
              <>
                <Ban className="mr-2 h-4 w-4" />
                Deactivate User
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Activate User
              </>
            )}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete User
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the user account and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>View and manage user information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <Badge variant={user.status === "active" ? "default" : "secondary"}>
                {user.status === "active" ? "Active" : "Inactive"}
              </Badge>
              <Badge variant={user.role === "admin" ? "outline" : "secondary"}>
                {user.role === "admin" ? "Admin" : "User"}
              </Badge>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p className="text-base">{user.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p className="text-base">{user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">User ID</h3>
                  <p className="text-base">{user._id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Join Date</h3>
                  <p className="text-base">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="pdfs">PDFs</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        <TabsContent value="courses" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
              <CardDescription>Courses this user has purchased.</CardDescription>
            </CardHeader>
            <CardContent>
              {courses.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">This user hasn't purchased any courses yet.</p>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course._id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {course.subcategory.category.name} - {course.subcategory.name}
                          </p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span
                              className={`mr-2 rounded-full px-2 py-0.5 text-xs ${
                                course.isCompleted
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                              }`}
                            >
                              {course.isCompleted ? "Completed" : "In Progress"}
                            </span>
                            <span>Last accessed: {new Date(course.lastAccessedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pdfs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchased PDFs</CardTitle>
              <CardDescription>PDFs this user has purchased.</CardDescription>
            </CardHeader>
            <CardContent>
              {pdfs.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">This user hasn't purchased any PDFs yet.</p>
              ) : (
                <div className="space-y-4">
                  {pdfs.map((pdf) => (
                    <div
                      key={pdf._id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{pdf.item.title}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span
                              className={`mr-2 rounded-full px-2 py-0.5 text-xs ${
                                pdf.status === "approved"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                              }`}
                            >
                              {pdf.status === "approved" ? "Available" : "Pending Approval"}
                            </span>
                            <span>Purchased: {new Date(pdf.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>All payments made by this user.</CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">This user hasn't made any payments yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">ID</th>
                        <th className="text-left py-3 px-2">Item</th>
                        <th className="text-left py-3 px-2">Type</th>
                        <th className="text-left py-3 px-2">Amount</th>
                        <th className="text-left py-3 px-2">Status</th>
                        <th className="text-left py-3 px-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment._id} className="border-b">
                          <td className="py-3 px-2">{payment._id.substring(0, 8)}</td>
                          <td className="py-3 px-2">{payment.item.title}</td>
                          <td className="py-3 px-2">
                            <Badge variant="outline">{payment.itemType === "course" ? "Course" : "PDF"}</Badge>
                          </td>
                          <td className="py-3 px-2">৳{payment.amount}</td>
                          <td className="py-3 px-2">
                            <Badge
                              variant={
                                payment.status === "approved"
                                  ? "default"
                                  : payment.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">{new Date(payment.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

