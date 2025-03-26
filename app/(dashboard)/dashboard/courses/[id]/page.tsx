"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Separator } from "../../../../../components/ui/separator"
import { Skeleton } from "../../../../../components/ui/skeleton"
import { useAuth } from "../../../../../contexts/AuthContext"
import { subcategoryApi } from "../../../../../lib/api"
import { useToast } from "../../../../../components/ui/use-toast"
import { PaymentForm } from "./payment-form"
import { VideoList } from "../../../../../components/video-list"

export default function CoursePage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [subcategory, setSubcategory] = useState<any>(null)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [videos, setVideos] = useState([])
  const [userProgress, setUserProgress] = useState<any>(null)

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchData = async () => {
      if (!user || !id) return

      try {
        setLoading(true)

        // Fetch subcategory
        const subcategoryResponse = await subcategoryApi.getById(id as string)
        setSubcategory(subcategoryResponse.data)

        // Check if user has purchased this course or is admin
        if (user.role === "admin") {
          setHasPurchased(true)
        } else {
          try {
            // In a real implementation, you would have an API endpoint to check purchase status
            // For now, we'll simulate it by checking if the user has progress for this subcategory
            const userCoursesResponse = await subcategoryApi.checkAccess(id as string)
            setHasPurchased(userCoursesResponse.data.access)
          } catch (error) {
            // If API returns error, user hasn't purchased
            setHasPurchased(false)
          }
        }

        // If user has purchased, fetch videos and progress
        if (hasPurchased || user.role === "admin") {
          const videosResponse = await subcategoryApi.getVideos(id as string)
          setVideos(videosResponse.data)

          // Fetch user progress
          try {
            const progressResponse = await subcategoryApi.getUserProgress(id as string)
            setUserProgress(progressResponse.data)
          } catch (error) {
            // If no progress exists, create a default one
            setUserProgress({
              _id: "new",
              completedVideos: [],
              isCompleted: false,
            })
          }
        }
      } catch (error) {
        console.error("Error fetching course data:", error)
        toast({
          title: "Error",
          description: "Failed to load course data",
          variant: "destructive",
        })
        router.push("/dashboard/courses")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, user, authLoading, isAuthenticated, router, toast, hasPurchased])

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-6 w-1/3" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
        <Separator />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (!subcategory) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-2xl font-semibold mb-2">Course Not Found</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          The course you're looking for doesn't exist or you don't have access to it.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{subcategory.name}</h1>
        <p className="text-muted-foreground">Category: {subcategory.category.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{subcategory.description}</p>
        </CardContent>
      </Card>

      <Separator />

      {hasPurchased ? (
        <VideoList
          videos={videos}
          subcategoryId={id as string}
          progressId={userProgress?._id}
          completedVideos={userProgress?.completedVideos || []}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Purchase Course</CardTitle>
            <CardDescription>Purchase this course to access all videos</CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentForm
              itemId={id as string}
              itemType="course"
              itemName={subcategory.name}
              price="৳1,200"
              onSuccess={() => setHasPurchased(true)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

