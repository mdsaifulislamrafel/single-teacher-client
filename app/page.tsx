"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "../components/ui/button"
import { CategoryCard } from "../components/category-card"
import { TestimonialCard } from "../components/testimonial-card"
import { FeaturedCourseCard } from "../components/featured-course-card"
import {
  BookOpen,
  FileText,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react"
import { api } from "../lib/api"
import { Skeleton } from "../components/ui/skeleton"

export default function Home() {
  const [featuredCategories, setFeaturedCategories] = useState<any[]>([])
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Testimonials (static data)
  const testimonials = [
    {
      id: "1",
      name: "Farhan Ahmed",
      role: "Student, Class 10",
      content:
        "The Bangla Book course helped me improve my grammar and writing skills significantly. The video lessons are clear and easy to follow.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
    {
      id: "2",
      name: "Nusrat Jahan",
      role: "Student, Class 12",
      content:
        "Mathematics was always challenging for me, but after taking the Advanced Mathematics course, I've gained confidence and improved my grades.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4,
    },
    {
      id: "3",
      name: "Imran Hossain",
      role: "Parent",
      content:
        "My son has been using this platform for his science studies, and I've seen remarkable improvement in his understanding and test scores.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
  ]

  // Stats (static data)
  const stats = [
    { label: "Students", value: "10,000+", icon: Users },
    { label: "Courses", value: "150+", icon: BookOpen },
    { label: "PDFs", value: "300+", icon: FileText },
    { label: "Awards", value: "15+", icon: Award },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch featured categories
        const categoriesResponse = await api.get("/categories")
        console.log("Categories response:", categoriesResponse)

        // Handle different response formats
        let categories = []
        if (Array.isArray(categoriesResponse)) {
          categories = categoriesResponse
        } else if (categoriesResponse && typeof categoriesResponse === "object") {
          if (Array.isArray(categoriesResponse.categories)) {
            categories = categoriesResponse.categories
          } else if (Array.isArray(categoriesResponse.data)) {
            categories = categoriesResponse.data
          }
        }

        // Take only the first 3 categories or all if less than 3
        const topCategories = categories.slice(0, 3).map((category) => ({
          id: category._id,
          title: category.name,
          description: category.description || "Explore our courses in this category",
          imageUrl: category.imageUrl || "/placeholder.svg?height=200&width=300",
          subcategoryCount: category.subcategoryCount || 0,
          videoCount: category.videoCount || 0,
        }))

        setFeaturedCategories(topCategories.length > 0 ? topCategories : [])

        // Fetch featured courses (subcategories)
        const coursesResponse = await api.get("/subcategories")
        console.log("Courses response:", coursesResponse)

        // Handle different response formats
        let courses = []
        if (Array.isArray(coursesResponse)) {
          courses = coursesResponse
        } else if (coursesResponse && typeof coursesResponse === "object") {
          if (Array.isArray(coursesResponse.subcategories)) {
            courses = coursesResponse.subcategories
          } else if (Array.isArray(coursesResponse.data)) {
            courses = coursesResponse.data
          }
        }

        // Take only the first 3 courses or all if less than 3
        const topCourses = courses.slice(0, 3).map((course) => ({
          id: course._id,
          title: course.name,
          description: course.description || "Learn more about this course",
          imageUrl: course.imageUrl || "/placeholder.svg?height=200&width=300",
          instructor: course.instructor || "Expert Instructor",
          price: `৳${course.price?.toFixed(2) || "0.00"}`,
          rating: course.rating || 4.5,
          students: course.enrolledCount || 0,
        }))

        setFeaturedCourses(topCourses.length > 0 ? topCourses : [])
      } catch (error) {
        console.error("Error fetching data for homepage:", error)
        // If API fails, use fallback data
        setFeaturedCategories([
          {
            id: "1",
            title: "Bangla Book",
            description: "Learn Bangla language and literature",
            imageUrl: "/placeholder.svg?height=200&width=300",
            subcategoryCount: 5,
            videoCount: 45,
          },
          {
            id: "2",
            title: "Mathematics",
            description: "Master mathematical concepts and problem solving",
            imageUrl: "/placeholder.svg?height=200&width=300",
            subcategoryCount: 8,
            videoCount: 72,
          },
          {
            id: "3",
            title: "Science",
            description: "Explore scientific principles and experiments",
            imageUrl: "/placeholder.svg?height=200&width=300",
            subcategoryCount: 6,
            videoCount: 54,
          },
        ])

        setFeaturedCourses([
          {
            id: "1",
            title: "Complete Bangla Grammar",
            description: "Master Bangla grammar rules and sentence structures",
            imageUrl: "/placeholder.svg?height=200&width=300",
            instructor: "Rahim Ahmed",
            price: "৳1,200",
            rating: 4.8,
            students: 1245,
          },
          {
            id: "2",
            title: "Advanced Mathematics",
            description: "Tackle complex mathematical problems with confidence",
            imageUrl: "/placeholder.svg?height=200&width=300",
            instructor: "Dr. Karim Khan",
            price: "৳1,500",
            rating: 4.9,
            students: 987,
          },
          {
            id: "3",
            title: "Physics Fundamentals",
            description: "Learn the core principles of physics with practical examples",
            imageUrl: "/placeholder.svg?height=200&width=300",
            instructor: "Prof. Salma Rahman",
            price: "৳1,300",
            rating: 4.7,
            students: 1056,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const renderSkeletonCards = (count: number) => {
    return Array(count)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Learning Platform</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/courses" className="text-sm font-medium transition-colors hover:text-primary">
              Courses
            </Link>
            <Link href="/pdfs" className="text-sm font-medium transition-colors hover:text-primary">
              PDFs
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Learn at Your Own Pace
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Access high-quality courses and resources to enhance your knowledge and skills. Study anytime,
                  anywhere.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/courses">
                  <Button size="lg">Browse Courses</Button>
                </Link>
                <Link href="/pdfs">
                  <Button variant="outline" size="lg">
                    Explore PDFs
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center">
                    <stat.icon className="mr-1 h-4 w-4 text-primary" />
                    <span className="font-medium">{stat.value}</span>
                    <span className="ml-1 text-muted-foreground">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mx-auto w-full max-w-[500px] aspect-video relative rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/placeholder.svg?height=500&width=800"
                alt="Students learning"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Categories</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore our most popular learning categories and start your educational journey today.
              </p>
            </div>
          </div>
          <div className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch py-8">
            {loading ? (
              renderSkeletonCards(3)
            ) : featuredCategories.length > 0 ? (
              featuredCategories.map((category) => <CategoryCard key={category.id} category={category} />)
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-muted-foreground">No categories found. Check back later!</p>
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <Link href="/courses">
              <Button variant="outline" size="lg">
                View All Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Popular Courses</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover our most popular courses chosen by thousands of students.
              </p>
            </div>
          </div>
          <div className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch py-8">
            {loading ? (
              renderSkeletonCards(3)
            ) : featuredCourses.length > 0 ? (
              featuredCourses.map((course) => <FeaturedCourseCard key={course.id} course={course} />)
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-muted-foreground">No courses found. Check back later!</p>
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <Link href="/courses">
              <Button className="group" size="lg">
                Explore All Courses
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform makes learning accessible and straightforward.
              </p>
            </div>
          </div>
          <div className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start py-8">
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <h3 className="text-xl font-bold">Browse & Select</h3>
              <p className="text-muted-foreground text-center">
                Explore our categories and find the courses or PDFs that match your learning goals.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <h3 className="text-xl font-bold">Purchase</h3>
              <p className="text-muted-foreground text-center">
                Make a payment via the specified number and wait for admin approval.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <h3 className="text-xl font-bold">Learn</h3>
              <p className="text-muted-foreground text-center">
                Access your courses or download PDFs and start learning at your own pace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Students Say</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear from our students about their learning experiences.
              </p>
            </div>
          </div>
          <div className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch py-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose Us</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform offers unique advantages for effective learning.
              </p>
            </div>
          </div>
          <div className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start py-8">
            <div className="flex flex-col space-y-2 border rounded-lg p-6 bg-background">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Quality Content</h3>
              <p className="text-muted-foreground">
                All our courses and materials are created by expert educators with years of experience.
              </p>
            </div>
            <div className="flex flex-col space-y-2 border rounded-lg p-6 bg-background">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Flexible Learning</h3>
              <p className="text-muted-foreground">
                Learn at your own pace, on your own schedule, from anywhere in the world.
              </p>
            </div>
            <div className="flex flex-col space-y-2 border rounded-lg p-6 bg-background">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Affordable Pricing</h3>
              <p className="text-muted-foreground">
                Get access to high-quality education at a fraction of traditional course costs.
              </p>
            </div>
            <div className="flex flex-col space-y-2 border rounded-lg p-6 bg-background">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Comprehensive Resources</h3>
              <p className="text-muted-foreground">
                Access videos, PDFs, and supplementary materials to enhance your learning experience.
              </p>
            </div>
            <div className="flex flex-col space-y-2 border rounded-lg p-6 bg-background">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your learning progress and track completed courses and materials.
              </p>
            </div>
            <div className="flex flex-col space-y-2 border rounded-lg p-6 bg-background">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Mobile Friendly</h3>
              <p className="text-muted-foreground">
                Access all content on any device - desktop, tablet, or mobile phone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Start Learning?</h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of students already learning on our platform.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg" variant="secondary">
                  Register Now
                </Button>
              </Link>
              <Link href="/courses">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Learning Platform</h3>
              <p className="text-sm text-muted-foreground">Providing quality education accessible to everyone.</p>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Youtube className="h-5 w-5" />
                  <span className="sr-only">YouTube</span>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/courses" className="text-muted-foreground hover:text-foreground">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/pdfs" className="text-muted-foreground hover:text-foreground">
                    PDFs
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-muted-foreground hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Contact Us</h3>
              <address className="not-italic text-sm text-muted-foreground">
                <p>123 Education Street</p>
                <p>Dhaka, Bangladesh</p>
                <p className="mt-2">Email: info@learningplatform.com</p>
                <p>Phone: +880 1234 567890</p>
              </address>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

