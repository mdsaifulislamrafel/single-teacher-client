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
import { FileUpload } from "../../../../../components/file-upload"
import { categoryApi, subcategoryApi, pdfApi, fileApi } from "../../../../../lib/api"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../../../../../components/ui/alert"

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

// Update the schema to remove fileUrl
const pdfSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string({ required_error: "Please select a category" }),
  subcategory: z.string({ required_error: "Please select a subcategory" }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
})

type PDFFormValues = z.infer<typeof pdfSchema>

export default function NewPDFPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [categories, setCategories] = useState<Category[]>([])
  const [allSubcategories, setAllSubcategories] = useState<Subcategory[]>([])
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)

  const form = useForm<PDFFormValues>({
    resolver: zodResolver(pdfSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      subcategory: "",
      price: 0,
    },
  })

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

  async function onSubmit(data: PDFFormValues) {
    // Check if file is selected
    if (!file) {
      toast({
        title: "Error",
        description: "Please upload a PDF file",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setUploadStatus("uploading")

    try {
      // Upload the file first using Multer
      let fileData
      try {
        fileData = await fileApi.upload(file)
        setUploadStatus("success")
      } catch (error) {
        console.error("Error uploading file:", error)
        setUploadStatus("error")
        toast({
          title: "Error",
          description: "Failed to upload file. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Create the PDF with the file URL
      const formData = {
        ...data,
        fileUrl: fileData.url,
        fileSize: fileData.size,
      }

      await pdfApi.create(formData)

      toast({
        title: "PDF created",
        description: `Successfully created PDF: ${data.title}`,
      })

      router.push("/admin/pdfs")
    } catch (error: any) {
      console.error("Failed to create PDF:", error)
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Add New PDF</h1>

      <Card>
        <CardHeader>
          <CardTitle>PDF Details</CardTitle>
          <CardDescription>Upload a new PDF resource.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PDF Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Bangla Grammar Guide" {...field} />
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
                        placeholder="Provide a detailed description of this PDF..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Explain what users will learn from this PDF.</FormDescription>
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
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (৳)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="e.g., 500" {...field} />
                    </FormControl>
                    <FormDescription>The price of the PDF in Taka.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File upload section with status indicators */}
              <div className="space-y-2">
                <FormLabel>PDF File (Required)</FormLabel>
                <FileUpload
                  onFileChange={(file) => {
                    setFile(file)
                    setUploadStatus("idle")
                  }}
                  accept=".pdf"
                  maxSize={10} // 10MB
                />
                <FormDescription>
                  Upload a PDF file (max 10MB). The file will be automatically processed.
                </FormDescription>

                {uploadStatus === "uploading" && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertTitle>Uploading</AlertTitle>
                    <AlertDescription>Your file is being uploaded. Please wait...</AlertDescription>
                  </Alert>
                )}

                {uploadStatus === "success" && (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle>Upload Successful</AlertTitle>
                    <AlertDescription>Your file has been uploaded successfully.</AlertDescription>
                  </Alert>
                )}

                {uploadStatus === "error" && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle>Upload Failed</AlertTitle>
                    <AlertDescription>There was an error uploading your file. Please try again.</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/pdfs")} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create PDF"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

