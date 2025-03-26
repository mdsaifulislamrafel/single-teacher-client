
import Link from "next/link";

import { CategoryCard } from "../components/category-card";
import { Button } from "../components/ui/button";
import Navebar from "../components/shared/Navebar/Navbar";


export default function Home() {
  
  // In a real implementation, these would be fetched from the API
  const featuredCategories = [
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
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Navebar/>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Learn at Your Own Pace
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Access high-quality courses and resources to enhance your
                knowledge and skills.
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
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Featured Categories
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore our most popular learning categories and start your
                educational journey today.
              </p>
            </div>
          </div>
          <div className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch py-8">
            {featuredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
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

      {/* How It Works */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                How It Works
              </h2>
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
                Explore our categories and find the courses or PDFs that match
                your learning goals.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <h3 className="text-xl font-bold">Purchase</h3>
              <p className="text-muted-foreground text-center">
                Make a payment via the specified number and wait for admin
                approval.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <h3 className="text-xl font-bold">Learn</h3>
              <p className="text-muted-foreground text-center">
                Access your courses or download PDFs and start learning at your
                own pace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-24">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Learning Platform. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
