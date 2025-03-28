"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Input } from "../../../../components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { MoreVertical, Plus, Search, Edit, Trash, Video, Eye } from "lucide-react"
import { videoApi } from "../../../../lib/api"
import { useToast } from "../../../../components/ui/use-toast"

interface VideoType {
  _id: string
  title: string
  description: string
  category: {
    _id: string
    name: string
  }
  subcategory: {
    _id: string
    name: string
  }
  duration: string
  vimeoId: string
  createdAt: string
}

export default function VideosPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [videos, setVideos] = useState<VideoType[]>([])

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const response = await videoApi.getAll()

        // Handle different response formats
        if (Array.isArray(response)) {
          setVideos(response)
        } else if (response && Array.isArray(response.data)) {
          setVideos(response.data)
        } else {
          console.error("Videos data is not an array:", response)
          setVideos([])
        }
      } catch (error) {
        console.error("Error fetching videos:", error)
        toast({
          title: "Error",
          description: "Failed to load videos",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [toast])

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
      return
    }

    try {
      await videoApi.delete(id)
      setVideos(videos.filter((video) => video._id !== id))
      toast({
        title: "Video deleted",
        description: "The video has been deleted successfully",
      })
    } catch (error: any) {
      console.error("Error deleting video:", error)
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete video",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Videos Management</h1>
        <Link href="/admin/videos/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Video
          </Button>
        </Link>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search videos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Videos</CardTitle>
          <CardDescription>Manage your course videos uploaded to Vimeo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Subcategory</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Vimeo ID</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVideos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No videos found. Try a different search term or add a new video.
                  </TableCell>
                </TableRow>
              ) : (
                filteredVideos.map((video) => (
                  <TableRow key={video._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Video className="mr-2 h-4 w-4 text-muted-foreground" />
                        {video.title}
                      </div>
                    </TableCell>
                    <TableCell>{video.category.name}</TableCell>
                    <TableCell>{video.subcategory.name}</TableCell>
                    <TableCell>{video.duration}</TableCell>
                    <TableCell>{video.vimeoId}</TableCell>
                    <TableCell>{new Date(video.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/admin/videos/${video._id}`}>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                          </Link>
                          <Link href={`/admin/videos/${video._id}/edit`}>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteVideo(video._id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

