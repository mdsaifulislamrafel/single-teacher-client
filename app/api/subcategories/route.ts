import { NextResponse } from "next/server"

// In a real implementation, you would use a database
// This is just a placeholder for demonstration purposes

// export async function GET() {
//   // Simulate fetching subcategories from a database
//   const subcategories = [
//     {
//       id: "1",
//       name: "Chapter 1: Introduction",
//       parentCategory: "Bangla Book",
//       parentCategoryId: "1",
//       videos: 10,
//       createdAt: "2023-01-20",
//     },
//     {
//       id: "2",
//       name: "Chapter 2: Grammar",
//       parentCategory: "Bangla Book",
//       parentCategoryId: "1",
//       videos: 12,
//       createdAt: "2023-01-25",
//     },
//     {
//       id: "3",
//       name: "Chapter 3: Literature",
//       parentCategory: "Bangla Book",
//       parentCategoryId: "1",
//       videos: 8,
//       createdAt: "2023-02-01",
//     },
//     {
//       id: "4",
//       name: "Algebra",
//       parentCategory: "Mathematics",
//       parentCategoryId: "2",
//       videos: 15,
//       createdAt: "2023-02-22",
//     },
//     {
//       id: "5",
//       name: "Geometry",
//       parentCategory: "Mathematics",
//       parentCategoryId: "2",
//       videos: 12,
//       createdAt: "2023-02-28",
//     },
//     {
//       id: "6",
//       name: "Physics",
//       parentCategory: "Science",
//       parentCategoryId: "3",
//       videos: 18,
//       createdAt: "2023-03-15",
//     },
//     {
//       id: "7",
//       name: "Chemistry",
//       parentCategory: "Science",
//       parentCategoryId: "3",
//       videos: 16,
//       createdAt: "2023-03-20",
//     },
//     {
//       id: "8",
//       name: "Biology",
//       parentCategory: "Science",
//       parentCategoryId: "3",
//       videos: 14,
//       createdAt: "2023-03-25",
//     },
//   ]

//   return NextResponse.json(subcategories)
// }

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    if (!body.name || !body.parentCategoryId) {
      return NextResponse.json({ error: "Name and parent category are required" }, { status: 400 })
    }

    // In a real implementation, you would save the subcategory to a database
    // For now, we'll just return a success response with the data
    const newSubcategory = {
      id: Math.random().toString(36).substring(2, 9),
      name: body.name,
      parentCategoryId: body.parentCategoryId,
      parentCategory: "Parent Category Name", // In a real implementation, you would fetch this
      videos: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json(newSubcategory, { status: 201 })
  } catch (error) {
    console.error("Error creating subcategory:", error)
    return NextResponse.json({ error: "Failed to create subcategory" }, { status: 500 })
  }
}

