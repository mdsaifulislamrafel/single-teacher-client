"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { useAuth } from "../../../../contexts/AuthContext"
import { subcategoryApi } from "../../../../lib/api"
import { useToast } from "../../../../components/ui/use-toast"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Play, Video } from "lucide-react"
import { Badge } from "../../../../components/ui/badge"

interface Subcategory {
  _id: string
  name: string
  description: string
  category: {
    _id: string
    name: string
  }
}

interface VideoType {
  _id: string
  title: string
  description: string
  duration: string
  vimeoId: string
  sequence: number
}

interface UserProgress {
  _id: string
  completedVideos: string[]
  lastAccessedVideo: string
}

export default function SubcategoryPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null)
  const [videos, setVideos] = useState<VideoType[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !id) return

      try {
        setLoading(true)

        // Fetch subcategory details
        const subcategoryResponse = await subcategoryApi.getById(id as string)
        setSubcategory(subcategoryResponse.data)

        // Fetch videos for this subcategory
        const videosResponse = await subcategoryApi.getVideos(id as string)
        setVideos(videosResponse.data)

        // In a real implementation, you would fetch user progress for this subcategory
        // For now, we'll simulate it
        setUserProgress({
          _id: "progress-id",
          completedVideos: ["video1", "video2"],
          lastAccessedVideo: "video3",
        })
      } catch (error) {
        console.error("Error fetching subcategory data:", error)
        toast({
          title: "Error",
          description: "Failed to load course content",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, id, toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
        <Link href="/dashboard/courses">
          <Button>Back to My Courses</Button>
        </Link>
      </div>
    )
  }

  // Sort videos by sequence
  const sortedVideos = [...videos].sort((a, b) => a.sequence - b.sequence)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/courses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{subcategory.name}</h1>
      </div>

      <p className="text-muted-foreground">Category: {subcategory.category.name}</p>

      <Card>
        <CardHeader>
          <CardTitle>Course Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{subcategory.description}</p>
        </CardContent>
      </Card>

      <div className="mt-4">
        <h2 className="text-2xl font-bold mb-4">Course Content</h2>

        {sortedVideos.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-muted-foreground">No videos available for this course yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedVideos.map((video, index) => {
              const isCompleted = userProgress?.completedVideos.includes(video._id)
              const isLocked = index > 0 && !userProgress?.completedVideos.includes(sortedVideos[index - 1]._id)

              return (
                <Card key={video._id} className={isLocked ? "opacity-70" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Video className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{video.title}</p>
                          <p className="text-sm text-muted-foreground">{video.duration}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCompleted && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Completed
                          </Badge>
                        )}

                        <Link href={`/dashboard/courses/${id}/videos/${video._id}`}>
                          <Button variant={isCompleted ? "outline" : "default"} size="sm" disabled={isLocked}>
                            <Play className="h-4 w-4 mr-2" />
                            {isCompleted ? "Rewatch" : "Watch"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

