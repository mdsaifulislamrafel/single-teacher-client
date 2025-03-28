"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Progress } from "../../../../components/ui/progress"
import { Badge } from "../../../../components/ui/badge"
import { Clock, CheckCircle, BookOpen } from "lucide-react"
import { useToast } from "../../../../components/ui/use-toast"
import { api } from "../../../../lib/api"
import Link from "next/link"
import { useAuth } from "../../../../contexts/AuthContext"

export default function UserCoursesPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return

      try {
        setLoading(true)
        // Get user's approved payments for courses
        const payments = await api.get("/payments/user")

        // Extract course data from payments
        let userCourses = []

        // Handle different response formats
        if (Array.isArray(payments)) {
          userCourses = payments.filter((p) => p.itemType === "subcategory" && p.status === "approved")
        } else if (payments && Array.isArray(payments.payments)) {
          userCourses = payments.payments.filter((p) => p.itemType === "subcategory" && p.status === "approved")
        }

        // Fetch details for each course
        const coursesWithDetails = await Promise.all(
          userCourses.map(async (payment) => {
            try {
              // Get course details
              const courseId = payment.itemId
              const courseDetails = await api.get(`/subcategories/${courseId}`)

              // Get videos for this course
              const videos = await api.get(`/subcategories/${courseId}/videos`)

              // Get user progress for this course
              let progress = null
              try {
                progress = await api.get(`/subcategories/${courseId}/progress`)
              } catch (err) {
                console.error(`Error fetching progress for course ${courseId}:`, err)
              }

              // Calculate completion percentage
              const videoCount = Array.isArray(videos) ? videos.length : 0
              const completedCount = progress?.completedVideos?.length || 0
              const completionPercentage = videoCount > 0 ? Math.round((completedCount / videoCount) * 100) : 0

              return {
                _id: courseId,
                ...courseDetails,
                videos: videos || [],
                progress: {
                  ...progress,
                  completionPercentage,
                  completedCount,
                  totalVideos: videoCount,
                },
              }
            } catch (err) {
              console.error(`Error fetching details for course ${payment.itemId}:`, err)
              return null
            }
          }),
        )

        // Filter out any null values from failed requests
        setCourses(coursesWithDetails.filter(Boolean))
      } catch (error) {
        console.error("Error fetching user courses:", error)
        toast({
          title: "Error",
          description: "Failed to load your courses",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [user, toast])

  if (loading) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">My Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full mb-4"></div>
                <div className="h-2 bg-muted rounded w-full mb-6"></div>
                <div className="flex justify-between mb-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="h-10 bg-muted rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Courses Yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            You haven't enrolled in any courses yet. Browse our courses to get started on your learning journey.
          </p>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course._id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">{course.progress?.completionPercentage || 0}%</span>
                  </div>
                  <Progress value={course.progress?.completionPercentage || 0} className="h-2" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{course.progress?.totalVideos || 0} videos</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>{course.progress?.completedCount || 0} completed</span>
                  </div>
                </div>
                {course.category && (
                  <Badge variant="outline" className="mt-2">
                    {course.category.name}
                  </Badge>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/courses/${course._id}`}>Continue Learning</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

