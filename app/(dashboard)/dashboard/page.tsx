"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { BookOpen, FileText, Clock, CheckCircle } from "lucide-react"

import { useToast } from "../../../components/ui/use-toast"
import Link from "next/link"
import { Button } from "../../../components/ui/button"
import { useAuth } from "../../../contexts/AuthContext"
import { userApi } from "../../../lib/api"

interface UserCourse {
  _id: string
  subcategory: {
    _id: string
    name: string
    category: {
      _id: string
      name: string
    }
  }
  lastAccessedVideo: {
    _id: string
    title: string
  }
  completedVideos: string[]
  isCompleted: boolean
  lastAccessedAt: string
}

interface UserPDF {
  _id: string
  item: {
    _id: string
    title: string
    description: string
    price: number
    fileUrl: string
    downloads: number
  }
  status: string
  createdAt: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<UserCourse[]>([])
  const [pdfs, setPdfs] = useState<UserPDF[]>([])
  const [pendingPayments, setPendingPayments] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        setLoading(true)

        // Fetch user courses
        const coursesResponse = await userApi.getCourses(user.id)
        setCourses(coursesResponse.data)

        // Fetch user PDFs
        const pdfsResponse = await userApi.getPDFs(user.id)
        setPdfs(pdfsResponse.data)

        // Fetch user payments to count pending ones
        const paymentsResponse = await userApi.getPayments(user.id)
        const pendingCount = paymentsResponse.data.filter((payment: any) => payment.status === "pending").length
        setPendingPayments(pendingCount)
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
  }, [user, toast])

  // Calculate stats
  const stats = [
    {
      title: "Courses Purchased",
      value: courses.length.toString(),
      icon: BookOpen,
    },
    {
      title: "PDFs Purchased",
      value: pdfs.length.toString(),
      icon: FileText,
    },
    {
      title: "Pending Approvals",
      value: pendingPayments.toString(),
      icon: Clock,
    },
    {
      title: "Completed Courses",
      value: courses.filter((course) => course.isCompleted).length.toString(),
      icon: CheckCircle,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList>
          <TabsTrigger value="courses">Recent Courses</TabsTrigger>
          <TabsTrigger value="pdfs">Recent PDFs</TabsTrigger>
        </TabsList>
        <TabsContent value="courses" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>View your recent course activity and progress.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't purchased any courses yet.</p>
                    <Link href="/courses">
                      <Button>Browse Courses</Button>
                    </Link>
                  </div>
                ) : (
                  courses.map((course) => (
                    <div
                      key={course._id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
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
                      {!course.isCompleted && (
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${
                                course.completedVideos.length > 0
                                  ? (course.completedVideos.length / (course.completedVideos.length + 5)) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pdfs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>My PDFs</CardTitle>
              <CardDescription>View your purchased PDF resources.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pdfs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't purchased any PDFs yet.</p>
                    <Link href="/pdfs">
                      <Button>Browse PDFs</Button>
                    </Link>
                  </div>
                ) : (
                  pdfs.map((pdf) => (
                    <div
                      key={pdf._id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
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
                          <span>
                            {pdf.status === "approved"
                              ? `Downloaded: ${pdf.item.downloads} times`
                              : "Awaiting approval"}
                          </span>
                        </div>
                      </div>
                      {pdf.status === "approved" && (
                        <Button variant="outline" size="sm" onClick={() => window.open(pdf.item.fileUrl, "_blank")}>
                          Download
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

