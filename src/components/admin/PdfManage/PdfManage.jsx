import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaExclamationTriangle,
  FaPlus,
  FaFilePdf,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useCategory from "../../../hooks/useCategory";
import useSubCategory from "../../../hooks/useSubCategory";

const PdfManage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const queryClient = useQueryClient();
  const axiosPublic = useAxiosPublic();
  const [category, categoryLoading] = useCategory();
  const {
    subcategories,
    loading: subcategoryLoading,
  } = useSubCategory();

  // Fetch PDFs for selected subcategory
  const {
    data: pdfs = [],
    isLoading: pdfsLoading,
    isError: pdfsError,
    error: pdfsErrorData,
    refetch: refetchPdfs,
  } = useQuery({
    queryKey: ["pdfs", selectedSubcategory],
    queryFn: async () => {
      if (!selectedSubcategory) return [];
      const res = await axiosPublic.get(`/pdfs?subcategory=${selectedSubcategory}`);
      return res.data;
    },
    enabled: !!selectedSubcategory,
  });

  // Delete PDF
  const deletePdfMutation = useMutation({
    mutationFn: async (pdfId) => {
      const response = await axiosPublic.delete(`/pdfs/${pdfId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pdfs", selectedSubcategory]);
      toast.success("PDF deleted successfully!");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to delete PDF";
      toast.error(errorMessage);
    },
  });

  const handleDelete = async (pdfId) => {
    if (confirm("Are you sure you want to delete this PDF?")) {
      await deletePdfMutation.mutateAsync(pdfId);
    }
  };

  // ✅ Filter subcategories by selected category (fix here)
  const filteredSubcategories = selectedCategory
    ? subcategories.filter((sub) => sub.category?._id === selectedCategory)
    : [];

  const formatFileSize = (size) => {
    if (!size) return "Unknown size";
    if (size.includes("MB")) return size;
    const sizeInBytes = Number.parseFloat(size);
    if (isNaN(sizeInBytes)) return size;
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
        <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">
          পিডিএফ ম্যানেজমেন্ট
        </h1>
        <Link to={"/admin/create-pdf"}>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm md:text-base">
            <FaPlus className="w-4 h-4" /> <span>নতুন পিডিএফ আপলোড করুন</span>
          </button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">ক্যাটাগরি</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory("");
              }}
              disabled={categoryLoading}
            >
              <option value="">ক্যাটাগরি নির্বাচন করুন</option>
              {category?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">সাবক্যাটাগরি</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              disabled={!selectedCategory || subcategoryLoading}
            >
              <option value="">সাবক্যাটাগরি নির্বাচন করুন</option>
              {filteredSubcategories?.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {pdfsLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : pdfsError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <div className="flex items-center gap-2">
              <FaExclamationTriangle />
              <span>পিডিএফ লোড করতে সমস্যা: {pdfsErrorData?.message}</span>
            </div>
            <button
              onClick={() => refetchPdfs()}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : pdfs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {selectedSubcategory
              ? "এই সাবক্যাটাগরিতে কোন পিডিএফ পাওয়া যায়নি"
              : "পিডিএফ দেখতে একটি ক্যাটাগরি এবং সাবক্যাটাগরি নির্বাচন করুন"}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">টাইটেল</th>
                  <th className="py-2 px-4 border-b text-left">বিবরণ</th>
                  <th className="py-2 px-4 border-b text-center">মূল্য</th>
                  <th className="py-2 px-4 border-b text-center">ফাইল সাইজ</th>
                  <th className="py-2 px-4 border-b text-center">আপলোড তারিখ</th>
                  <th className="py-2 px-4 border-b text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {pdfs?.map((pdf) => (
                  <tr key={pdf._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      <div className="flex items-center gap-2">
                        <FaFilePdf className="text-red-500" />
                        <span className="font-medium">{pdf.title}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {pdf.description || "কোন বিবরণ নেই"}
                      </p>
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {pdf.price ? `${pdf.price} ৳` : "ফ্রি"}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {formatFileSize(pdf.fileSize)}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {new Date(pdf.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <div className="flex justify-center gap-2">
                        <a
                          href={pdf.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          title="পিডিএফ দেখুন"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </a>

                        <Link
                          to={`/admin/edit-pdf/${pdf._id}`}
                          className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                          title="পিডিএফ এডিট করুন"
                        >
                          <FaEdit className="h-4 w-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(pdf._id)}
                          className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                          disabled={deletePdfMutation.isLoading}
                          title="পিডিএফ ডিলিট করুন"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfManage;
