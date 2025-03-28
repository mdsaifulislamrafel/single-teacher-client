"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "../../../../../../../components/ui/button"
import { Card } from "../../../../../../../components/ui/card"
import { Separator } from "../../../../../../../components/ui/separator"
import { CheckCircle, ChevronLeft, ChevronRight, Play } from "lucide-react"
import { useToast } from "../../../../../../../components/ui/use-toast"
import Link from "next/link"
import { useAuth } from "../../../../../../../contexts/AuthContext"
import { api } from "../../../../../../../lib/api"

export default function VideoPage() {
  const params = useParams()
  const id = params.id as string
  const videoId = params.videoId as string
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [course, setCourse] = useState<any>(null)
  const [video, setVideo] = useState<any>(null)
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [progress, setProgress] = useState<any>(null)
  const [videoCompleted, setVideoCompleted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoWatched, setVideoWatched] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          router.push("/login")
          return
        }

        // Check access
        const accessResponse = await api.get(`/subcategories/${id}/access`)
        const hasAccess = accessResponse?.access || false
        setHasAccess(hasAccess)

        if (!hasAccess) {
          toast({
            title: "Access Denied",
            description: "You need to enroll in this course to access the videos",
            variant: "destructive",
          })
          router.push(`/courses/${id}`)
          return
        }

        // Fetch course
        const courseData = await api.get(`/subcategories/${id}`)
        setCourse(courseData)

        // Fetch videos
        const videosData = await api.get(`/subcategories/${id}/videos`)
        setVideos(Array.isArray(videosData) ? videosData : [])

        // Fetch current video
        const videoData = await api.get(`/videos/${videoId}`)
        setVideo(videoData)

        // Fetch progress
        try {
          const progressData = await api.get(`/subcategories/${id}/progress`)
          setProgress(progressData)

          // Check if video is already completed
          if (progressData?.completedVideos?.includes(videoId)) {
            setVideoCompleted(true)
          }
        } catch (error) {
          console.error("Error fetching progress:", error)
          setProgress({
            completedVideos: [],
          })
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load video",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchData()
  }, [id, videoId, user, router, toast])

  const markVideoAsCompleted = async () => {
    if (videoCompleted) return

    try {
      await api.post(`/videos/${videoId}/complete`, { subcategoryId: id })
      setVideoCompleted(true)

      // Update progress
      const progressData = await api.get(`/subcategories/${id}/progress`)
      setProgress(progressData)

      toast({
        title: "Progress Updated",
        description: "This video has been marked as completed",
      })
    } catch (error) {
      console.error("Error marking video as completed:", error)
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      })
    }
  }

  const handleVideoEnd = () => {
    setVideoWatched(true)
    if (!videoCompleted) {
      markVideoAsCompleted()
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration
      const currentTime = videoRef.current.currentTime

      // Mark as watched if 90% of the video is watched
      if (duration > 0 && currentTime / duration > 0.9 && !videoWatched) {
        setVideoWatched(true)
        if (!videoCompleted) {
          markVideoAsCompleted()
        }
      }
    }
  }

  const navigateToNextVideo = () => {
    const currentIndex = videos.findIndex((v) => v._id === videoId)
    if (currentIndex < videos.length - 1) {
      router.push(`/dashboard/courses/${id}/videos/${videos[currentIndex + 1]._id}`)
    }
  }

  const navigateToPreviousVideo = () => {
    const currentIndex = videos.findIndex((v) => v._id === videoId)
    if (currentIndex > 0) {
      router.push(`/dashboard/courses/${id}/videos/${videos[currentIndex - 1]._id}`)
    }
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex flex-col space-y-4">
          <div className="h-8 w-1/3 bg-muted rounded animate-pulse" />
          <div className="h-64 w-full bg-muted rounded animate-pulse mt-4" />
        </div>
      </div>
    )
  }

  if (!video || !course || !hasAccess) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold">Video not found or access denied</h1>
        <p className="mt-2">
          The video you are looking for does not exist, has been removed, or you don't have access.
        </p>
        <Button asChild className="mt-4">
          <Link href={`/dashboard/courses/${id}`}>Back to Course</Link>
        </Button>
      </div>
    )
  }

  const currentIndex = videos.findIndex((v) => v._id === videoId)
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < videos.length - 1

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/courses/${id}`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Course
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{video.title}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {video.videoUrl ? (
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  controls
                  className="w-full h-full"
                  onEnded={handleVideoEnd}
                  onTimeUpdate={handleTimeUpdate}
                />
              ) : video.vimeoId ? (
                <iframe
                  src={`https://player.vimeo.com/video/${video.vimeoId}`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-white">Video not available</p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-semibold">{video.title}</h2>
              <p className="mt-2 text-muted-foreground">{video.description}</p>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" disabled={!hasPrevious} onClick={navigateToPreviousVideo}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              {videoCompleted ? (
                <Button variant="outline" className="text-green-500">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Completed
                </Button>
              ) : (
                <Button onClick={markVideoAsCompleted}>Mark as Completed</Button>
              )}

              <Button disabled={!hasNext} onClick={navigateToNextVideo}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          <div>
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Course Content</h3>
              <Separator className="mb-3" />
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {videos.map((v, index) => {
                  const isCurrentVideo = v._id === videoId
                  const isCompleted = progress?.completedVideos?.includes(v._id)

                  return (
                    <div
                      key={v._id}
                      className={`p-2 rounded-md flex items-center justify-between ${isCurrentVideo ? "bg-muted" : ""}`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Play className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <span className={`text-sm ${isCurrentVideo ? "font-medium" : ""}`}>
                          {index + 1}. {v.title}
                        </span>
                      </div>
                      {!isCurrentVideo && (
                        <Button variant="ghost" size="sm" asChild className="h-6 px-2">
                          <Link href={`/dashboard/courses/${id}/videos/${v._id}`}>
                            {isCompleted ? "Rewatch" : "Watch"}
                          </Link>
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

