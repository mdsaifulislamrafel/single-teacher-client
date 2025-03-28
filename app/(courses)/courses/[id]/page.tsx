"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Separator } from "../../../../components/ui/separator"
import { Badge } from "../../../../components/ui/badge"
import { Progress } from "../../../../components/ui/progress"
import { Lock, Play, FileText, CheckCircle } from "lucide-react"
import { useToast } from "../../../../components/ui/use-toast"
import Link from "next/link"
import { useAuth } from "../../../../contexts/AuthContext"
import { api } from "../../../../lib/api"

export default function CoursePage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const [course, setCourse] = useState<any>(null)
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [access, setAccess] = useState({ access: false, pending: false })
  const [progress, setProgress] = useState<any>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Fetch course details
        const courseResponse = await api.get(`/subcategories/${id}`)
        console.log("Course response:", courseResponse)

        // Handle different response formats
        let courseData = null
        if (courseResponse && typeof courseResponse === "object") {
          if (courseResponse.subcategory) {
            courseData = courseResponse.subcategory
          } else if (courseResponse._id) {
            courseData = courseResponse
          }
        }

        setCourse(courseData)

        // Fetch videos
        const videosResponse = await api.get(`/subcategories/${id}/videos`)
        console.log("Videos response:", videosResponse)

        // Handle different response formats
        let videosData = []
        if (Array.isArray(videosResponse)) {
          videosData = videosResponse
        } else if (videosResponse && typeof videosResponse === "object") {
          if (Array.isArray(videosResponse.videos)) {
            videosData = videosResponse.videos
          } else if (Array.isArray(videosResponse.data)) {
            videosData = videosResponse.data
          }
        }

        setVideos(videosData)

        // Check if user is logged in
        if (isAuthenticated && user) {
          try {
            // Check access
            const accessResponse = await api.get(`/subcategories/${id}/access`)
            console.log("Access response:", accessResponse)

            // Handle different response formats
            const accessData = { access: false, pending: false }
            if (accessResponse && typeof accessResponse === "object") {
              if (typeof accessResponse.access === "boolean") {
                accessData.access = accessResponse.access
              }
              if (typeof accessResponse.pending === "boolean") {
                accessData.pending = accessResponse.pending
              }
            }

            setAccess(accessData)

            // If user has access, fetch progress
            if (accessData.access) {
              try {
                const progressResponse = await api.get(`/subcategories/${id}/progress`)
                console.log("Progress response:", progressResponse)

                // Handle different response formats
                let progressData = null
                if (progressResponse && typeof progressResponse === "object") {
                  if (progressResponse.progress) {
                    progressData = progressResponse.progress
                  } else if (Array.isArray(progressResponse.completedVideos)) {
                    progressData = progressResponse
                  }
                }

                setProgress(progressData)
              } catch (error) {
                console.error("Error fetching progress:", error)
              }
            }
          } catch (error) {
            console.error("Error checking access:", error)
            setAccess({ access: false, pending: false })
          }
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching course:", error)
        toast({
          title: "Error",
          description: "Failed to load course details",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id, user, isAuthenticated, toast])

  const handleEnrollment = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to enroll in this course",
        variant: "destructive",
      })
      router.push(`/login?redirect=/courses/${id}`)
      return
    }

    try {
      router.push(`/payment?type=subcategory&id=${id}&name=${encodeURIComponent(course.name)}&price=${course.price}`)
    } catch (error) {
      console.error("Error enrolling:", error)
      toast({
        title: "Error",
        description: "Failed to process enrollment",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex flex-col space-y-4">
          <div className="h-8 w-1/3 bg-muted rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
          <div className="h-64 w-full bg-muted rounded animate-pulse mt-4" />
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold">Course not found</h1>
        <p className="mt-2">The course you are looking for does not exist or has been removed.</p>
        <Button asChild className="mt-4">
          <Link href="/courses">Back to Courses</Link>
        </Button>
      </div>
    )
  }

  const completedCount = progress?.completedVideos?.length || 0
  const progressPercentage = videos.length > 0 ? Math.round((completedCount / videos.length) * 100) : 0

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold">{course.name}</h1>
          <p className="mt-2 text-muted-foreground">{course.description}</p>

          {access.access && progress && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Your Progress</span>
                <span className="text-sm font-medium">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}

          <Separator className="my-6" />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Course Content</h2>
            {videos.length === 0 ? (
              <p className="text-muted-foreground">No content available for this course yet.</p>
            ) : (
              <div className="space-y-3">
                {videos.map((video, index) => {
                  const isCompleted = progress?.completedVideos?.includes(video._id)
                  return (
                    <Card key={video._id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {access.access ? (
                                isCompleted ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                  <Play className="h-5 w-5 text-primary" />
                                )
                              ) : (
                                <Lock className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {index + 1}. {video.title}
                              </p>
                              <p className="text-sm text-muted-foreground">{video.duration || "N/A"}</p>
                            </div>
                          </div>
                          {access.access ? (
                            <Button variant="ghost" size="sm" asChild className={isCompleted ? "text-green-500" : ""}>
                              <Link href={`/dashboard/courses/${id}/videos/${video._id}`}>
                                {isCompleted ? "Rewatch" : "Watch"}
                              </Link>
                            </Button>
                          ) : (
                            <Badge variant="outline">Locked</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>Enroll to get full access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-bold">৳{course.price?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Videos</span>
                  <span>{videos.length}</span>
                </div>
                {course.category && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <Badge variant="secondary">{course.category.name}</Badge>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  {access.access ? (
                    <Badge className="bg-green-500">Enrolled</Badge>
                  ) : access.pending ? (
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                      Payment Pending
                    </Badge>
                  ) : (
                    <Badge variant="outline">Not Enrolled</Badge>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {access.access ? (
                <Button className="w-full" asChild>
                  <Link href={videos.length > 0 ? `/dashboard/courses/${id}/videos/${videos[0]._id}` : "#"}>
                    Continue Learning
                  </Link>
                </Button>
              ) : access.pending ? (
                <Button className="w-full" disabled>
                  Payment Pending Approval
                </Button>
              ) : (
                <Button className="w-full" onClick={handleEnrollment}>
                  Enroll Now
                </Button>
              )}
            </CardFooter>
          </Card>

          {course.resources && course.resources.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {course.resources.map((resource: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline"
                      >
                        {resource.name}
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

