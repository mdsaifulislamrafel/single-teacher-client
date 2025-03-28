"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Input } from "../../../../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { FolderOpen, MoreVertical, Plus, Search, Edit, Trash, Video } from "lucide-react"
import { toast } from "sonner"
import { categoryApi, subcategoryApi } from "../../../../lib/api"
import { Skeleton } from "../../../../components/ui/skeleton"

interface Category {
  _id: string
  name: string
  description: string
  createdAt: string
}

interface Subcategory {
  _id: string
  name: string
  description: string
  category: {
    _id: string
    name: string
  }
  createdAt: string
}

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("Fetching categories...")
        // Fetch categories
        const categoriesData = await categoryApi.getAll()
        console.log("Categories response:", categoriesData)

        // Handle different response formats
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData)
        } else if (categoriesData && Array.isArray(categoriesData.data)) {
          setCategories(categoriesData.data)
        } else {
          console.error("Categories data is not an array:", categoriesData)
          setCategories([])
        }

        console.log("Fetching subcategories...")
        // Fetch subcategories
        const subcategoriesData = await subcategoryApi.getAll()
        console.log("Subcategories response:", subcategoriesData)

        // Handle different response formats
        if (Array.isArray(subcategoriesData)) {
          setSubcategories(subcategoriesData)
        } else if (subcategoriesData && Array.isArray(subcategoriesData.data)) {
          setSubcategories(subcategoriesData.data)
        } else {
          console.error("Subcategories data is not an array:", subcategoriesData)
          setSubcategories([])
        }
      } catch (error: any) {
        console.error("Error fetching data:", error)
        setError(error.message || "Failed to load data")
        toast.error("Failed to load categories: " + (error.message || "Unknown error"))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredSubcategories = subcategories.filter(
    (subcategory) =>
      subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subcategory.category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return
    }

    try {
      await categoryApi.delete(id)
      setCategories(categories.filter((category) => category._id !== id))
      toast.success("Category deleted successfully")
    } catch (error: any) {
      console.error("Error deleting category:", error)
      toast.error(error.message || "Failed to delete category")
    }
  }

  const handleDeleteSubcategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subcategory? This action cannot be undone.")) {
      return
    }

    try {
      await subcategoryApi.delete(id)
      setSubcategories(subcategories.filter((subcategory) => subcategory._id !== id))
      toast.success("Subcategory deleted successfully")
    } catch (error: any) {
      console.error("Error deleting subcategory:", error)
      toast.error(error.message || "Failed to delete subcategory")
    }
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Categories Management</h1>
        </div>
        <Card className="w-full p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Data</h2>
            <p className="mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories Management</h1>
        <div className="flex gap-2">
          <Link href="/admin/categories/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </Link>
          <Link href="/admin/subcategories/new">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Subcategory
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search categories and subcategories..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList>
          <TabsTrigger value="categories">Main Categories</TabsTrigger>
          <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Main Categories</CardTitle>
              <CardDescription>Manage your main course categories.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <TableRow key={`skeleton-${index}`}>
                          <TableCell>
                            <Skeleton className="h-6 w-[150px]" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-[200px]" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-[100px]" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                  ) : filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No categories found. Try a different search term or create a new category.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FolderOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                            {category.name}
                          </div>
                        </TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <Link href={`/admin/categories/${category._id}`}>
                                <DropdownMenuItem>
                                  <FolderOpen className="mr-2 h-4 w-4" />
                                  View Subcategories
                                </DropdownMenuItem>
                              </Link>
                              <Link href={`/admin/categories/${category._id}/edit`}>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteCategory(category._id)}
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
        </TabsContent>
        <TabsContent value="subcategories" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Subcategories</CardTitle>
              <CardDescription>Manage your course subcategories.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Parent Category</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <TableRow key={`skeleton-${index}`}>
                          <TableCell>
                            <Skeleton className="h-6 w-[150px]" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-[150px]" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-[100px]" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                  ) : filteredSubcategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No subcategories found. Try a different search term or create a new subcategory.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubcategories.map((subcategory) => (
                      <TableRow key={subcategory._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FolderOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                            {subcategory.name}
                          </div>
                        </TableCell>
                        <TableCell>{subcategory.category.name}</TableCell>
                        <TableCell>{new Date(subcategory.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <Link href={`/admin/subcategories/${subcategory._id}/videos`}>
                                <DropdownMenuItem>
                                  <Video className="mr-2 h-4 w-4" />
                                  View Videos
                                </DropdownMenuItem>
                              </Link>
                              <Link href={`/admin/subcategories/${subcategory._id}/edit`}>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteSubcategory(subcategory._id)}
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
        </TabsContent>
      </Tabs>
    </div>
  )
}

