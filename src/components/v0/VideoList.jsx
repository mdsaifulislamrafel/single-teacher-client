import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { FaExclamationTriangle, FaRedo, FaPlus } from "react-icons/fa"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import useAxiosPublic from "../../hooks/useAxiosPublic"

// সিম্পল axios ইনস্ট্যান্স

const VideoList = () => {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [videoStates, setVideoStates] = useState({})
  const queryClient = useQueryClient()
  const  axiosPublic = useAxiosPublic()
  const isAdmin = true


  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosPublic.get("/categories")
      return res.data
    },
  })

  // সাবক্যাটাগরি ফেচ করা
  const { data: subcategories = [], isLoading: subcategoriesLoading } = useQuery({
    queryKey: ["subcategories", selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return []
      const res = await axiosPublic.get(`/categories/${selectedCategory}/subcategories`)
      return res.data
    },
    enabled: !!selectedCategory,
  })

  // ভিডিও ফেচ করা
  const { 
    data: videos = [], 
    isLoading: videosLoading,
    isError: videosError,
    error: videosErrorData
  } = useQuery({
    queryKey: ["videos", selectedSubcategory],
    queryFn: async () => {
      if (!selectedSubcategory) return []
      const res = await axiosPublic.get(`/subcategories/${selectedSubcategory}/videos`)
      return res.data
    },
    enabled: !!selectedSubcategory,
  })

  // ভিডিও ডিলিট মিউটেশন
  const deleteVideoMutation = useMutation({
    mutationFn: async (videoId) => {
      await axiosPublic.delete(`/videos/${videoId}`)
      return videoId
    },
    onSuccess: (videoId) => {
      queryClient.setQueryData(
        ["videos", selectedSubcategory],
        (old) => old.filter((video) => video._id !== videoId) || []
      )
      toast.success("ভিডিও সফলভাবে ডিলিট করা হয়েছে!")
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || error.message || "ডিলিট করতে ব্যর্থ হয়েছে"
      toast.error(errorMessage)
    },
  })

  // ভিডিও স্টেট আপডেট করার ফাংশন
  const updateVideoState = (videoId, updates) => {
    setVideoStates(prev => ({
      ...prev,
      [videoId]: {
        ...(prev[videoId] || {}),
        ...updates
      }
    }))
  }

  // সব ভিডিও লোড করার ফাংশন
  useEffect(() => {
    if (videos && videos.length > 0) {
      // সব ভিডিওর জন্য প্লেব্যাক ইনফো লোড করা
      videos.forEach(video => {
        loadVideoPlaybackInfo(video)
      })
    }
  }, [videos])

  // ভিডিও প্লেব্যাক ইনফো লোড করার ফাংশন
  const loadVideoPlaybackInfo = async (video) => {
    if (!video || !video._id) return
    
    updateVideoState(video._id, { loading: true, error: null })
    
    try {
      const res = await axiosPublic.get(`/videos/${video._id}/playback`)
      
      if (!res.data?.otp || !res.data?.playbackInfo) {
        throw new Error("ভিডিও প্লেব্যাক ডাটা পাওয়া যায়নি")
      }
      
      updateVideoState(video._id, { 
        playbackInfo: res.data,
        loading: false,
        error: null
      })
    } catch (err) {
      console.error("ভিডিও প্লেব্যাক এরর:", err)
      updateVideoState(video._id, {
        error: err.response?.data?.message || err.message || "ভিডিও লোড করতে সমস্যা হয়েছে",
        loading: false
      })
    }
  }

  // ভিডিও ডিলিট করার ফাংশন
  const handleDelete = async (videoId) => {
    if (window.confirm("আপনি কি নিশ্চিত এই ভিডিওটি ডিলিট করতে চান?")) {
      await deleteVideoMutation.mutateAsync(videoId)
    }
  }

  // আবার চেষ্টা করার ফাংশন
  const retryLoading = (video) => {
    loadVideoPlaybackInfo(video)
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ভিডিও ম্যানেজমেন্ট</h1>
        <Link to={'/admin/create-videos'}>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <FaPlus /> নতুন ভিডিও আপলোড করুন
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
                setSelectedCategory(e.target.value)
                setSelectedSubcategory("")
              }}
              disabled={categoriesLoading}
            >
              <option value="">ক্যাটাগরি নির্বাচন করুন</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              সাবক্যাটাগরি
            </label>
            <select
              className="w-full p-2 border rounded"
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              disabled={!selectedCategory || subcategoriesLoading}
            >
              <option value="">সাবক্যাটাগরি নির্বাচন করুন</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {videosLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : videosError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <div className="flex items-center gap-2">
              <FaExclamationTriangle />
              <span>ভিডিও লোড করতে সমস্যা: {videosErrorData?.message}</span>
            </div>
            <button
              onClick={() => queryClient.invalidateQueries(["videos", selectedSubcategory])}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : videos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {selectedSubcategory
              ? "এই সাবক্যাটাগরিতে কোন ভিডিও পাওয়া যায়নি"
              : "ভিডিও দেখতে একটি ক্যাটাগরি এবং সাবক্যাটাগরি নির্বাচন করুন"}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => {
              const videoState = videoStates[video._id] || {}
              const { loading, error, playbackInfo } = videoState
              
              return (
                <div
                  key={video._id}
                  className="border rounded-lg overflow-hidden relative"
                >
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 z-10"
                      disabled={deleteVideoMutation.isLoading}
                      title="ভিডিও ডিলিট করুন"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                  <div className="aspect-video bg-black">
                    {loading ? (
                      <div className="flex justify-center items-center h-full bg-gray-800">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    ) : error ? (
                      <div className="flex flex-col items-center justify-center h-full bg-gray-800 text-white p-4 text-center">
                        <FaExclamationTriangle className="text-2xl mb-2" />
                        <p className="text-sm">{error}</p>
                        <button
                          onClick={() => retryLoading(video)}
                          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center gap-1"
                        >
                          <FaRedo className="text-xs" /> আবার চেষ্টা করুন
                        </button>
                      </div>
                    ) : playbackInfo ? (
                      <iframe
                        src={`https://player.vdocipher.com/v2/?otp=${playbackInfo.otp}&playbackInfo=${playbackInfo.playbackInfo}`}
                        style={{ border: 0, width: "100%", height: "100%" }}
                        allow="encrypted-media"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="flex justify-center items-center h-full bg-gray-800">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>
                        {video.duration
                          ? `${Math.floor(video.duration / 60)}m ${
                              video.duration % 60
                            }s`
                          : "N/A"}
                      </span>
                      <span>
                        {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoList