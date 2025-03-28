import axios from "axios"

// Make sure this URL is correct and the backend server is running
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies/CORS
})

// Add a request interceptor to add the token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage (client-side only)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add a response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    // Improved logging to show the actual data structure
    console.log(`Response from ${response.config.url}:`, JSON.stringify(response.data, null, 2))
    return response
  },
  (error) => {
    console.error(`API Error for ${error.config?.url}:`, error.response?.data || error.message)
    return Promise.reject(error)
  },
)

// Helper functions
const handleResponse = (response: any) => {
  // Check if response is already the data we need
  if (!response) {
    console.warn("Empty response received")
    return null
  }

  // If response is an axios response object, extract the data
  if (response.data !== undefined) {
    return response.data
  }

  // Otherwise return the response itself
  return response
}

const handleError = (error: any) => {
  if (error.response) {
    console.error("API Error Response:", error.response.data)
    throw error.response.data
  }
  console.error("API Error:", error.message)
  throw error
}

// API methods
export const api = {
  get: async (endpoint: string, params = {}) => {
    try {
      console.log(`Making GET request to ${endpoint}`, params)
      const response = await axiosInstance.get(endpoint, { params })
      return handleResponse(response)
    } catch (error) {
      return handleError(error)
    }
  },
  post: async (endpoint: string, data = {}) => {
    try {
      console.log(`Making POST request to ${endpoint}`, data)
      const response = await axiosInstance.post(endpoint, data)
      return handleResponse(response)
    } catch (error) {
      return handleError(error)
    }
  },
  put: async (endpoint: string, data = {}) => {
    try {
      console.log(`Making PUT request to ${endpoint}`, data)
      const response = await axiosInstance.put(endpoint, data)
      return handleResponse(response)
    } catch (error) {
      return handleError(error)
    }
  },
  patch: async (endpoint: string, data = {}) => {
    try {
      console.log(`Making PATCH request to ${endpoint}`, data)
      const response = await axiosInstance.patch(endpoint, data)
      return handleResponse(response)
    } catch (error) {
      return handleError(error)
    }
  },
  delete: async (endpoint: string) => {
    try {
      console.log(`Making DELETE request to ${endpoint}`)
      const response = await axiosInstance.delete(endpoint)
      return handleResponse(response)
    } catch (error) {
      return handleError(error)
    }
  },
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", { email, password })
      const data = handleResponse(response)

      // Save token to localStorage if available
      if (data && data.token) {
        localStorage.setItem("token", data.token)
      }

      return data
    } catch (error) {
      return handleError(error)
    }
  },
  register: async (userData: any) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData)
      return handleResponse(response)
    } catch (error) {
      return handleError(error)
    }
  },
  googleAuth: async (googleData: any) => {
    try {
      console.log("Sending Google auth data:", googleData)
      const response = await axiosInstance.post("/auth/google", googleData)
      const data = handleResponse(response)
      console.log("Google auth response data:", data)

      // Save token to localStorage if available
      if (data && data.token) {
        localStorage.setItem("token", data.token)
        console.log("Token saved to localStorage")
      } else {
        console.warn("No token received from Google auth")
      }

      return data
    } catch (error) {
      console.error("Google auth API error:", error)
      return handleError(error)
    }
  },
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get("/auth/me")
      const userData = handleResponse(response)
      console.log("Current user data from API:", userData)
      return userData
    } catch (error) {
      console.error("Get current user error:", error)
      return handleError(error)
    }
  },
  logout: () => {
    localStorage.removeItem("token")
    console.log("User logged out, token removed")
  },
}

// Category API
export const categoryApi = {
  getAll: () => api.get("/categories"),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (categoryData: any) => api.post("/categories", categoryData),
  update: (id: string, categoryData: any) => api.put(`/categories/${id}`, categoryData),
  delete: (id: string) => api.delete(`/categories/${id}`),
}

// Subcategory API
export const subcategoryApi = {
  getAll: () => api.get("/subcategories"),
  getById: (id: string) => api.get(`/subcategories/${id}`),
  create: (subcategoryData: any) => api.post("/subcategories", subcategoryData),
  update: (id: string, subcategoryData: any) => api.put(`/subcategories/${id}`, subcategoryData),
  delete: (id: string) => api.delete(`/subcategories/${id}`),
  getVideos: (id: string) => api.get(`/subcategories/${id}/videos`),
  checkAccess: (id: string) => api.get(`/subcategories/${id}/access`),
  getUserProgress: (id: string) => api.get(`/subcategories/${id}/progress`),
}

// Video API
export const videoApi = {
  getAll: () => api.get("/videos"),
  getById: (id: string) => api.get(`/videos/${id}`),
  create: (videoData: any) => api.post("/videos", videoData),
  update: (id: string, videoData: any) => api.put(`/videos/${id}`, videoData),
  delete: (id: string) => api.delete(`/videos/${id}`),
  markCompleted: (data: { videoId: string; subcategoryId: string }) =>
    api.post(`/videos/${data.videoId}/complete`, { subcategoryId: data.subcategoryId }),
  uploadToVimeo: async (file: File, title: string, description: string) => {
    const formData = new FormData()
    formData.append("video", file)
    formData.append("title", title)
    formData.append("description", description)

    try {
      const response = await axiosInstance.post("/upload/video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return handleResponse(response)
    } catch (error) {
      return handleError(error)
    }
  },
}

// PDF API
export const pdfApi = {
  getAll: () => api.get("/pdfs"),
  getById: (id: string) => api.get(`/pdfs/${id}`),
  create: (pdfData: any) => api.post("/pdfs", pdfData),
  update: (id: string, pdfData: any) => api.put(`/pdfs/${id}`, pdfData),
  delete: (id: string) => api.delete(`/pdfs/${id}`),
  checkAccess: (data: { pdfId: string }) => api.post(`/pdfs/access`, data),
}

// Payment API
export const paymentApi = {
  getAll: () => api.get("/payments"),
  create: (paymentData: any) => api.post("/payments", paymentData),
  updateStatus: (id: string, data: any) => api.patch(`/payments/${id}/status`, data),
}

// User API
export const userApi = {
  getAll: () => api.get("/users"),
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, userData: any) => api.put(`/users/${id}`, userData),
  delete: (id: string) => api.delete(`/users/${id}`),
  getCourses: (id: string) => api.get(`/users/${id}/courses`),
  getPDFs: (id: string) => api.get(`/users/${id}/pdfs`),
  getPayments: (id: string) => api.get(`/users/${id}/payments`),
}

// File API
export const fileApi = {
  upload: async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await axiosInstance.post("/upload/pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return handleResponse(response)
    } catch (error) {
      return handleError(error)
    }
  },
}

