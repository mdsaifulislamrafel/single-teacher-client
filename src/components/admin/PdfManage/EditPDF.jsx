import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useCategory from "../../../hooks/useCategory";
import useSubCategory from "../../../hooks/useSubCategory";

const EditPDF = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "0",
    fileUrl: "",
  });
  const [newFile, setNewFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, categoryLoading] = useCategory();
  const { subcategories, loading: subcategoryLoading } = useSubCategory();

  const filteredSubcategories = selectedCategory
    ? subcategories.filter((sub) => {
        const catId = typeof sub.category === "object" ? sub.category._id : sub.category;
        return catId === selectedCategory;
      })
    : [];

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const res = await axiosPublic.get(`/pdfs/${id}`);
        const pdfData = res.data;

        setFormData({
          title: pdfData.title,
          description: pdfData.description || "",
          price: pdfData.price?.toString() || "0",
          fileUrl: pdfData.fileUrl || "",
        });
        setSelectedCategory(pdfData.category._id || pdfData.category);
        setSelectedSubcategory(pdfData.subcategory._id || pdfData.subcategory);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching PDF:", error);
        toast.error("Failed to load PDF data");
        navigate("/admin/pdf-manage");
      }
    };

    if (id) fetchPDF();
  }, [id, axiosPublic, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.title || !selectedCategory || !selectedSubcategory) {
      toast.error("Please fill all required fields");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", selectedCategory);
      data.append("subcategory", selectedSubcategory);
      
      if (newFile) {
        data.append("file", newFile);
      }

      await axiosPublic.put(`/pdfs/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("PDF updated successfully!");
      navigate("/admin/pdfs");
    } catch (error) {
      console.error("Error updating PDF:", error);
      toast.error(error.response?.data?.error || "Failed to update PDF");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/admin/pdfs")}
          className="mr-4 text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="text-2xl font-bold">Edit PDF</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Price (৳)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="0"
                placeholder="0 = Free"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory("");
                }}
                className="w-full p-2 border rounded"
                required
                disabled={categoryLoading}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Subcategory <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full p-2 border rounded"
                required
                disabled={!selectedCategory || subcategoryLoading}
              >
                <option value="">Select Subcategory</option>
                {filteredSubcategories.map((subcategory) => (
                  <option key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={4}
            ></textarea>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">
              * To change PDF file, upload a new one
            </p>
            {formData.fileUrl && (
              <a
                href={formData.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline text-sm"
              >
                View Current PDF File
              </a>
            )}
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/pdfs")}
              className="px-4 py-2 border border-gray-300 rounded mr-2 hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" /> Processing...
                </>
              ) : (
                "Update PDF"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPDF;