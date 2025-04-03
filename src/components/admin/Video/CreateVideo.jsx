import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import useAxiosPublic from "../../../hooks/useAxiosPublic"



export default function CreateVideo() {
  const axiosPublic = useAxiosPublic()
  const [selectedCategory, setSelectedCategory] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
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
      video: null,
    },
    mode: "onChange",
  })

  const watchCategory = watch("category")
  const videoFile = watch("video")?.[0]

  // Generate preview when video file changes
  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(null)
    }
  }, [videoFile])

  useEffect(() => {
    setSelectedCategory(watchCategory)
  }, [watchCategory])

  useEffect(() => {
    if (selectedCategory) {
      setValue("subcategory", "")
    }
  }, [selectedCategory, setValue])

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosPublic.get("/categories")
      return res.data
    },
  })

  // Fetch subcategories
  const { data: subcategories = [], isLoading: subcategoriesLoading } = useQuery({
    queryKey: ["subcategories", selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return []
      const res = await axiosPublic.get(`/categories/${selectedCategory}/subcategories`)
      return res.data
    },
    enabled: !!selectedCategory,
  })

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)
      setUploadProgress(0)

      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("description", data.description)
      formData.append("subcategory", data.subcategory)
      formData.append("video", data.video[0])

      await axiosPublic.post("/videos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
          }
        },
      })

      setSuccess(true)
      reset()
      setUploadProgress(0)
      setSelectedCategory("")
      setPreviewUrl(null)
    } catch (err) {
      console.error("Error uploading video:", err)
      setError(err.response?.data?.error || "ভিডিও আপলোড করতে ব্যর্থ হয়েছে")

      // Handle VdoCipher quota limit specifically
      if (err.response?.data?.quotaExceeded) {
        setError("আপনি ট্রায়াল অ্যাকাউন্টের সর্বোচ্চ ভিডিও লিমিটে পৌঁছেছেন। দয়া করে কিছু ভিডিও ডিলিট করুন বা আপনার প্ল্যান আপগ্রেড করুন।")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">নতুন ভিডিও আপলোড করুন</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">ভিডিও আপলোড</h2>

          {success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">ভিডিও সফলভাবে আপলোড হয়েছে!</div>}

          {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">ক্যাটাগরি *</label>
              <Controller
                name="category"
                control={control}
                rules={{ required: "ক্যাটাগরি নির্বাচন করুন" }}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full p-2 border ${errors.category ? "border-red-500" : "border-gray-300"} rounded`}
                    disabled={categoriesLoading}
                  >
                    <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
              {categoriesLoading && <p className="text-sm text-gray-500 mt-1">ক্যাটাগরি লোড হচ্ছে...</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">সাবক্যাটাগরি *</label>
              <Controller
                name="subcategory"
                control={control}
                rules={{ required: "সাবক্যাটাগরি নির্বাচন করুন" }}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full p-2 border ${errors.subcategory ? "border-red-500" : "border-gray-300"} rounded`}
                    disabled={!selectedCategory || subcategoriesLoading}
                  >
                    <option value="">সাবক্যাটাগরি নির্বাচন করুন</option>
                    {subcategories.map((subcategory) => (
                      <option key={subcategory._id} value={subcategory._id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.subcategory && <p className="text-red-500 text-xs mt-1">{errors.subcategory.message}</p>}
              {subcategoriesLoading && <p className="text-sm text-gray-500 mt-1">সাবক্যাটাগরি লোড হচ্ছে...</p>}
              {selectedCategory && subcategories.length === 0 && !subcategoriesLoading && (
                <p className="text-red-500 text-xs mt-1">এই ক্যাটাগরিতে কোন সাবক্যাটাগরি নেই</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">শিরোনাম *</label>
              <input
                type="text"
                className={`w-full p-2 border ${errors.title ? "border-red-500" : "border-gray-300"} rounded`}
                {...register("title", {
                  required: "শিরোনাম দিতে হবে",
                  minLength: {
                    value: 3,
                    message: "শিরোনাম কমপক্ষে ৩ অক্ষর হতে হবে",
                  },
                })}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">বিবরণ</label>
              <textarea className="w-full p-2 border rounded" rows={3} {...register("description")} />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">ভিডিও ফাইল *</label>
              <input
                type="file"
                accept="video/*"
                className={`w-full p-2 border ${errors.video ? "border-red-500" : "border-gray-300"} rounded`}
                {...register("video", {
                  required: "ভিডিও ফাইল আপলোড করুন",
                  validate: {
                    fileType: (files) => {
                      if (!files || files.length === 0) return true
                      const file = files[0]
                      return file.type.startsWith("video/") || "শুধুমাত্র ভিডিও ফাইল আপলোড করুন"
                    },
                    fileSize: (files) => {
                      if (!files || files.length === 0) return true
                      const file = files[0]
                      return file.size <= 500 * 1024 * 1024 || "ফাইল সাইজ ৫০০MB এর বেশি হতে পারবে না"
                    },
                  },
                })}
              />
              {errors.video && <p className="text-red-500 text-xs mt-1">{errors.video.message}</p>}
              <p className="mt-1 text-xs text-gray-500">সমর্থিত ফরম্যাট: MP4, MOV, AVI, ইত্যাদি (সর্বোচ্চ ৫০০MB)</p>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">আপলোড হচ্ছে: {uploadProgress}%</p>
              </div>
            )}

            <button
              type="submit"
              className={`w-full px-4 py-2 rounded ${
                loading ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              disabled={loading}
            >
              {loading ? "আপলোড হচ্ছে..." : "ভিডিও আপলোড করুন"}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">ভিডিও প্রিভিউ</h2>

            {previewUrl ? (
              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                <video src={previewUrl} controls className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="flex justify-center items-center h-64 bg-gray-100 rounded-xl">
                <p className="text-gray-500">ভিডিও আপলোড করলে এখানে প্রিভিউ দেখা যাবে</p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-medium mb-2">আপলোড নির্দেশনা:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>ভিডিও ফাইল সর্বোচ্চ ৫০০MB হতে পারবে</li>
                <li>সমর্থিত ফরম্যাট: MP4, MOV, AVI, ইত্যাদি</li>
                <li>ভিডিও আপলোড করার আগে সঠিক ক্যাটাগরি এবং সাবক্যাটাগরি নির্বাচন করুন</li>
                <li>ভিডিও আপলোড হতে কিছু সময় লাগতে পারে, দয়া করে ধৈর্য ধরুন</li>
              </ul>
            </div>

            {success && (
              <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-md">
                <p className="font-medium">ভিডিও সফলভাবে আপলোড হয়েছে!</p>
                <p className="text-sm mt-1">আপনার ভিডিও প্রক্রিয়া করা হচ্ছে এবং শীঘ্রই উপলব্ধ হবে।</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

