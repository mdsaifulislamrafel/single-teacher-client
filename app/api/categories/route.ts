import { NextResponse } from "next/server"

// In a real implementation, you would use a database
// This is just a placeholder for demonstration purposes

export async function GET() {
  // Simulate fetching categories from a database
  const categories = [
    {
      id: "1",
      name: "Bangla Book",
      description: "Learn Bangla language and literature",
      subcategories: 5,
      videos: 45,
      createdAt: "2023-01-15",
    },
    {
      id: "2",
      name: "Mathematics",
      description: "Master mathematical concepts and problem solving",
      subcategories: 8,
      videos: 72,
      createdAt: "2023-02-20",
    },
    {
      id: "3",
      name: "Science",
      description: "Explore scientific principles and experiments",
      subcategories: 6,
      videos: 54,
      createdAt: "2023-03-10",
    },
    {
      id: "4",
      name: "English",
      description: "Improve English language skills",
      subcategories: 4,
      videos: 36,
      createdAt: "2023-04-05",
    },
    {
      id: "5",
      name: "History",
      description: "Learn about historical events and figures",
      subcategories: 3,
      videos: 27,
      createdAt: "2023-05-12",
    },
  ]

  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    if (!body.name || !body.description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 })
    }

    // In a real implementation, you would save the category to a database
    // For now, we'll just return a success response with the data
    const newCategory = {
      id: Math.random().toString(36).substring(2, 9),
      name: body.name,
      description: body.description,
      subcategories: 0,
      videos: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

