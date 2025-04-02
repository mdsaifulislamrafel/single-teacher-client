import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";

export default function CreateVideo() {
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });

  const videoFile = watch("video")?.[0];

  // Generate preview when video file changes
  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [videoFile]);

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

  // Upload video mutation
  const uploadVideoMutation = useMutation({
    mutationFn: async (formData) => {
      try {
        const response = await axiosPublic.post("/videos", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              setUploadProgress(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              );
            }
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error response:", error.response);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["videos", selectedSubcategory]);
      toast.success("Video uploaded successfully!");
      reset();
      setUploadProgress(0);
      navigate('/admin/videos')
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error || error.message || "Upload failed";
      toast.error(errorMessage);
      setUploadProgress(0);
    },
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

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("subcategory", selectedSubcategory);
      formData.append("video", data.video[0]);

      await uploadVideoMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleDelete = async (videoId) => {
    if (confirm("Are you sure you want to delete this video?")) {
      await deleteVideoMutation.mutateAsync(videoId);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Video Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Upload New Video</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
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

            <div className="mb-4">
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

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Video Title *
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters",
                  },
                })}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                className="w-full p-2 border rounded"
                rows={3}
                {...register("description")}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Video File *
              </label>
              <input
                type="file"
                accept="video/*"
                className="w-full p-2 border rounded"
                {...register("video", {
                  required: "Video file is required",
                  validate: {
                    validFile: (files) => {
                      if (!files?.[0]) return true;
                      const validTypes = [
                        "video/mp4",
                        "video/quicktime",
                        "video/x-msvideo",
                      ];
                      return (
                        validTypes.includes(files[0].type) ||
                        "Only MP4, MOV, and AVI files are allowed"
                      );
                    },
                    maxSize: (files) => {
                      if (!files?.[0]) return true;
                      return (
                        files[0].size <= 500 * 1024 * 1024 ||
                        "File size must be less than 500MB"
                      );
                    },
                  },
                })}
              />
              {errors.video && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.video.message}
                </p>
              )}
            </div>

            {previewUrl && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Preview
                </label>
                <div className="aspect-video bg-black rounded overflow-hidden">
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Uploading: {uploadProgress}%
                </p>
              </div>
            )}

            <button
              type="submit"
              className={`w-full px-4 py-2 rounded ${
                !selectedSubcategory ||
                isSubmitting ||
                uploadVideoMutation.isLoading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              disabled={
                !selectedSubcategory ||
                isSubmitting ||
                uploadVideoMutation.isLoading
              }
            >
              {uploadVideoMutation.isLoading ? "Uploading..." : "Upload Video"}
            </button>
          </form>
        </div>

        {/* Video List */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              {selectedSubcategory
                ? "Videos in Selected Subcategory"
                : "Select a Subcategory"}
            </h2>

            {videosLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : videos.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {selectedSubcategory
                  ? "No videos found"
                  : "Please select a subcategory to view videos"}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                        Title
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                        Duration
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                        Uploaded
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map((video) => (
                      <tr key={video._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-800">
                          {video.title}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {video.duration
                            ? `${Math.floor(video.duration / 60)}m ${
                                video.duration % 60
                              }s`
                            : "N/A"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          {new Date(video.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          <button
                            onClick={() => handleDelete(video._id)}
                            className="text-red-500 hover:text-red-700"
                            disabled={deleteVideoMutation.isLoading}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
