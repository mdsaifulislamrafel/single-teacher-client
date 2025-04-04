
import { Link, Outlet, useLocation } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../../provider/AuthContext"
import {
  Bars3Icon,
  ChartBarIcon,
  CurrencyBangladeshiIcon,
  HomeIcon,
  UsersIcon,
  VideoCameraIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { BiLogOut } from "react-icons/bi"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { LiaFilePdfSolid } from "react-icons/lia"

function UserLayout() {
  const { logout } = useAuth()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Menu items for user
  const userMenuItems = [
    { title: "ড্যাশবোর্ড", icon: ChartBarIcon, path: "/user" },
    { title: "আমার প্রোফাইল", icon: UsersIcon, path: "/user/my-profile" },
    { title: "আমার কোর্স", icon: VideoCameraIcon, path: "/user/my-courses" },
    { title: "আমার PDF", icon: LiaFilePdfSolid, path: "/user/my-pdfs" },
    {
      title: "আমার পেমেন্ট",
      icon: CurrencyBangladeshiIcon,
      path: "/user/my-payments",
    },
    { title: "হোম", icon: HomeIcon, path: "/" },
  ]

  const handleLogout = () => {
    logout()
    toast.success("Successfully logged out", {
      duration: 1000,
    })
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white p-4 shadow-md">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar with Animation */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Overlay (Backdrop) */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 p-4"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <button onClick={() => setIsSidebarOpen(false)} className="mb-4 p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-bold mb-4">ইউজার প্যানেল</h2>
              <nav className="space-y-2">
                {userMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === item.path ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
              <button
                onClick={handleLogout}
                className="mt-4 flex justify-center gap-2 items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
              >
                <BiLogOut /> Logout
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-4">ইউজার প্যানেল</h2>
        <nav className="space-y-2">
          {userMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                location.pathname === item.path ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-4 flex justify-center gap-2 items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
        >
          <BiLogOut /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 bg-gray-50">
        <Outlet />
      </div>
    </div>
  )
}

export default UserLayout

