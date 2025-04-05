"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"

const Skills = () => {
  const [activeTab, setActiveTab] = useState("academic")
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  // Skill categories and data
  const skillCategories = [
    { id: "academic", name: "একাডেমিক দক্ষতা" },
    { id: "technical", name: "টেকনিক্যাল দক্ষতা" },
    { id: "language", name: "ভাষা দক্ষতা" },
    { id: "soft", name: "সফট স্কিল" },
  ]

  const skillsData = {
    academic: [
      { name: "গণিত", level: 85, color: "from-blue-500 to-blue-600", icon: "➗" },
      { name: "বিজ্ঞান", level: 90, color: "from-green-500 to-green-600", icon: "🧪" },
      { name: "ইতিহাস", level: 75, color: "from-amber-500 to-amber-600", icon: "📜" },
      { name: "ভূগোল", level: 80, color: "from-purple-500 to-purple-600", icon: "🌍" },
      { name: "সাহিত্য", level: 70, color: "from-pink-500 to-pink-600", icon: "📚" },
    ],
    technical: [
      { name: "প্রোগ্রামিং", level: 80, color: "from-blue-500 to-blue-600", icon: "💻" },
      { name: "ডাটা সায়েন্স", level: 75, color: "from-green-500 to-green-600", icon: "📊" },
      { name: "ওয়েব ডেভেলপমেন্ট", level: 85, color: "from-purple-500 to-purple-600", icon: "🌐" },
      { name: "মোবাইল অ্যাপ", level: 70, color: "from-orange-500 to-orange-600", icon: "📱" },
      { name: "আর্টিফিশিয়াল ইন্টেলিজেন্স", level: 65, color: "from-red-500 to-red-600", icon: "🤖" },
    ],
    language: [
      { name: "বাংলা", level: 95, color: "from-green-500 to-green-600", icon: "🇧🇩" },
      { name: "ইংরেজি", level: 85, color: "from-blue-500 to-blue-600", icon: "🇬🇧" },
      { name: "হিন্দি", level: 70, color: "from-orange-500 to-orange-600", icon: "🇮🇳" },
      { name: "আরবি", level: 60, color: "from-amber-500 to-amber-600", icon: "🇸🇦" },
      { name: "জাপানি", level: 40, color: "from-red-500 to-red-600", icon: "🇯🇵" },
    ],
    soft: [
      { name: "যোগাযোগ দক্ষতা", level: 90, color: "from-blue-500 to-blue-600", icon: "🗣️" },
      { name: "দলগত কাজ", level: 85, color: "from-green-500 to-green-600", icon: "👥" },
      { name: "সমস্যা সমাধান", level: 80, color: "from-purple-500 to-purple-600", icon: "🧩" },
      { name: "সময় ব্যবস্থাপনা", level: 75, color: "from-amber-500 to-amber-600", icon: "⏰" },
      { name: "নেতৃত্ব", level: 70, color: "from-red-500 to-red-600", icon: "👑" },
    ],
  }

  // Benefits of skill development
  const benefits = [
    {
      title: "ক্যারিয়ার উন্নয়ন",
      description: "নতুন দক্ষতা অর্জন করে আপনার ক্যারিয়ারে এগিয়ে যান",
      icon: "💼",
    },
    {
      title: "আত্মবিশ্বাস বৃদ্ধি",
      description: "নতুন বিষয়ে দক্ষতা অর্জন করে আত্মবিশ্বাস বাড়ান",
      icon: "🚀",
    },
    {
      title: "সামাজিক সম্পর্ক",
      description: "একই আগ্রহের মানুষদের সাথে সংযোগ স্থাপন করুন",
      icon: "🤝",
    },
    {
      title: "মানসিক বিকাশ",
      description: "নতুন দক্ষতা শিখলে মস্তিষ্কের বিকাশ ঘটে",
      icon: "🧠",
    },
  ]

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div variants={containerVariants} initial="hidden" animate={controls} className="text-center mb-12">
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            আপনার দক্ষতা <span className="text-blue-600">উন্নত করুন</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-600 max-w-2xl mx-auto">
            আমাদের প্লাটফর্মে বিভিন্ন ধরনের দক্ষতা শিখুন এবং নিজেকে প্রস্তুত করুন ভবিষ্যতের জন্য। আমরা আপনাকে সাহায্য করব আপনার লক্ষ্যে পৌঁছাতে।
          </motion.p>
        </motion.div>

        {/* Skill Categories Tabs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12"
        >
          {skillCategories.map((category) => (
            <motion.button
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(category.id)}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-medium transition-all ${
                activeTab === category.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Progress Bars */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {skillsData[activeTab].map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.1 },
                  }}
                  className="bg-white rounded-lg p-4 shadow-md"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{skill.icon}</span>
                      <h3 className="font-medium">{skill.name}</h3>
                    </div>
                    <span className="font-bold text-blue-600">{skill.level}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Skill Development Info */}
          <div className="flex flex-col justify-center">
            <motion.h3 variants={itemVariants} className="text-2xl font-bold mb-6 text-gray-900">
              দক্ষতা উন্নয়নের সুবিধা
            </motion.h3>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  variants={itemVariants}
                  custom={index}
                  className="flex gap-4 bg-white p-4 rounded-lg shadow-md"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{benefit.title}</h4>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="text-center bg-white p-8 rounded-xl shadow-xl max-w-3xl mx-auto"
        >
          <motion.h3 variants={itemVariants} className="text-2xl font-bold mb-4 text-gray-900">
            আজই শুরু করুন আপনার দক্ষতা উন্নয়ন যাত্রা
          </motion.h3>
          <motion.p variants={itemVariants} className="text-gray-600 mb-6">
            আমাদের বিশেষজ্ঞ শিক্ষকদের সাহায্যে নতুন দক্ষতা অর্জন করুন এবং আপনার ক্যারিয়ারে এগিয়ে যান।
          </motion.p>
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium shadow-lg hover:bg-blue-700 transition-colors"
          >
            কোর্স ব্রাউজ করুন
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default Skills

