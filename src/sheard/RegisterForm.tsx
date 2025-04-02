import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaImage } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { useAuth } from "../provider/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import Lottie from "react-lottie-player";  // Correct Lottie import
import signup from "../assets/signup_animation.json";  // Correct path for animation file

const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm();
  const { register: signUp, error: authError, user } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.avatar?.[0]) {
      formData.append("avatar", data.avatar[0]);
    }

    const result = await signUp(formData);
    if (result.success) {
      toast.success("Registration successful!", { duration: 1000 });
      navigate("/");
    }
  };

  // Watching password to compare with confirm password
  const password = watch("password");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl bg-white p-8 rounded-md shadow-lg space-y-6 md:space-y-0 md:space-x-8">
        <div className="w-full md:w-1/2">
          <Lottie className="w-full h-auto" animationData={signup} loop={true} play={true} />
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-3xl font-semibold text-center text-blue-400">Registration Now!</h2>

            {/* Name Field */}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="Full Name"
                className="border border-gray-300 rounded-lg pl-10 p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Email Field */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Email"
                className="border border-gray-300 rounded-lg pl-10 p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="border border-gray-300 rounded-lg pl-10 pr-10 p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: value => value === password || "Passwords do not match",
                })}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="border border-gray-300 rounded-lg pl-10 pr-10 p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Avatar Upload Field */}
            <div className="relative">
              <FaImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                {...register("avatar")}
                type="file"
                accept="image/*"
                className="border border-gray-300 rounded-lg pl-10 p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>

            {/* Error Message */}
            {authError && (
              <div className="p-2 text-sm text-red-500 bg-red-50 rounded">
                {authError}
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold p-3 w-full rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>

            <p className="text-center text-gray-600">
              Do you have an account?
              <Link to="/login" className="underline text-blue-800 ml-1">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
