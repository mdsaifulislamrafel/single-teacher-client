import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import useAxiosPublic from "../../../hooks/useAxiosPublic"
import useCategory from "../../../hooks/useCategory"
import useSubCategory from "../../../hooks/useSubCategory"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export default function CreatePdf() {
  const axiosPublic = useAxiosPublic()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      subcategory: "",
      price: 0,
      pdfFile: null,
    },
    mode: "onChange",
  })

  const watchCategory = watch("category")
  const pdfFile = watch("pdfFile")?.[0]

  // Generate preview when PDF file changes
  useEffect(() => {
    if (pdfFile) {
      const url = URL.createObjectURL(pdfFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(null)
    }
  }, [pdfFile])

  useEffect(() => {
    setSelectedCategory(watchCategory)
  }, [watchCategory])

  useEffect(() => {
    if (selectedCategory) {
      setValue("subcategory", "")
    }
  }, [selectedCategory, setValue])

  // Get categories and subcategories using the hooks from the original component
  const [category, loading] = useCategory()
  const { subcategories, loading: isSubcategoriesLoading } = useSubCategory()

  // Filter subcategories based on selected category
  const filteredSubcategories = selectedCategory
    ? subcategories?.filter((sub) => sub.category?._id === selectedCategory) || []
    : []

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      setError(null)
      setSuccess(false)
      setUploadProgress(0)

      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("description", data.description)
      formData.append("category", data.category)
      formData.append("subcategory", data.subcategory)
      formData.append("price", data.price)
      formData.append("pdfFile", data.pdfFile[0])

      await axiosPublic.post("/pdfs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
          }
        },
      })

      toast.success("PDF created successfully!")
      setSuccess(true)
      reset()
      setUploadProgress(0)
      setSelectedCategory("")
      setPreviewUrl(null)
      navigate("/admin/pdfs")
    } catch (err) {
      console.error("Error uploading PDF:", err)
      setError(err.response?.data?.error || "Failed to create PDF")
      toast.error(err.response?.data?.error || "Failed to create PDF")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || isSubcategoriesLoading) {
    return <div className="container mx-auto p-4 max-w-6xl">Loading categories...</div>
  }

  const categories = Array.isArray(category) ? category : []

  if (categories.length === 0) {
    return <div className="container mx-auto p-4 max-w-6xl">No categories available. Please add categories first.</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Upload New PDF</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">PDF Upload</h2>

          {success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">PDF successfully uploaded!</div>}

          {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Category *</label>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full p-2 border ${errors.category ? "border-red-500" : "border-gray-300"} rounded`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Subcategory *</label>
              <Controller
                name="subcategory"
                control={control}
                rules={{ required: "Subcategory is required" }}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full p-2 border ${errors.subcategory ? "border-red-500" : "border-gray-300"} rounded`}
                    disabled={!selectedCategory}
                  >
                    <option value="">Select a subcategory</option>
                    {filteredSubcategories.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.subcategory && <p className="text-red-500 text-xs mt-1">{errors.subcategory.message}</p>}
              {selectedCategory && filteredSubcategories.length === 0 && (
                <p className="text-red-500 text-xs mt-1">No subcategories available for this category</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                className={`w-full p-2 border ${errors.title ? "border-red-500" : "border-gray-300"} rounded`}
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters",
                  },
                })}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full p-2 border rounded"
                rows={3}
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Price *</label>
              <input
                type="number"
                className={`w-full p-2 border ${errors.price ? "border-red-500" : "border-gray-300"} rounded`}
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  min: {
                    value: 0,
                    message: "Price cannot be negative",
                  },
                  valueAsNumber: true,
                })}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">PDF File *</label>
              <input
                type="file"
                accept=".pdf"
                className={`w-full p-2 border ${errors.pdfFile ? "border-red-500" : "border-gray-300"} rounded`}
                {...register("pdfFile", {
                  required: "PDF file is required",
                  validate: {
                    fileType: (files) => {
                      if (!files || files.length === 0) return true
                      const file = files[0]
                      return file.type === "application/pdf" || "Only PDF files are allowed"
                    },
                    fileSize: (files) => {
                      if (!files || files.length === 0) return true
                      const file = files[0]
                      return file.size <= 50 * 1024 * 1024 || "File size cannot exceed 50MB"
                    },
                  },
                })}
              />
              {errors.pdfFile && <p className="text-red-500 text-xs mt-1">{errors.pdfFile.message}</p>}
              <p className="mt-1 text-xs text-gray-500">Supported format: PDF (max 50MB)</p>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">Uploading: {uploadProgress}%</p>
              </div>
            )}

            <button
              type="submit"
              className={`w-full px-4 py-2 rounded ${
                isSubmitting ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Upload PDF"}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">PDF Preview</h2>

            {previewUrl ? (
              <div className="aspect-[8.5/11] bg-gray-100 rounded-xl overflow-hidden">
                <iframe src={previewUrl} className="w-full h-full" title="PDF Preview"></iframe>
              </div>
            ) : (
              <div className="flex justify-center items-center h-64 bg-gray-100 rounded-xl">
                <p className="text-gray-500">Upload a PDF to see preview here</p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-medium mb-2">Upload Instructions:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>PDF file size must not exceed 50MB</li>
                <li>Only PDF format is supported</li>
                <li>Select the correct category and subcategory before uploading</li>
                <li>Set an appropriate price for your PDF</li>
                <li>Provide a clear title and description to help users find your content</li>
              </ul>
            </div>

            {success && (
              <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-md">
                <p className="font-medium">PDF successfully uploaded!</p>
                <p className="text-sm mt-1">Your PDF has been processed and is now available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

