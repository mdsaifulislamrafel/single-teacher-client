/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { useState } from "react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useCategory from "../../../hooks/useCategory";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CreateSubCategory = () => {
  const axiosSecure = useAxiosPublic();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch categories using the custom hook
  const [category, loading] = useCategory();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Map categoryId to category for backend
      const requestData = {
        ...data,
        category: data.categoryId
      };
      
      const response = await axiosSecure.post("/subcategories", requestData);
      if (response.status === 201) {
        toast.success("Subcategory created successfully!");
        navigate("/admin/categories");
        reset();
      }
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to create subcategory");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Create Subcategory</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold">
            Name:
          </label>
          <input
            type="text"
            id="name"
            className="w-full p-3 border border-gray-300 rounded-md"
            {...register("name", { 
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters"
              }
            })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold">
            Description:
          </label>
          <textarea
            id="description"
            className="w-full p-3 border border-gray-300 rounded-md"
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters"
              }
            })}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-semibold">
            Category:
          </label>
          <select
            id="category"
            className="w-full p-3 border border-gray-300 rounded-md"
            {...register("categoryId", { required: "Category is required" })}
          >
            <option value="">Select Category</option>
            {category.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-4 w-full py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Subcategory"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSubCategory;
