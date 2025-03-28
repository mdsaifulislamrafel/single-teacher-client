import axios from "axios"

// Make sure this URL is correct and the backend server is running
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies/CORS
})

// Add a request interceptor to add the token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add a response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.data)
    return response.data
  },
  (error) => {
    console.error(`API Error for ${error.config?.url}:`, error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export default api

