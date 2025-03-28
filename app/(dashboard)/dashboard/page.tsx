"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Button } from "../../../components/ui/button"
import { Progress } from "../../../components/ui/progress"
import { Badge } from "../../../components/ui/badge"
import { Clock, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "../../../components/ui/use-toast"
import {api}  from "../../../lib/api"
import Link from "next/link"
import { useAuth } from "../../../contexts/AuthContext"

export default function DashboardPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [pdfs, setPdfs] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's payments
        const paymentsData = await api.get("/payments/user")
        setPayments(paymentsData)

        // Extract course IDs from payments
        const courseIds = paymentsData
          .filter((payment) => payment.itemType === "course" && payment.status === "approved")
          .map((payment) => payment.item._id || payment.item)

        // Fetch course details and progress for each course
        const coursesWithProgress = await Promise.all(
          courseIds.map(async (courseId) => {
            const course = await api.get(`/subcategories/${courseId}`)
            const videos = await api.get(`/subcategories/${courseId}/videos`)

            let progress = null
            try {
              progress = await api.get(`/subcategories/${courseId}/progress`)
            } catch (error) {
              console.error(`Error fetching progress for course ${courseId}:`, error)
            }

            return {
              ...course,
              videos,
              progress,
            }
          }),
        )

        setCourses(coursesWithProgress)

        // Extract PDF IDs from payments
        const pdfIds = paymentsData
          .filter((payment) => payment.itemType === "pdf" && payment.status === "approved")
          .map((payment) => payment.item._id || payment.item)

        // Fetch PDF details for each PDF
        const pdfsData = await Promise.all(
          pdfIds.map(async (pdfId) => {
            const pdf = await api.get(`/pdfs/${pdfId}`)
            return pdf
          }),
        )

        setPdfs(pdfsData)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user, toast])

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex flex-col space-y-4">
          <div className="h-8 w-1/3 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-muted rounded animate-pulse" />
            <div className="h-32 bg-muted rounded animate-pulse" />
            <div className="h-32 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-64 w-full bg-muted rounded animate-pulse mt-4" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {courses.filter((course) => course.progress?.isCompleted).length} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Purchased PDFs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pdfs.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Access to all resources</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter((payment) => payment.status === "approved").length}/{payments.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {payments.filter((payment) => payment.status === "pending").length} pending approval
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="pdfs">My PDFs</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          {courses.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Courses Yet</CardTitle>
                <CardDescription>
                  You haven't enrolled in any courses yet. Browse our courses to get started.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => {
                const completedCount = course.progress?.completedVideos?.length || 0
                const totalVideos = course.videos?.length || 0
                const progressPercentage = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0

                return (
                  <Card key={course._id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm font-medium">{progressPercentage}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{totalVideos} videos</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>{completedCount} completed</span>
                        </div>
                      </div>
                      <Button asChild className="w-full">
                        <Link href={`/courses/${course._id}`}>Continue Learning</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pdfs" className="space-y-4">
          {pdfs.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No PDFs Yet</CardTitle>
                <CardDescription>You haven't purchased any PDFs yet. Browse our PDFs to get started.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/pdfs">Browse PDFs</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pdfs.map((pdf) => (
                <Card key={pdf._id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{pdf.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{pdf.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        <span>PDF Document</span>
                      </div>
                      <Badge variant="outline">{pdf.pages} pages</Badge>
                    </div>
                    <Button asChild className="w-full">
                      <Link href={`/pdfs/${pdf._id}`}>View PDF</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {payments.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Payment History</CardTitle>
                <CardDescription>You haven't made any payments yet.</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Your recent payment transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div
                      key={payment._id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">{payment.item.name || payment.item.title}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="capitalize">{payment.itemType}</span>
                          <span className="mx-2">•</span>
                          <span>${payment.amount.toFixed(2)}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          payment.status === "approved"
                            ? "default"
                            : payment.status === "pending"
                              ? "outline"
                              : "destructive"
                        }
                      >
                        {payment.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {payment.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                        {payment.status === "rejected" && <AlertCircle className="h-3 w-3 mr-1" />}
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

