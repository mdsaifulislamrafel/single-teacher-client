import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useSubCategory from "../../../hooks/useSubCategory";
import useCategory from "../../../hooks/useCategory";

const CreatePdf = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const axiosPublic = useAxiosPublic();

  const [category, loading] = useCategory();
  const { subcategories, loading: isSubcategoriesLoading } = useSubCategory();

  const selectedCategory = watch("category");

  // ✅ Fixed filter using sub.category._id
  const filteredSubcategories = selectedCategory
    ? subcategories?.filter((sub) => sub.category?._id === selectedCategory) ||
      []
    : [];

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("subcategory", data.subcategory);
    formData.append("price", data.price);
    formData.append("pdfFile", data.pdfFile[0]);

    setIsSubmitting(true);
    try {
      await axiosPublic.post("/pdfs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("PDF created successfully!");
      reset();
        navigate("/admin/pdfs");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create PDF");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || isSubcategoriesLoading) {
    return <div className="max-w-2xl mx-auto p-4">Loading categories...</div>;
  }

  const categories = Array.isArray(category) ? category : [];

  if (categories.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        No categories available. Please add categories first.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Upload New PDF</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full p-2 border rounded"
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Category</label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Subcategory</label>
          <select
            {...register("subcategory", {
              required: "Subcategory is required",
            })}
            className="w-full p-2 border rounded"
            disabled={!selectedCategory}
          >
            <option value="">Select a subcategory</option>
            {filteredSubcategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
          {errors.subcategory && (
            <p className="text-red-500 text-sm">{errors.subcategory.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Price</label>
          <input
            type="number"
            {...register("price", {
              required: "Price is required",
              min: 0,
              valueAsNumber: true, // Add this to convert to number
            })}
            className="w-full p-2 border rounded"
            step="0.01"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">PDF File</label>
          <input
            type="file"
            {...register("pdfFile", { required: "PDF file is required" })}
            className="w-full p-2 border rounded"
            accept=".pdf"
          />
          {errors.pdfFile && (
            <p className="text-red-500 text-sm">{errors.pdfFile.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 bg-blue-600 text-white rounded ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Uploading..." : "Upload PDF"}
        </button>
      </form>
    </div>
  );
};

export default CreatePdf;
