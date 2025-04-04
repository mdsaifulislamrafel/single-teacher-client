import { createBrowserRouter } from "react-router-dom";
import Navbar from "../components/Navbar";
import HomePage from "../components/HomePage";
import AdminLayout from "../components/admin/AdminLayout";
import Dashboard from "../components/admin/Dashboard";
import PaymentManagement from "../components/admin/PaymentManagement";
import MyCourses from "../components/user/MyCourses";
import MyPDFs from "../components/user/MyPDFs";
import MyPayments from "../components/user/MyPayments";
import MyProfile from "../components/user/MyProfile";
import PrivateRoute from "./PrivateRoute";
import RegisterForm from "../sheard/RegisterForm";
import { LoginForm } from "../sheard/LoginForm";
import UserLayout from "../components/user/UserLayout";
import ProtectedRoute from "./ProtectedRoute";
import CategoryManagement from "../components/admin/CategoryManage/CategoryManagement";
import UserManagement from "../components/admin/UserManage/UserManagement";
import CreateCategory from "../components/admin/CategoryManage/CreateCategory";
import CreateSubCategory from "../components/admin/SubCategoryManage/CreateSubCategory";
import UpdateCategory from "../components/admin/CategoryManage/UpdateCategory";
import CreateVideo from "../components/admin/Video/CreateVideo";
import VideoManage from "../components/admin/Video/VideoManage";
import PdfManage from "../components/admin/PdfManage/PdfManage";
import CreatePdf from "../components/admin/PdfManage/CreatePdf";
import EditPDF from "../components/admin/PdfManage/EditPDF";
import UserDashboard from "../components/user/UserDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="mt-16">
          <HomePage />
        </div>
      </div>
    ),
  },
  {
    path: "/register",
    element: (
      <ProtectedRoute>
        <RegisterForm />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute>
        <LoginForm />
      </ProtectedRoute>
    ),
  },

  // Admin Routes
  {
    path: "/admin",
    element: <PrivateRoute allowedRoles={["admin"]} />,
    children: [
      {
        path: "",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "users", element: <UserManagement /> },
          { path: "my-profile", element: <MyProfile /> },
          { path: "categories", element: <CategoryManagement /> },
          { path: "create-categories", element: <CreateCategory /> },
          { path: "update-categories/:id", element: <UpdateCategory /> },
          { path: "create-subcategories", element: <CreateSubCategory /> },
          { path: "create-videos", element: <CreateVideo /> },
          { path: "videos", element: <VideoManage /> },
          { path: "pdfs", element: <PdfManage /> },
          { path: "create-pdf", element: <CreatePdf /> },
          { path: "edit-pdf/:id", element: <EditPDF /> },
          { path: "payments", element: <PaymentManagement /> },
        ],
      },
    ],
  },

  // User Routes
  {
    path: "/user",
    element: <PrivateRoute allowedRoles={["user"]} />,
    children: [
      {
        path: "",
        element: <UserLayout />,
        children: [
          { index: true, element: <UserDashboard /> },
          { path: "my-courses", element: <MyCourses /> },
          { path: "my-pdfs", element: <MyPDFs /> },
          { path: "my-payments", element: <MyPayments /> },
          { path: "my-profile", element: <MyProfile /> },
        ],
      },
    ],
  },
]);
