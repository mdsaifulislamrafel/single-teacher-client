

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../../../components/ui/form"
import { Input } from "../../../../../components/ui/input"
import { Textarea } from "../../../../../components/ui/textarea"
import { toast } from "../../../../../components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { categoryApi, subcategoryApi, videoApi } from "../../../../../lib/api"
import { FileUpload } from "../../../../../components/file-upload"
import { Alert, AlertDescription, AlertTitle } from "../../../../../components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Progress } from "../../../../../components/ui/progress"

interface Category {
  _id: string
  name: string
}

interface Subcategory {
  _id: string
  name: string
  category: {
    _id: string
    name: string
  }
}

const videoSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string({ required_error: "Please select a category" }),
  subcategory: z.string({ required_error: "Please select a subcategory" }),
  sequence: z.coerce.number().int().nonnegative(),
})

type VideoFormValues = z.infer<typeof videoSchema>

export default function NewVideoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [categories, setCategories] = useState<Category[]>([])
  const [allSubcategories, setAllSubcategories] = useState<Subcategory[]>([])
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [vimeoData, setVimeoData] = useState<{ vimeoId: string; duration: string } | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      subcategory: "",
      sequence: 0,
    },
  })

  // Fetch categories and subcategories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await categoryApi.getAll()
        setCategories(categoriesResponse.data)

        // Fetch all subcategories
        const subcategoriesResponse = await subcategoryApi.getAll()
        setAllSubcategories(subcategoriesResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load categories and subcategories",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [toast])

  // Filter subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      // Filter subcategories based on selected category
      const filtered = allSubcategories.filter((subcategory) => subcategory.category._id === selectedCategory)
      setFilteredSubcategories(filtered)

      // Reset subcategory selection if the current selection doesn't belong to the selected category
      const currentSubcategory = form.getValues("subcategory")
      const subcategoryExists = filtered.some((sub) => sub._id === currentSubcategory)

      if (currentSubcategory && !subcategoryExists) {
        form.setValue("subcategory", "")
      }
    } else {
      setFilteredSubcategories([])
    }
  }, [selectedCategory, allSubcategories, form])

  // Handle video file upload to Vimeo
  const handleVideoUpload = async () => {
    if (!videoFile) {
      toast({
        title: "Error",
        description: "Please select a video file to upload",
        variant: "destructive",
      })
      return
    }

    const title = form.getValues("title")
    const description = form.getValues("description")

    if (!title) {
      toast({
        title: "Error",
        description: "Please enter a title for the video",
        variant: "destructive",
      })
      return
    }

    setUploadStatus("uploading")
    setUploadProgress(0)
    setUploadError(null)

    // Simulate progress updates (in a real implementation, you would get this from the Vimeo API)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 5
      })
    }, 1000)

    try {
      // Upload the video to Vimeo
      const result = await videoApi.uploadToVimeo(videoFile, title, description)

      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadStatus("success")
      setVimeoData(result)

      toast({
        title: "Upload successful",
        description: "Video has been uploaded to Vimeo successfully",
      })
    } catch (error: any) {
      clearInterval(progressInterval)
      setUploadStatus("error")
      setUploadError(error.message || "Unknown error occurred during upload")

      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video to Vimeo. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function onSubmit(data: VideoFormValues) {
    if (!vimeoData) {
      toast({
        title: "Error",
        description: "Please upload a video to Vimeo first",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Create the video with Vimeo data
      const videoData = {
        ...data,
        vimeoId: vimeoData.vimeoId,
        duration: vimeoData.duration,
      }

      await videoApi.create(videoData)

      toast({
        title: "Video created",
        description: `Successfully created video: ${data.title}`,
      })

      router.push("/admin/videos")
    } catch (error: any) {
      console.error("Failed to create video:", error)
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create video. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Add New Video</h1>

      <Card>
        <CardHeader>
          <CardTitle>Video Details</CardTitle>
          <CardDescription>Upload a new video to your course.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Introduction to Bangla Alphabet" {...field} />
                    </FormControl>
                    <FormDescription>This is the title that will be displayed to users.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed description of this video..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Explain what users will learn in this video.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedCategory(value)
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subcategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategory</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedCategory}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subcategory" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredSubcategories.length > 0 ? (
                            filteredSubcategories.map((subcategory) => (
                              <SelectItem key={subcategory._id} value={subcategory._id}>
                                {subcategory.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              {selectedCategory ? "No subcategories found" : "Select a category first"}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="sequence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sequence</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormDescription>The order in which this video appears.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Video upload section */}
              <div className="space-y-4 border rounded-lg p-4">
                <h3 className="text-lg font-medium">Video Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your video file to Vimeo. Supported formats: MP4, MOV, AVI, WMV, FLV.
                </p>

                {!vimeoData ? (
                  <>
                    <FileUpload
                      onFileChange={setVideoFile}
                      accept="video/*"
                      maxSize={500} // 500MB
                    />

                    {uploadStatus === "uploading" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Uploading to Vimeo...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                    )}

                    {uploadStatus === "success" && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle>Upload Successful</AlertTitle>
                        <AlertDescription>Your video has been uploaded to Vimeo successfully.</AlertDescription>
                      </Alert>
                    )}

                    {uploadStatus === "error" && (
                      <Alert className="bg-red-50 border-red-200">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertTitle>Upload Failed</AlertTitle>
                        <AlertDescription>
                          {uploadError || "There was an error uploading your video. Please try again."}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="button"
                      onClick={handleVideoUpload}
                      disabled={!videoFile || uploadStatus === "uploading"}
                      className="w-full"
                    >
                      {uploadStatus === "uploading" ? "Uploading..." : "Upload to Vimeo"}
                    </Button>
                  </>
                ) : (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle>Video Ready</AlertTitle>
                    <AlertDescription>
                      Your video has been uploaded to Vimeo with ID: {vimeoData.vimeoId}
                      <br />
                      Duration: {vimeoData.duration}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/videos")} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !vimeoData}>
                {isLoading ? "Creating..." : "Create Video"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

