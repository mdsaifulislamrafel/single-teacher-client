// /* eslint-disable react/prop-types */
// import { createContext, useContext, useState } from 'react';
// import axios from 'axios';
// // import { useNavigate } from 'react-router-dom';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState(null);
// //   const navigate = useNavigate();

//   // Initialize axios instance
//   const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
//   });

//   // Add auth token to requests
//   api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   });

//   const register = async (formData) => {
//     try {
//       setError(null);
//       const response = await api.post('/auth/register', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
      
//       setUser(response.data.user);
//       localStorage.setItem('token', response.data.token);
//       return { success: true, data: response.data };
//     } catch (error) {
//       let errorMessage = 'Registration failed';
      
//       if (error.response?.data?.details) {
//         errorMessage = error.response.data.details
//           .map(d => `${d.field}: ${d.message}`)
//           .join(', ');
//       } else if (error.response?.data?.error) {
//         errorMessage = error.response.data.error;
//       }
      
//       setError(errorMessage);
//       return { success: false, error: errorMessage };
//     }
//   };

//   // Add login, logout, checkAuthStatus functions here

//   return (
//     <AuthContext.Provider value={{ user, error, register, setError }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize axios instance
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  });

  // Add auth token to requests
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.get('/auth/me');
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [api]);

  const register = async (formData) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = 'Registration failed';
      
      if (error.response?.data?.details) {
        errorMessage = error.response.data.details
          .map(d => `${d.field}: ${d.message}`)
          .join(', ');
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', credentials);
      
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = 'Login failed';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      error, 
      loading,
      register,
      logout,
      setError,
      login 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);