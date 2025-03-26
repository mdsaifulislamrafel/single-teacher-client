import { NextResponse } from "next/server"

// In a real implementation, you would use a database
// This is just a placeholder for demonstration purposes

export async function GET() {
  // Simulate fetching videos from a database
  const videos = [
    {
      id: "1",
      title: "Introduction to Bangla Alphabet",
      category: "Bangla Book",
      categoryId: "1",
      subcategory: "Chapter 1: Introduction",
      subcategoryId: "1",
      duration: "15:30",
      vimeoId: "123456789",
      createdAt: "2023-01-25",
    },
    {
      id: "2",
      title: "Bangla Vowels and Consonants",
      category: "Bangla Book",
      categoryId: "1",
      subcategory: "Chapter 1: Introduction",
      subcategoryId: "1",
      duration: "18:45",
      vimeoId: "123456790",
      createdAt: "2023-01-27",
    },
    {
      id: "3",
      title: "Basic Sentence Structure",
      category: "Bangla Book",
      categoryId: "1",
      subcategory: "Chapter 2: Grammar",
      subcategoryId: "2",
      duration: "22:10",
      vimeoId: "123456791",
      createdAt: "2023-02-05",
    },
    {
      id: "4",
      title: "Algebra Basics: Variables",
      category: "Mathematics",
      categoryId: "2",
      subcategory: "Algebra",
      subcategoryId: "4",
      duration: "20:15",
      vimeoId: "123456792",
      createdAt: "2023-02-25",
    },
    {
      id: "5",
      title: "Solving Linear Equations",
      category: "Mathematics",
      categoryId: "2",
      subcategory: "Algebra",
      subcategoryId: "4",
      duration: "25:30",
      vimeoId: "123456793",
      createdAt: "2023-02-28",
    },
    {
      id: "6",
      title: "Introduction to Physics",
      category: "Science",
      categoryId: "3",
      subcategory: "Physics",
      subcategoryId: "6",
      duration: "19:45",
      vimeoId: "123456794",
      createdAt: "2023-03-18",
    },
    {
      id: "7",
      title: "Newton's Laws of Motion",
      category: "Science",
      categoryId: "3",
      subcategory: "Physics",
      subcategoryId: "6",
      duration: "24:20",
      vimeoId: "123456795",
      createdAt: "2023-03-22",
    },
    {
      id: "8",
      title: "Introduction to Chemistry",
      category: "Science",
      categoryId: "3",
      subcategory: "Chemistry",
      subcategoryId: "7",
      duration: "21:15",
      vimeoId: "123456796",
      createdAt: "2023-03-25",
    },
  ]

  return NextResponse.json(videos)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    if (!body.title || !body.categoryId || !body.subcategoryId || !body.vimeoId || !body.duration) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // In a real implementation, you would save the video to a database
    // For now, we'll just return a success response with the data
    const newVideo = {
      id: Math.random().toString(36).substring(2, 9),
      title: body.title,
      category: "Category Name", // In a real implementation, you would fetch this
      categoryId: body.categoryId,
      subcategory: "Subcategory Name", // In a real implementation, you would fetch this
      subcategoryId: body.subcategoryId,
      duration: body.duration,
      vimeoId: body.vimeoId,
      createdAt: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json(newVideo, { status: 201 })
  } catch (error) {
    console.error("Error creating video:", error)
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 })
  }
}

