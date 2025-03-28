import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Star, Users } from "lucide-react"

interface FeaturedCourseCardProps {
  course: {
    id: string
    title: string
    description: string
    imageUrl: string
    instructor: string
    price: string
    rating: number
    students: number
  }
}

export function FeaturedCourseCard({ course }: FeaturedCourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <div className="aspect-video relative">
          <Image src={course.imageUrl || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-1">{course.title}</CardTitle>
          <CardDescription className="flex items-center text-sm">
            <span>By {course.instructor}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{course.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{course.students}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Badge variant="secondary" className="text-lg font-bold">
            {course.price}
          </Badge>
          <Button size="sm">View Course</Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

