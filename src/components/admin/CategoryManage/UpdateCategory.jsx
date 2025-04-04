/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosPublic();
  const [currentImage, setCurrentImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axiosSecure.get(`/categories/${id}`);
        const categoryData = res.data;
        setValue("name", categoryData.name);
        setValue("description", categoryData.description);
        setCurrentImage(categoryData.image);
      } catch (err) {
        setError("Error fetching category");
      }
    };
    fetchCategory();
  }, [id, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const updateCategory = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      const res = await axiosSecure.put(`/categories/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        toast.success("Category updated successfully");
        navigate("/admin/categories");
      }
    } catch (err) {
      setError("Error updating category");
      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Update Category</h2>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit(updateCategory)}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Category Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Category name is required" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category name"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Category Description
          </label>
          <textarea
            {...register("description", { required: "Category description is required" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category description"
          />
          {errors.description && (
            <span className="text-red-500 text-sm">{errors.description.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Category Image
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {imagePreview ? (
            <div className="mt-2">
              <img 
                src={imagePreview} 
                alt="New Preview" 
                className="h-32 object-cover rounded-md"
              />
            </div>
          ) : currentImage ? (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Current Image:</p>
              <img 
                src={currentImage} 
                alt="Current" 
                className="h-32 object-cover rounded-md"
              />
            </div>
          ) : null}
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