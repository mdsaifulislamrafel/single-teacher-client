"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "../../../../../../components/ui/card"
import { Button } from "../../../../../../components/ui/button"
import { useAuth } from "../../../../../../contexts/AuthContext"
import { videoApi } from "../../../../../../lib/api"
import { useToast } from "../../../../../../components/ui/use-toast"
import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Skeleton } from "../../../../../../components/ui/skeleton"

export default function VideoPlayerPage() {
  const params = useParams()
  const id = params.id as string
  const videoId = params.videoId as string
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [video, setVideo] = useState<any>(null)
  const [completed, setCompleted] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchVideo = async () => {
      if (!user || !videoId || !id) return

      try {
        setLoading(true)

        // Check if user has access to this video
        try {
          const accessResponse = await videoApi.checkAccess({
            videoId: videoId,
            subcategoryId: id,
          })

          setHasAccess(accessResponse.data.access)

          if (!accessResponse.data.access) {
            toast({
              title: "Access Denied",
              description: "You need to complete previous videos first or purchase this course.",
              variant: "destructive",
            })
            router.push(`/courses/${id}`)
            return
          }
        } catch (error) {
          // If API returns error, user doesn't have access
          toast({
            title: "Access Denied",
            description: "You need to complete previous videos first or purchase this course.",
            variant: "destructive",
          })
          router.push(`/courses/${id}`)
          return
        }

        // Fetch video details
        const videoResponse = await videoApi.getById(videoId)
        setVideo(videoResponse.data)

        // Check if video is already completed
        // In a real implementation, you would get this from the user progress
        setCompleted(false)
      } catch (error) {
        console.error("Error fetching video:", error)
        toast({
          title: "Error",
          description: "Failed to load video",
          variant: "destructive",
        })
        router.push(`/courses/${id}`)
      } finally {
        setLoading(false)
      }
    }

    fetchVideo()
  }, [user, videoId, id, router, toast, authLoading, isAuthenticated])

  const handleMarkCompleted = async () => {
    if (!user || !videoId || !id) return

    try {
      await videoApi.markCompleted({
        videoId: videoId,
        subcategoryId: id,
      })

      setCompleted(true)

      toast({
        title: "Progress Saved",
        description: "This video has been marked as completed.",
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

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (!video || !hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-2xl font-semibold mb-2">Video Not Available</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          The video you're looking for doesn't exist or you don't have access to it.
        </p>
        <Link href={`/courses/${id}`}>
          <Button>Back to Course</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={`/courses/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{video.title}</h1>
        </div>

        <Button
          variant="outline"
          onClick={handleMarkCompleted}
          disabled={completed}
          className={completed ? "bg-green-50 text-green-700 border-green-200" : ""}
        >
          {completed ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </>
          ) : (
            "Mark as Completed"
          )}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 aspect-video">
          {/* In a real implementation, you would use a Vimeo player component */}
          <div className="w-full h-full bg-black flex items-center justify-center text-white">
            <iframe
              src={`https://player.vimeo.com/video/${video.vimeoId}`}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold mb-2">Description</h2>
          <p className="text-muted-foreground">{video.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="bg-muted px-3 py-1 rounded-full text-sm">Duration: {video.duration}</div>
          <div className="bg-muted px-3 py-1 rounded-full text-sm">Category: {video.category?.name}</div>
          <div className="bg-muted px-3 py-1 rounded-full text-sm">Subcategory: {video.subcategory?.name}</div>
        </div>
      </div>
    </div>
  )
}

