import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../provider/AuthContext";
import {
  Bars3Icon,
  ChartBarIcon,
  CurrencyBangladeshiIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  VideoCameraIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { BiLogOut } from "react-icons/bi";
import { toast } from "sonner";

function AdminLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const adminMenuItems = [
    { title: "ড্যাশবোর্ড", icon: ChartBarIcon, path: "/admin" },
    { title: "ইউজার ম্যানেজমেন্ট", icon: UsersIcon, path: "/admin/users" },
    {
      title: "ক্যাটাগরি ম্যানেজমেন্ট",
      icon: FolderIcon,
      path: "/admin/categories",
    },
    {
      title: "ভিডিও ম্যানেজমেন্ট",
      icon: VideoCameraIcon,
      path: "/admin/videos",
    },
    {
      title: "পেমেন্ট ম্যানেজমেন্ট",
      icon: CurrencyBangladeshiIcon,
      path: "/admin/payments",
    },
    { title: "হোম", icon: HomeIcon, path: "/" },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out", {
      duration: 1000,
    });
  };

  // const userMenuItems = [
  //   { title: "আমার প্রোফাইল", icon: UsersIcon, path: "/user/my-profile" },
  //   { title: "আমার কোর্স", icon: VideoCameraIcon, path: "/user/my-courses" },
  //   { title: "আমার PDF", icon: FolderIcon, path: "/user/my-pdfs" },
  //   {
  //     title: "আমার পেমেন্ট",
  //     icon: CurrencyBangladeshiIcon,
  //     path: "/user/my-payments",
  //   },
  //   { title: "হোম", icon: HomeIcon, path: "/" },
  // ];

  const menuItems = adminMenuItems;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="md:hidden bg-white p-4 shadow-md">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-white shadow-md`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">অ্যাডমিন প্যানেল</h2>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
          <button
            onClick={() => handleLogout()}
            className="flex justify-center gap-2 items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
          >
            <BiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
