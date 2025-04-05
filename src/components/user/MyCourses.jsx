"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDownIcon,
  ChevronRightIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PlayIcon,
} from "@heroicons/react/24/outline"

const MyCourses = () => {
  // State for tracking navigation and selected items
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [expandedSubcategory, setExpandedSubcategory] = useState(null)
  const [completedVideos, setCompletedVideos] = useState({})
  const [videoProgress, setVideoProgress] = useState({})

  // Sample course data
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "বাংলা",
      subcategories: [
        {
          id: 101,
          name: "অধ্যায়-১: ভাষা পরিচিতি",
          videos: [
            {
              id: 1001,
              title: "ভাষার উৎপত্তি",
              duration: "10:25",
              vdoCipherId: "sample-id-1001",
              otp: "20160313versASE323ddb38fSFef6abeSFef6abe",
              playbackInfo: "eyJ2aWRlb0lkIjoiODZjYTNiN2JhMWFiNGMxYmFiMzZiZGRkZjljNDI5YWYifQ==",
            },
            {
              id: 1002,
              title: "ভাষার বিবর্তন",
              duration: "8:15",
              vdoCipherId: "sample-id-1002",
              otp: "20160313versASE323ddb38fSFef6abeSFef6abe",
              playbackInfo: "eyJ2aWRlb0lkIjoiODZjYTNiN2JhMWFiNGMxYmFiMzZiZGRkZjljNDI5YWYifQ==",
            },
            {
              id: 1003,
              title: "বাংলা ভাষার ইতিহাস",
              duration: "12:40",
              vdoCipherId: "sample-id-1003",
              otp: "20160313versASE323ddb38fSFef6abeSFef6abe",
              playbackInfo: "eyJ2aWRlb0lkIjoiODZjYTNiN2JhMWFiNGMxYmFiMzZiZGRkZjljNDI5YWYifQ==",
            },
            {
              id: 1004,
              title: "বাংলা ভাষার বিভিন্ন রূপ",
              duration: "9:30",
              vdoCipherId: "sample-id-1004",
              otp: "20160313versASE323ddb38fSFef6abeSFef6abe",
              playbackInfo: "eyJ2aWRlb0lkIjoiODZjYTNiN2JhMWFiNGMxYmFiMzZiZGRkZjljNDI5YWYifQ==",
            },
            {
              id: 1005,
              title: "বাংলা ভাষার ব্যাকরণ",
              duration: "15:20",
              vdoCipherId: "sample-id-1005",
              otp: "20160313versASE323ddb38fSFef6abeSFef6abe",
              playbackInfo: "eyJ2aWRlb0lkIjoiODZjYTNiN2JhMWFiNGMxYmFiMzZiZGRkZjljNDI5YWYifQ==",
            },
          ],
        },
        {
          id: 102,
          name: "অধ্যায়-২: ব্যাকরণ",
          videos: [
            {
              id: 1006,
              title: "বর্ণ পরিচয়",
              duration: "7:55",
              vdoCipherId: "sample-id-1006",
              otp: "20160313versASE323ddb38fSFef6abeSFef6abe",
              playbackInfo: "eyJ2aWRlb0lkIjoiODZjYTNiN2JhMWFiNGMxYmFiMzZiZGRkZjljNDI5YWYifQ==",
            },
            {
              id: 1007,
              title: "শব্দ গঠন",
              duration: "11:30",
              vdoCipherId: "sample-id-1007",
              otp: "20160313versASE323ddb38fSFef6abeSFef6abe",
              playbackInfo: "eyJ2aWRlb0lkIjoiODZjYTNiN2JhMWFiNGMxYmFiMzZiZGRkZjljNDI5YWYifQ==",
            },
            {
              id: 1008,
              title: "বাক্য গঠন",
              duration: "13:45",
              vdoCipherId: "sample-id-1008",
              otp: "20160313versASE323ddb38fSFef6abeSFef6abe",
              playbackInfo: "eyJ2aWRlb0lkIjoiODZjYTNiN2JhMWFiNGMxYmFiMzZiZGRkZjljNDI5YWYifQ==",
            },
            {
              id: 1009,
              title: "ক্রিয়া পদ",
              duration: "9:20",
              vdoCipherId: "sample-id-1009",
              otp: "20160313versASE323ddb38fSFef6abeSFef6abe",
              playbackInfo: "eyJ2aWRlb0lkIjoiODZjYTNiN2JhMWFiNGMxYmFiMzZiZGRkZjljNDI5YWYifQ==",
            },
            {
              id: 1010,
              title: "বিশেষ্য ও বিশেষণ",
              duration: "10:15",
              vdoCipherId: "sample-id-1010",
              otp: "20160313versASE323ddb38fSFef6abeSFef6abe",
              playbackInfo: "eyJ2aWRlb0lkIjoiODZjYTNiN2JhMWFiNGMxYmFiMzZiZGRkZjljNDI5YWYifQ==",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "ইংরেজি",
      subcategories: [
        {
          id: 201,
          name: "অধ্যায়-১: বেসিক গ্রামার",
          videos: [
            {
              id: 2001,
              title: "Parts of Speech",
              duration: "12:10",
              vdoCipherId: "sample-id-2001",
              otp: "20160313versASE323ddb38fSFef6abeSFef6abe",
              playbackInfo: "eyJ2aWRlb0lkIjoiODZjYTNiN2JhMWFiNGMxYmFiMzZiZGRkZjljNDI5YWYifQ==",
            },
            {
              id: 2002,
              title: "Tense",
              duration: "14:25",
              vdoCipherId: "sample-id-2002",
              otp: "20160313versASE323ddb38fSFef6abeSFef6abe",
              playbackInfo: "eyJ2aWRlb0lkIjoiODZjYTNiN2JhMWFiNGMxYmFiMzZiZGRkZjljNDI5YWYifQ==",
            },
            {
              id: 2003,
              title: "Articles",
              duration: "8:30",
              vdoCipherId: "sample-id-2003",
              otp: "20160313versASE323ddb38fSFef6abeSFef6abe",
              playbackInfo: "eyJ2aWRlb0lkIjoiODZjYTNiN2JhMWFiNGMxYmFiMzZiZGRkZjljNDI5YWYifQ==",
            },
            {
              id: 2004,
              title: "Prepositions",
              duration: "11:15",
              vdoCipherId: "sample-id-2004",
              otp: "20160313versASE323ddb38fSFef6abeSFef6abe",
              playbackInfo: "eyJ2aWRlb0lkIjoiODZjYTNiN2JhMWFiNGMxYmFiMzZiZGRkZjljNDI5YWYifQ==",
            },
          ],
        },
        {
          id: 202,
          name: "অধ্যায়-২: রাইটিং স্কিলস",
          videos: [
            {
              id: 2005,
              title: "Essay Writing",
              duration: "15:40",
              vdoCipherId: "sample-id-2005",
              otp: "20160313versASE323ddb38fSFef6abeSFef6abe",
              playbackInfo: "eyJ2aWRlb0lkIjoiODZjYTNiN2JhMWFiNGMxYmFiMzZiZGRkZjljNDI5YWYifQ==",
            },
            {
              id: 2006,
              title: "Letter Writing",
              duration: "13:20",
              vdoCipherId: "sample-id-2006",
              otp: "20160313versASE323ddb38fSFef6abeSFef6abe",
              playbackInfo: "eyJ2aWRlb0lkIjoiODZjYTNiN2JhMWFiNGMxYmFiMzZiZGRkZjljNDI5YWYifQ==",
            },
            {
              id: 2007,
              title: "Report Writing",
              duration: "16:05",
              vdoCipherId: "sample-id-2007",
              otp: "20160313versASE323ddb38fSFef6abeSFef6abe",
              playbackInfo: "eyJ2aWRlb0lkIjoiODZjYTNiN2JhMWFiNGMxYmFiMzZiZGRkZjljNDI5YWYifQ==",
            },
          ],
        },
      ],
    },
  ])

  // Initialize with first video unlocked for each subcategory
  useEffect(() => {
    const initialCompletedVideos = {}
    courses.forEach((category) => {
      category.subcategories.forEach((subcategory) => {
        if (subcategory.videos.length > 0) {
          initialCompletedVideos[subcategory.videos[0].id] = true
        }
      })
    })
    setCompletedVideos(initialCompletedVideos)
  }, [courses])

  // Handle category click
  const handleCategoryClick = (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(categoryId)
    }
  }

  // Handle subcategory click
  const handleSubcategoryClick = (categoryId, subcategoryId) => {
    setSelectedCategory(categoryId)

    if (expandedSubcategory === subcategoryId) {
      setExpandedSubcategory(null)
    } else {
      setExpandedSubcategory(subcategoryId)
      setSelectedSubcategory(subcategoryId)
    }
  }

  // Handle video click
  const handleVideoClick = (video) => {
    // Check if video is unlocked
    if (completedVideos[video.id]) {
      setSelectedVideo(video)
    }
  }

  // Mark video as completed and unlock next video
  const handleVideoComplete = () => {
    if (!selectedVideo) return

    // Find the current subcategory
    const subcategory = courses
      .find((c) => c.id === selectedCategory)
      ?.subcategories.find((s) => s.id === selectedSubcategory)

    if (!subcategory) return

    // Find the index of the current video
    const currentIndex = subcategory.videos.findIndex((v) => v.id === selectedVideo.id)

    // If there's a next video, unlock it
    if (currentIndex < subcategory.videos.length - 1) {
      const nextVideoId = subcategory.videos[currentIndex + 1].id
      setCompletedVideos((prev) => ({
        ...prev,
        [nextVideoId]: true,
      }))
    }
  }

  // Navigate to next video
  const handleNextVideo = () => {
    if (!selectedVideo) return

    // Find the current subcategory
    const subcategory = courses
      .find((c) => c.id === selectedCategory)
      ?.subcategories.find((s) => s.id === selectedSubcategory)

    if (!subcategory) return

    // Find the index of the current video
    const currentIndex = subcategory.videos.findIndex((v) => v.id === selectedVideo.id)

    // If there's a next video and it's unlocked, select it
    if (currentIndex < subcategory.videos.length - 1) {
      const nextVideo = subcategory.videos[currentIndex + 1]
      if (completedVideos[nextVideo.id]) {
        setSelectedVideo(nextVideo)
      } else {
        // Mark current video as completed and unlock next video
        handleVideoComplete()
        // Then select the next video
        setSelectedVideo(nextVideo)
      }
    }
  }

  // Navigate to previous video
  const handlePreviousVideo = () => {
    if (!selectedVideo) return

    // Find the current subcategory
    const subcategory = courses
      .find((c) => c.id === selectedCategory)
      ?.subcategories.find((s) => s.id === selectedSubcategory)

    if (!subcategory) return

    // Find the index of the current video
    const currentIndex = subcategory.videos.findIndex((v) => v.id === selectedVideo.id)

    // If there's a previous video, select it
    if (currentIndex > 0) {
      setSelectedVideo(subcategory.videos[currentIndex - 1])
    }
  }

  // Get current video index and total count
  const getCurrentVideoInfo = () => {
    if (!selectedVideo || !selectedSubcategory) return { current: 0, total: 0 }

    const subcategory = courses
      .find((c) => c.id === selectedCategory)
      ?.subcategories.find((s) => s.id === selectedSubcategory)

    if (!subcategory) return { current: 0, total: 0 }

    const currentIndex = subcategory.videos.findIndex((v) => v.id === selectedVideo.id)
    return {
      current: currentIndex + 1,
      total: subcategory.videos.length,
    }
  }

  const videoInfo = getCurrentVideoInfo()

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">আমার কোর্সসমূহ</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Navigation Section - Now on the LEFT */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4">কোর্স কন্টেন্ট</h2>

              <div className="space-y-2">
                {courses.map((category) => (
                  <div key={category.id} className="border rounded-md overflow-hidden">
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium">{category.name}</span>
                      {expandedCategory === category.id ? (
                        <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedCategory === category.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-3 space-y-1 py-1">
                            {category.subcategories.map((subcategory) => (
                              <div key={subcategory.id} className="border-l">
                                <button
                                  onClick={() => handleSubcategoryClick(category.id, subcategory.id)}
                                  className={`w-full flex justify-between items-center p-2 pl-3 hover:bg-gray-50 transition-colors ${
                                    selectedSubcategory === subcategory.id ? "bg-blue-50 text-blue-600" : ""
                                  }`}
                                >
                                  <span className="text-sm">{subcategory.name}</span>
                                  {expandedSubcategory === subcategory.id ? (
                                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                                  ) : (
                                    <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                                  )}
                                </button>

                                <AnimatePresence>
                                  {expandedSubcategory === subcategory.id && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="pl-6 space-y-1 py-1">
                                        {subcategory.videos.map((video, index) => (
                                          <button
                                            key={video.id}
                                            onClick={() => handleVideoClick(video)}
                                            disabled={!completedVideos[video.id]}
                                            className={`w-full flex justify-between items-center p-2 rounded-md text-left ${
                                              selectedVideo?.id === video.id
                                                ? "bg-blue-100 text-blue-700"
                                                : completedVideos[video.id]
                                                  ? "hover:bg-gray-50"
                                                  : "opacity-60 cursor-not-allowed"
                                            }`}
                                          >
                                            <div className="flex items-center gap-2">
                                              <span className="w-5 h-5 flex-shrink-0">
                                                {completedVideos[video.id] ? (
                                                  selectedVideo?.id === video.id ? (
                                                    <PlayIcon className="w-5 h-5 text-blue-600" />
                                                  ) : (
                                                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                                  )
                                                ) : (
                                                  <LockClosedIcon className="w-5 h-5 text-gray-400" />
                                                )}
                                              </span>
                                              <span className="text-sm truncate">{video.title}</span>
                                            </div>
                                            <span className="text-xs text-gray-500">{video.duration}</span>
                                          </button>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Video Player Section - Now on the RIGHT */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {selectedVideo ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* VdoCipher Video Player */}
                <div className="aspect-video bg-black relative">
                  <iframe
                    src={`https://player.vdocipher.com/v2/?otp=${selectedVideo.otp}&playbackInfo=${selectedVideo.playbackInfo}`}
                    className="w-full h-full border-0"
                    allow="encrypted-media"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Video Info and Navigation */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{selectedVideo.title}</h2>
                    <span className="text-sm text-gray-500">{selectedVideo.duration}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      ভিডিও {videoInfo.current} / {videoInfo.total}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handlePreviousVideo}
                        disabled={videoInfo.current === 1}
                        className={`px-4 py-2 rounded-md flex items-center gap-1 ${
                          videoInfo.current === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                      >
                        <ArrowLeftIcon className="w-4 h-4" />
                        আগের ভিডিও
                      </button>

                      <button
                        onClick={handleNextVideo}
                        disabled={videoInfo.current === videoInfo.total}
                        className={`px-4 py-2 rounded-md flex items-center gap-1 ${
                          videoInfo.current === videoInfo.total
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        পরের ভিডিও
                        <ArrowRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center h-96">
                <div className="text-center text-gray-500">
                  <PlayIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-medium mb-2">কোনো ভিডিও নির্বাচিত নেই</h3>
                  <p>দেখতে চাওয়া ভিডিওটি বাছাই করুন</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyCourses

