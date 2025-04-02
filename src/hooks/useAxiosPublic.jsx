import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "http://localhost:5000/api",
});

const useAxiosPublic = () => {
  // Get token from localStorage
  const getToken = () => {
    try {
      return localStorage.getItem("token");
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return null;
    }
  };

  // Add request interceptor
  axiosPublic.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  axiosPublic.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        console.error("Unauthorized access - please login again");
      }
      return Promise.reject(error);
    }
  );

  return axiosPublic;
};

export default useAxiosPublic;