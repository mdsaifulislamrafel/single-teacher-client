"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Badge } from "../../../components/ui/badge"
import { Skeleton } from "../../../components/ui/skeleton"
import { api } from "../../../lib/api"
import { useToast } from "../../../components/ui/use-toast"
import Link from "next/link"
import { Search, BookOpen, Users } from "lucide-react"

export default function CoursesPage() {
  const { toast } = useToast()
  const [courses, setCourses] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch categories
        const categoriesResponse = await api.get("/categories")
        console.log("Categories response:", categoriesResponse)

        // Handle different response formats
        let categoriesData = []
        if (Array.isArray(categoriesResponse)) {
          categoriesData = categoriesResponse
        } else if (categoriesResponse && typeof categoriesResponse === "object") {
          if (Array.isArray(categoriesResponse.categories)) {
            categoriesData = categoriesResponse.categories
          } else if (Array.isArray(categoriesResponse.data)) {
            categoriesData = categoriesResponse.data
          }
        }

        setCategories(categoriesData)

        // Fetch courses (subcategories)
        const coursesResponse = await api.get("/subcategories")
        console.log("Courses response:", coursesResponse)

        // Handle different response formats
        let coursesData = []
        if (Array.isArray(coursesResponse)) {
          coursesData = coursesResponse
        } else if (coursesResponse && typeof coursesResponse === "object") {
          if (Array.isArray(coursesResponse.subcategories)) {
            coursesData = coursesResponse.subcategories
          } else if (Array.isArray(coursesResponse.data)) {
            coursesData = coursesResponse.data
          }
        }

        setCourses(coursesData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load courses",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Filter courses based on search term and selected category
  const filteredCourses = courses.filter((course) => {
    if (!course || !course.name) return false

    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory ? course.category?._id === selectedCategory : true

    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-10 w-full max-w-md" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-24" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category._id}
                variant={selectedCategory === category._id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category._id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Courses Found</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn't find any courses matching your search criteria. Try adjusting your filters or search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course._id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{course.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{course.videoCount || 0} videos</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{course.enrolledCount || 0} students</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{course.category?.name || "Uncategorized"}</Badge>
                    <span className="font-bold">৳{course.price?.toFixed(2) || "0.00"}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/courses/${course._id}`}>View Course</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

