"use client"

import type React from "react"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { ModeToggle } from "../../components/mode-toggle"
import { useAuth } from "../../contexts/AuthContext"
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Home,
  FolderOpen,
  Video,
  User,
  Menu,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"
import { cn } from "../../lib/utils"
import { toast } from "sonner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, isAdmin, logout, loading } = useAuth()

  // Check access rights and redirect if needed
  useEffect(() => {
    if (!loading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        toast.error("Please login to access this page")
        router.push("/login")
        return
      }

      // If trying to access admin routes without admin role
      if (pathname?.startsWith("/admin") && !isAdmin) {
        toast.error("You don't have permission to access this page")
        router.push("/dashboard")
        return
      }

      // If admin trying to access user routes
      if (isAdmin && pathname?.startsWith("/dashboard") && !pathname?.startsWith("/dashboard/profile")) {
        router.push("/admin/dashboard")
        return
      }
    }
  }, [loading, isAuthenticated, isAdmin, pathname, router])

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // If not authenticated, don't render the layout
  if (!isAuthenticated) {
    return null
  }

  const userMenuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard",
    },
    {
      title: "My Courses",
      href: "/dashboard/courses",
      icon: BookOpen,
      isActive: pathname?.startsWith("/dashboard/courses"),
    },
    {
      title: "My PDFs",
      href: "/dashboard/pdfs",
      icon: FileText,
      isActive: pathname === "/dashboard/pdfs",
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
      isActive: pathname?.startsWith("/dashboard/profile"),
    },
    {
      title: "My Payments",
      href: "/dashboard/payments",
      icon: CreditCard,
      isActive: pathname === "/dashboard/payments",
    },
  ]

  const adminMenuItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/admin/dashboard",
    },
    {
      title: "Categories",
      href: "/admin/categories",
      icon: FolderOpen,
      isActive: pathname?.startsWith("/admin/categories"),
    },
    {
      title: "Videos",
      href: "/admin/videos",
      icon: Video,
      isActive: pathname?.startsWith("/admin/videos"),
    },
    {
      title: "PDFs",
      href: "/admin/pdfs",
      icon: FileText,
      isActive: pathname?.startsWith("/admin/pdfs"),
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
      isActive: pathname?.startsWith("/admin/users"),
    },
    {
      title: "Payments",
      href: "/admin/payments",
      icon: CreditCard,
      isActive: pathname === "/admin/payments",
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
      isActive: pathname === "/admin/settings",
    },
  ]

  const menuItems = isAdmin ? adminMenuItems : userMenuItems

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="flex flex-col h-full">
              <div className="py-4 border-b">
                <Link href="/" className="flex items-center gap-2 px-2">
                  <span className="text-xl font-bold">Learning Platform</span>
                </Link>
              </div>
              <nav className="flex-1 py-4">
                <div className="px-4 py-2">
                  <h2 className="mb-2 text-lg font-semibold">{isAdmin ? "Admin" : "User"} Menu</h2>
                  <div className="space-y-1">
                    {menuItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                          item.isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>
              <div className="border-t py-4 px-4">
                <div className="flex flex-col gap-2">
                  <Link href="/">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Home className="mr-2 h-4 w-4" />
                      Back to Home
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start" size="sm" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between">
          <div className="hidden lg:block">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold">Learning Platform</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium hidden md:block">{user?.name}</span>
              <Avatar>
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden lg:block w-64 border-r bg-background">
          <div className="flex flex-col h-full">
            <nav className="flex-1 py-4">
              <div className="px-4 py-2">
                <h2 className="mb-2 text-lg font-semibold">{isAdmin ? "Admin" : "User"} Menu</h2>
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                        item.isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
            <div className="border-t py-4 px-4">
              <div className="flex flex-col gap-2">
                <Link href="/">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

