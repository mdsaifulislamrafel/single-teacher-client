"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { categoryApi, pdfApi } from "../../../lib/api"
import { useAuth } from "../../../contexts/AuthContext"
import { toast } from "sonner"
import Link from "next/link"
import { FileText, Search, ChevronRight, Download } from "lucide-react"
import { Badge } from "../../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"

interface Category {
  _id: string
  name: string
  description: string
  createdAt: string
}

interface PDF {
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
  price: number
  fileSize: string
  downloads: number
  createdAt: string
}

export default function PDFsPage() {
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [pdfs, setPdfs] = useState<PDF[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [filteredPDFs, setFilteredPDFs] = useState<PDF[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch categories
        const categoriesResponse = await categoryApi.getAll()
        setCategories(categoriesResponse.data)

        // Fetch PDFs
        const pdfsResponse = await pdfApi.getAll()
        setPdfs(pdfsResponse.data)
        setFilteredPDFs(pdfsResponse.data)
      } catch (error) {
        console.error("Error fetching PDFs data:", error)
        toast.error("Failed to load PDFs")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter PDFs based on search term and selected category
  useEffect(() => {
    let filtered = pdfs

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (pdf) =>
          pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pdf.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pdf.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pdf.subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((pdf) => pdf.category._id === selectedCategory)
    }

    setFilteredPDFs(filtered)
  }, [searchTerm, selectedCategory, pdfs])

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">PDF Resources</h1>
          <p className="text-muted-foreground">
            Browse our collection of high-quality PDF resources to enhance your learning experience.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search PDFs..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* PDFs */}
        <div className="grid gap-6">
          <h2 className="text-2xl font-bold">Available PDFs</h2>
          {filteredPDFs.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No PDFs Found</h3>
              <p className="text-muted-foreground mb-4">We couldn't find any PDFs matching your search criteria.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPDFs.map((pdf) => (
                <Link href={`/pdfs/${pdf._id}`} key={pdf._id}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <div className="aspect-[3/4] relative bg-muted flex items-center justify-center">
                      <FileText className="h-16 w-16 text-muted-foreground" />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary">৳{pdf.price}</Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{pdf.title}</CardTitle>
                      <CardDescription>
                        {pdf.category.name} - {pdf.subcategory.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{pdf.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{pdf.fileSize}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{pdf.downloads} downloads</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        View Details <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

