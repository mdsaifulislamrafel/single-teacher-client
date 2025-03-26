"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { Badge } from "../../../../../components/ui/badge"
import { CheckCircle, Lock, Play, Video } from "lucide-react"
import { videoApi } from "../../../../../lib/api"
import { useToast } from "../../../../../components/ui/use-toast"

interface VideoListProps {
  videos: any[]
  subcategoryId: string
  progressId: string
  completedVideos: string[]
}

export function VideoList({ videos, subcategoryId, progressId, completedVideos }: VideoListProps) {
  const { toast } = useToast()
  const [localCompletedVideos, setLocalCompletedVideos] = useState<string[]>(completedVideos)

  if (videos.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-muted-foreground">No videos available for this course yet.</p>
      </div>
    )
  }

  const handleMarkCompleted = async (videoId: string) => {
    try {
      // Call API to mark video as completed
      await videoApi.markCompleted({
        videoId,
        subcategoryId,
      })

      // Update local state
      setLocalCompletedVideos((prev) => [...prev, videoId])

      toast({
        title: "Progress Updated",
        description: "Video marked as completed",
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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Course Content</h2>

      <div className="space-y-4">
        {videos.map((video, index) => {
          const isCompleted = localCompletedVideos.includes(video._id)
          const isLocked = index > 0 && !localCompletedVideos.includes(videos[index - 1]._id)

          return (
            <Card key={video._id} className={isLocked ? "opacity-70" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : isLocked ? (
                        <Lock className="h-5 w-5" />
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

                    {isLocked ? (
                      <Button variant="outline" size="sm" disabled>
                        <Lock className="h-4 w-4 mr-2" />
                        Locked
                      </Button>
                    ) : isCompleted ? (
                      <div className="flex gap-2">
                        <Link href={`/courses/${subcategoryId}/videos/${video._id}`}>
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Rewatch
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Link href={`/courses/${subcategoryId}/videos/${video._id}`}>
                          <Button size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Watch
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleMarkCompleted(video._id)}>
                          Mark Complete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

