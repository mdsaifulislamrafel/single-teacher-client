import { NextResponse } from "next/server"

// In a real implementation, you would use a database
// This is just a placeholder for demonstration purposes

export async function GET() {
  // Simulate fetching users from a database
  const users = [
    {
      id: "USR-001",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/placeholder.svg",
      status: "active",
      coursesCount: 3,
      pdfsCount: 2,
      joinDate: "2023-01-15",
    },
    {
      id: "USR-002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "/placeholder.svg",
      status: "active",
      coursesCount: 2,
      pdfsCount: 5,
      joinDate: "2023-02-20",
    },
    {
      id: "USR-003",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      avatar: "/placeholder.svg",
      status: "inactive",
      coursesCount: 1,
      pdfsCount: 0,
      joinDate: "2023-03-10",
    },
    {
      id: "USR-004",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      avatar: "/placeholder.svg",
      status: "active",
      coursesCount: 4,
      pdfsCount: 3,
      joinDate: "2023-03-25",
    },
    {
      id: "USR-005",
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      avatar: "/placeholder.svg",
      status: "active",
      coursesCount: 2,
      pdfsCount: 1,
      joinDate: "2023-04-05",
    },
    {
      id: "USR-006",
      name: "Sarah Brown",
      email: "sarah.brown@example.com",
      avatar: "/placeholder.svg",
      status: "inactive",
      coursesCount: 0,
      pdfsCount: 2,
      joinDate: "2023-04-15",
    },
    {
      id: "USR-007",
      name: "David Miller",
      email: "david.miller@example.com",
      avatar: "/placeholder.svg",
      status: "active",
      coursesCount: 1,
      pdfsCount: 4,
      joinDate: "2023-04-28",
    },
  ]

  return NextResponse.json(users)
}

