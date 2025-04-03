/* eslint-disable react/no-unescaped-entities */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../provider/AuthContext";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Lottie from "react-lottie-player";
import loginAnimation from "../assets/login.json";

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, error: authError, setError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null); // Clear previous errors
    
    const result = await login(data);
    
    if (result.success) {
      toast.success("Login successful", { duration: 2000 });
      navigate("/");
    } else {
      toast.error(result.error || "Login failed", { duration: 2000 });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="flex flex-col md:flex-row items-center gap-10 justify-center p-10 bg-white rounded-lg shadow-2xl max-w-4xl w-full">

        {/* Lottie Animation */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Lottie animationData={loginAnimation} play loop className="w-[80%] md:w-full max-h-[400px]" />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            <h2 className="text-center text-3xl font-semibold text-blue-500">Log in</h2>

            {/* Display authentication error */}
            {authError && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-center">
                {authError}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block mb-1 text-lg font-medium">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email', { required: true })}
                className="w-full p-3 rounded-lg border border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 text-base"
              />
              {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block mb-1 text-lg font-medium">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register('password', { required: true })}
                  className="w-full p-3 rounded-lg border border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 text-base"
                />
                <span className="absolute top-3 right-4 cursor-pointer text-xl" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </span>
              </div>
              {errors.password && <p className="text-red-500 text-sm">Password is required</p>}
            </div>

            {/* Login Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-3 rounded-lg text-white font-medium text-lg uppercase transition-all duration-300 ${
                  isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isSubmitting ? 'Logging in...' : 'Log In'}
              </button>
            </div>

            {/* Registration Link */}
            <p className="text-center text-gray-600 text-base">
              Don't have an account?
              <Link to="/register" className="text-blue-800 underline ml-1">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};