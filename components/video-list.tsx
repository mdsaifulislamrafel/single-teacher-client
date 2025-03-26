"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { CheckCircle, Lock, Play } from "lucide-react"

interface VideoListProps {
  videos: any[]
  subcategoryId: string
  progressId: string
  completedVideos: string[]
}

export function VideoList({ videos, subcategoryId, progressId, completedVideos }: VideoListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Course Videos</h2>

      {videos.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No videos available for this course yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {videos.map((video, index) => {
            const isCompleted = completedVideos.includes(video._id.toString())
            const isLocked = index > 0 && !completedVideos.includes(videos[index - 1]._id.toString())

            return (
              <Card key={video._id} className={isCompleted ? "border-primary" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {index + 1}. {video.title}
                    </CardTitle>
                    {isCompleted && <CheckCircle className="h-5 w-5 text-primary" />}
                  </div>
                  <CardDescription>Duration: {video.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground line-clamp-1">{video.description}</p>
                    {isLocked ? (
                      <Button variant="outline" disabled>
                        <Lock className="mr-2 h-4 w-4" />
                        Locked
                      </Button>
                    ) : (
                      <Link
                        href={`/dashboard/courses/video/${video._id}?progress=${progressId}&subcategory=${subcategoryId}`}
                      >
                        <Button>
                          <Play className="mr-2 h-4 w-4" />
                          {isCompleted ? "Rewatch" : "Watch"}
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

