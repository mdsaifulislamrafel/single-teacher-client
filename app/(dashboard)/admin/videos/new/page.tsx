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
  vimeoId: z.string().min(5, { message: "Vimeo ID is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  sequence: z.coerce.number().int().nonnegative(),
})

type VideoFormValues = z.infer<typeof videoSchema>

export default function NewVideoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [allSubcategories, setAllSubcategories] = useState<Subcategory[]>([])
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      subcategory: "",
      vimeoId: "",
      duration: "",
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
      console.log("Selected category:", selectedCategory)
      console.log("All subcategories:", allSubcategories)

      // Filter subcategories based on selected category
      const filtered = allSubcategories.filter((subcategory) => subcategory.category._id === selectedCategory)

      console.log("Filtered subcategories:", filtered)
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

  async function onSubmit(data: VideoFormValues) {
    setIsLoading(true)

    try {
      await videoApi.create(data)

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
                          console.log("Category selected:", value)
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="vimeoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vimeo ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 123456789" {...field} />
                      </FormControl>
                      <FormDescription>The ID of the video on Vimeo.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 15:30" {...field} />
                      </FormControl>
                      <FormDescription>The duration of the video in minutes and seconds.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/videos")} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Video"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

