import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

// Category API
export const categoryApi = {
  getAll: () => api.get("/categories"),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: any) => api.post("/categories", data),
  update: (id: string, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
  getSubcategories: (id: string) => api.get(`/categories/${id}/subcategories`),
}

// Subcategory API
export const subcategoryApi = {
  getAll: () => api.get("/subcategories"),
  getById: (id: string) => api.get(`/subcategories/${id}`),
  create: (data: any) => api.post("/subcategories", data),
  update: (id: string, data: any) => api.put(`/subcategories/${id}`, data),
  delete: (id: string) => api.delete(`/subcategories/${id}`),
  getVideos: (id: string) => api.get(`/subcategories/${id}/videos`),
  checkAccess: (id: string) => api.get(`/subcategories/${id}/access`),
  getUserProgress: (id: string) => api.get(`/subcategories/${id}/progress`),
}

// Video API
export const videoApi = {
  getAll: () => api.get("/videos"),
  getById: (id: string) => api.get(`/videos/${id}`),
  create: (data: any) => api.post("/videos", data),
  update: (id: string, data: any) => api.put(`/videos/${id}`, data),
  delete: (id: string) => api.delete(`/videos/${id}`),
  checkAccess: (data: any) => api.post("/videos/access", data),
  markCompleted: (data: any) => api.post("/videos/complete", data),
}

// File upload API
export const fileApi = {
  upload: async (file: File): Promise<{ url: string; size: string }> => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      // Create a new axios instance for the file upload to set the correct content type
      const uploadApi = axios.create({
        baseURL: API_URL,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      const response = await uploadApi.post("/upload/pdf", formData)

      return {
        url: response.data.file.url,
        size: response.data.file.size,
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      throw new Error("Failed to upload file")
    }
  },
}

// PDF API
export const pdfApi = {
  getAll: () => api.get("/pdfs"),
  getById: (id: string) => api.get(`/pdfs/${id}`),
  create: (data: any) => api.post("/pdfs", data),
  update: (id: string, data: any) => api.put(`/pdfs/${id}`, data),
  delete: (id: string) => api.delete(`/pdfs/${id}`),
  checkAccess: (data: any) => api.post("/pdfs/access", data),
}

// User API
export const userApi = {
  getAll: () => api.get("/users"),
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  getCourses: (id: string) => api.get(`/users/${id}/courses`),
  getPDFs: (id: string) => api.get(`/users/${id}/pdfs`),
  getPayments: (id: string) => api.get(`/users/${id}/payments`),
}

// Auth API
export const authApi = {
  register: (data: any) => api.post("/auth/register", data),
  login: (data: any) => api.post("/auth/login", data),
  googleAuth: (data: any) => api.post("/auth/google", data),
  getCurrentUser: () => api.get("/auth/me"),
}

// Payment API
export const paymentApi = {
  getAll: () => api.get("/payments"),
  getById: (id: string) => api.get(`/payments/${id}`),
  create: (data: any) => api.post("/payments", data),
  updateStatus: (id: string, data: any) => api.patch(`/payments/${id}/status`, data),
  getPending: () => api.get("/payments/pending"),
}

export default api

