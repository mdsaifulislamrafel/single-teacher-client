/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UpdateCategory = () => {
  const { id } = useParams(); // Get category ID from the URL
  const navigate = useNavigate(); // Redirect after update
  const axiosSecure = useAxiosPublic(); // Axios hook for API calls

  // React Hook Form setup
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch category data when the component mounts
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axiosSecure.get(`/categories/${id}`);
        const categoryData = res.data;
        setValue("name", categoryData.name); // Set form values
        setValue("description", categoryData.description);
      } catch (err) {
        setError("Error fetching category");
      }
    };
    fetchCategory();
  }, [id, setValue]);

  // Update category function
  const updateCategory = async (data) => {
    setLoading(true);
    try {
      const res = await axiosSecure.put(`/categories/${id}`, data);
      if (res.status === 200) {
        toast.success("Category updated successfully", {
          duration: 1000,
        }); 
        navigate("/admin/categories"); // Redirect after successful update
      }
    } catch (err) {
      setError("Error updating category");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    updateCategory(data);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Update Category</h2>

      {/* Error message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Category Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Category name is required" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category name"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-2"
          >
            Category Description
          </label>
          <textarea
            id="description"
            {...register("description", { required: "Category description is required" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category description"
          />
          {errors.description && (
            <span className="text-red-500 text-sm">{errors.description.message}</span>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCategory;
