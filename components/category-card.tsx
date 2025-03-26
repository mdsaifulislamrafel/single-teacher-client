import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

interface CategoryCardProps {
  category: {
    id: string
    title: string
    description: string
    imageUrl: string
    subcategoryCount: number
    videoCount: number
  }
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/courses/${category.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <div className="aspect-video relative">
          <Image src={category.imageUrl || "/placeholder.svg"} alt={category.title} fill className="object-cover" />
        </div>
        <CardHeader>
          <CardTitle>{category.title}</CardTitle>
          <CardDescription>{category.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Badge variant="outline">{category.subcategoryCount} Subcategories</Badge>
            <Badge variant="outline">{category.videoCount} Videos</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">Click to explore</p>
        </CardFooter>
      </Card>
    </Link>
  )
}

