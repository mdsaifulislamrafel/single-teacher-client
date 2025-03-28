import { NextResponse } from "next/server"

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

