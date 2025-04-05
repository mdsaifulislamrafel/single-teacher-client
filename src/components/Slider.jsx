"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const autoPlayRef = useRef(null)

  // Educational slider data
  const slides = [
    {
      id: 1,
      title: "ডিজিটাল শিক্ষার নতুন যুগ",
      subtitle: "যেকোনো সময়, যেকোনো জায়গায় শিখুন",
      description: "আমাদের অনলাইন প্লাটফর্মে ১০০+ কোর্স এবং ৫০০+ ভিডিও টিউটোরিয়াল রয়েছে যা আপনাকে আপনার লক্ষ্যে পৌঁছাতে সাহায্য করবে।",
      image: "https://img.freepik.com/free-vector/online-learning-isometric-concept_1284-17947.jpg",
      color: "from-blue-500 to-purple-500",
      buttonText: "কোর্স দেখুন",
    },
    {
      id: 2,
      title: "ইন্টারেক্টিভ লার্নিং",
      subtitle: "অভিজ্ঞতার মাধ্যমে শিখুন",
      description: "কুইজ, প্রজেক্ট এবং ইন্টারেক্টিভ এক্সারসাইজের মাধ্যমে আপনার জ্ঞান পরীক্ষা করুন এবং দক্ষতা বাড়ান।",
      image: "https://img.freepik.com/free-vector/online-certification-illustration_23-2148575636.jpg",
      color: "from-green-500 to-teal-500",
      buttonText: "অভিজ্ঞতা নিন",
    },
    {
      id: 3,
      title: "বিশেষজ্ঞ শিক্ষকদের সাথে",
      subtitle: "সেরা শিক্ষকদের কাছ থেকে শিখুন",
      description: "আমাদের প্লাটফর্মে দেশের সেরা শিক্ষকরা আপনাকে সহজ ও আকর্ষণীয় উপায়ে পড়াবেন।",
      image: "https://img.freepik.com/free-vector/teacher-concept-illustration_114360-2166.jpg",
      color: "from-orange-500 to-red-500",
      buttonText: "শিক্ষকদের দেখুন",
    },
    {
      id: 4,
      title: "ক্যারিয়ার উন্নয়ন",
      subtitle: "আপনার ভবিষ্যৎ গড়ুন",
      description: "আমাদের স্কিল ডেভেলপমেন্ট কোর্সগুলি আপনাকে চাকরি বাজারে প্রতিযোগিতামূলক সুবিধা দেবে।",
      image: "https://img.freepik.com/free-vector/career-progress-concept-illustration_114360-5339.jpg",
      color: "from-blue-600 to-cyan-500",
      buttonText: "স্কিল বাড়ান",
    },
  ]

  // Auto-play functionality
  useEffect(() => {
    autoPlayRef.current = nextSlide
  })

  useEffect(() => {
    const play = () => {
      autoPlayRef.current()
    }

    const interval = setInterval(play, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setDirection(1)
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  // Animation variants
  const sliderVariants = {
    incoming: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
    }),
    active: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    },
    outgoing: (direction) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    }),
  }

  // Content animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <div className="relative w-full overflow-hidden bg-gray-50">
      {/* Main Slider */}
      <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={sliderVariants}
            initial="incoming"
            animate="active"
            exit="outgoing"
            className="absolute inset-0 w-full h-full"
          >
            <div className={`w-full h-full bg-gradient-to-r ${slides[currentSlide].color} relative overflow-hidden`}>
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white"></div>
                <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-white"></div>
                <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white"></div>
              </div>

              <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-between">
                {/* Text Content */}
                <div className="w-full md:w-1/2 text-white z-10 mb-8 md:mb-0">
                  <motion.h3
                    custom={0}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-lg md:text-xl font-medium mb-2"
                  >
                    {slides[currentSlide].subtitle}
                  </motion.h3>

                  <motion.h2
                    custom={1}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-3xl md:text-5xl font-bold mb-4"
                  >
                    {slides[currentSlide].title}
                  </motion.h2>

                  <motion.p
                    custom={2}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-base md:text-lg mb-8 max-w-md"
                  >
                    {slides[currentSlide].description}
                  </motion.p>

                  <motion.button
                    custom={3}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-white text-gray-900 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    {slides[currentSlide].buttonText}
                  </motion.button>
                </div>

                {/* Image */}
                <motion.div
                  custom={2}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="w-full md:w-1/2 flex justify-center items-center"
                >
                  <div className="relative w-full max-w-md">
                    <motion.img
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].title}
                      className="w-full h-auto rounded-lg shadow-2xl"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    />

                    {/* Decorative elements around image */}
                    <motion.div
                      className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-yellow-300"
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    />
                    <motion.div
                      className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-purple-300"
                      animate={{
                        y: [0, 10, 0],
                        rotate: [0, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white z-20 hover:bg-white/50 transition-all"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white z-20 hover:bg-white/50 transition-all"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1)
              setCurrentSlide(index)
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default Slider

