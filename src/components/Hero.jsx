"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRightIcon, BookOpenIcon, AcademicCapIcon, UserGroupIcon } from "@heroicons/react/24/outline"

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  }

  const floatingAnimation = {
    y: ["-5%", "5%"],
    transition: {
      y: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  }

  const statsItems = [
    { icon: BookOpenIcon, value: "১০০+", label: "কোর্স", color: "bg-blue-100 text-blue-600" },
    { icon: AcademicCapIcon, value: "৫০+", label: "শিক্ষক", color: "bg-green-100 text-green-600" },
    { icon: UserGroupIcon, value: "১০,০০০+", label: "শিক্ষার্থী", color: "bg-purple-100 text-purple-600" },
  ]

  const subjects = ["গণিত", "বিজ্ঞান", "ইংরেজি", "বাংলা", "ইতিহাস", "ভূগোল", "কম্পিউটার", "প্রোগ্রামিং"]

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-100 mix-blend-multiply opacity-70 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-purple-100 mix-blend-multiply opacity-70 blur-3xl"></div>
        <div className="absolute top-40 right-20 w-40 h-40 rounded-full bg-green-100 mix-blend-multiply opacity-70 blur-3xl"></div>
      </div>

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-[20%] w-8 h-8 rounded bg-blue-400 opacity-20"
          animate={{
            y: [0, 50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-40 right-[30%] w-6 h-6 rounded-full bg-green-400 opacity-20"
          animate={{
            y: [0, -30, 0],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-[40%] w-10 h-10 rounded-lg bg-purple-400 opacity-20"
          animate={{
            y: [0, -40, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <motion.div
          className="flex flex-col lg:flex-row items-center justify-between gap-12"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Hero Content */}
          <div className="w-full lg:w-1/2">
            <motion.div variants={itemVariants} className="mb-2">
              <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 font-medium text-sm">
                শিক্ষার নতুন দিগন্ত
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight"
            >
              আপনার <span className="text-blue-600">শিক্ষা যাত্রা</span> শুরু করুন আজই
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-8 max-w-xl">
              আমাদের অনলাইন শিক্ষা প্লাটফর্মে যোগ দিন এবং দেশের সেরা শিক্ষকদের সাথে শিখুন। যেকোনো সময়, যেকোনো জায়গায় আপনার পছন্দের
              বিষয়গুলি অধ্যয়ন করুন।
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
              >
                শুরু করুন <ArrowRightIcon className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-200 rounded-full font-medium hover:bg-blue-50 transition-colors"
              >
                কোর্স দেখুন
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
              {statsItems.map((item, index) => (
                <div key={index} className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-full ${item.color} flex items-center justify-center mb-2`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-2xl">{item.value}</div>
                  <div className="text-gray-500 text-sm">{item.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div variants={itemVariants} className="w-full lg:w-1/2 relative">
            <motion.div className="relative z-10" animate={floatingAnimation}>
              <img
                src="https://img.freepik.com/free-vector/online-learning-concept-illustration_114360-4735.jpg"
                alt="Online Learning"
                className="w-full max-w-lg mx-auto rounded-lg shadow-2xl"
              />
            </motion.div>

            {/* Floating subject bubbles */}
            <div className="absolute inset-0 pointer-events-none">
              {subjects.map((subject, index) => {
                const angle = (index / subjects.length) * Math.PI * 2
                const radius = 180
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius

                return (
                  <motion.div
                    key={index}
                    className="absolute top-1/2 left-1/2 px-3 py-1 bg-white rounded-full shadow-md text-sm font-medium"
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 0,
                    }}
                    animate={{
                      x,
                      y,
                      opacity: 1,
                      transition: {
                        delay: 0.5 + index * 0.1,
                        duration: 0.5,
                      },
                    }}
                    style={{
                      backgroundColor: `hsl(${(index * 40) % 360}, 80%, 95%)`,
                      color: `hsl(${(index * 40) % 360}, 80%, 40%)`,
                    }}
                  >
                    {subject}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Trusted by section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="mt-16 text-center"
        >
          <motion.p variants={itemVariants} className="text-gray-500 mb-6">
            বিশ্বস্ত শিক্ষা প্রতিষ্ঠানসমূহ
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="h-12 flex items-center justify-center">
                <div className="w-24 h-8 bg-gray-300 rounded-md animate-pulse"></div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Hero

