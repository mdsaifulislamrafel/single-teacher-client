import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { toast } from "sonner";
import { useAuth } from "../../../provider/AuthContext";
import { Link } from "react-router-dom";

const VideoManage = () => {
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  // Check if user is admin (you may need to adjust this based on your auth system)
  const isAdmin = user?.role === "admin";

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosPublic.get("/categories");
      return res.data;
    },
  });

  // Fetch subcategories
  const { data: subcategories = [], isLoading: subcategoriesLoading } =
    useQuery({
      queryKey: ["subcategories", selectedCategory],
      queryFn: async () => {
        if (!selectedCategory) return [];
        const res = await axiosPublic.get(
          `/categories/${selectedCategory}/subcategories`
        );
        return res.data;
      },
      enabled: !!selectedCategory,
    });

  // Fetch videos
  const { data: videos = [], isLoading: videosLoading } = useQuery({
    queryKey: ["videos", selectedSubcategory],
    queryFn: async () => {
      if (!selectedSubcategory) return [];
      const res = await axiosPublic.get(
        `/subcategories/${selectedSubcategory}/videos`
      );
      return res.data;
    },
    enabled: !!selectedSubcategory,
  });

  // Delete video mutation
  const deleteVideoMutation = useMutation({
    mutationFn: async (videoId) => {
      await axiosPublic.delete(`/videos/${videoId}`);
      return videoId;
    },
    onSuccess: (videoId) => {
      queryClient.setQueryData(
        ["videos", selectedSubcategory],
        (old) => old.filter((video) => video._id !== videoId) || []
      );
      toast.success("Video deleted successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error || error.message || "Delete failed";
      toast.error(errorMessage);
    },
  });

  const handleDelete = async (videoId) => {
    if (confirm("Are you sure you want to delete this video?")) {
      await deleteVideoMutation.mutateAsync(videoId);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ভিডিও ম্যানেজমেন্ট</h1>
        <Link to={'/admin/create-videos'}>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            নতুন ভিডিও আপলোড করুন
          </button>
        </Link>
      </div>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory("");
              }}
              disabled={categoriesLoading}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Subcategory
            </label>
            <select
              className="w-full p-2 border rounded"
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              disabled={!selectedCategory || subcategoriesLoading}
            >
              <option value="">Select a subcategory</option>
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
        ) : videos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {selectedSubcategory
              ? "No videos found in this subcategory"
              : "Please select a category and subcategory to view videos"}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div
                key={video._id}
                className="border rounded-lg overflow-hidden relative"
              >
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(video._id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 z-10"
                    disabled={deleteVideoMutation.isLoading}
                    title="Delete video"
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
                  <video
                    src={video.url}
                    controls
                    className="w-full h-full object-contain"
                  />
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoManage;
