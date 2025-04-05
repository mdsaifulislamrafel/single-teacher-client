import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CurrencyBangladeshiIcon,
  ComputerDesktopIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline"

const Faq = () => {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedItems, setExpandedItems] = useState({})
  const [filteredQuestions, setFilteredQuestions] = useState([])

  // FAQ Categories
  const categories = [
    { id: "all", name: "সকল প্রশ্ন", icon: QuestionMarkCircleIcon },
    { id: "courses", name: "কোর্স সম্পর্কিত", icon: BookOpenIcon },
    { id: "payment", name: "পেমেন্ট সম্পর্কিত", icon: CurrencyBangladeshiIcon },
    { id: "technical", name: "টেকনিক্যাল", icon: ComputerDesktopIcon },
    { id: "certificate", name: "সার্টিফিকেট", icon: AcademicCapIcon },
  ]

  // FAQ Items
  const faqItems = [
    {
      id: 1,
      category: "courses",
      question: "কোর্সগুলো কি সারাজীবন অ্যাক্সেস করা যাবে?",
      answer:
        "হ্যাঁ, আমাদের প্লাটফর্মে একবার কোর্স কিনলে আপনি সেটি সারাজীবন অ্যাক্সেস করতে পারবেন। আমরা নিয়মিত কোর্স আপডেট করি, যা আপনি বিনামূল্যে পাবেন।",
    },
    {
      id: 2,
      category: "courses",
      question: "কোর্সগুলো কি অফলাইনে দেখা যাবে?",
      answer:
        "হ্যাঁ, আমাদের মোবাইল অ্যাপ ব্যবহার করে আপনি ভিডিও ডাউনলোড করে অফলাইনে দেখতে পারবেন। তবে কম্পিউটারে অফলাইন দেখার সুবিধা এখনো উপলব্ধ নয়।",
    },
    {
      id: 3,
      category: "payment",
      question: "কোর্স ফি কিভাবে পরিশোধ করা যাবে?",
      answer:
        "আপনি বিকাশ, নগদ, রকেট বা অন্যান্য মোবাইল ব্যাংকিং সেবার মাধ্যমে কোর্স ফি পরিশোধ করতে পারেন। এছাড়া ভিসা, মাস্টারকার্ড, আমেরিকান এক্সপ্রেস ইত্যাদি ক্রেডিট/ডেবিট কার্ডও ব্যবহার করতে পারেন।",
    },
    {
      id: 4,
      category: "payment",
      question: "কোর্সের জন্য কি কিস্তিতে পেমেন্ট করা যাবে?",
      answer:
        "হ্যাঁ, আমাদের বেশিরভাগ কোর্সের জন্য ৩-৬ মাসের কিস্তিতে পেমেন্ট করার সুবিধা রয়েছে। কিস্তির বিস্তারিত জানতে কোর্স পেজে 'কিস্তিতে কিনুন' অপশনে ক্লিক করুন।",
    },
    {
      id: 5,
      category: "payment",
      question: "রিফান্ড পলিসি কি?",
      answer:
        "কোর্স কেনার পর ৭ দিনের মধ্যে আপনি যদি সন্তুষ্ট না হন, তাহলে সম্পূর্ণ রিফান্ড পাবেন। তবে এক্ষেত্রে আপনাকে অবশ্যই ৫০% এর বেশি কোর্স কনটেন্ট দেখা যাবে না।",
    },
    {
      id: 6,
      category: "technical",
      question: "ভিডিও দেখতে সমস্যা হলে কি করব?",
      answer:
        "ভিডিও দেখতে সমস্যা হলে প্রথমে আপনার ইন্টারনেট কানেকশন চেক করুন। এরপরও সমস্যা থাকলে ব্রাউজার ক্যাশে ক্লিয়ার করুন বা অন্য ব্রাউজার ব্যবহার করুন। সমস্যা অব্যাহত থাকলে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।",
    },
    {
      id: 7,
      category: "technical",
      question: "কোন ডিভাইসে কোর্স দেখা যাবে?",
      answer:
        "আমাদের কোর্সগুলো যেকোনো ডিভাইসে (স্মার্টফোন, ট্যাবলেট, ল্যাপটপ, ডেস্কটপ) দেখা যাবে। অ্যান্ড্রয়েড ও আইওএস উভয় প্লাটফর্মের জন্য আমাদের মোবাইল অ্যাপ রয়েছে।",
    },
    {
      id: 8,
      category: "certificate",
      question: "কোর্স শেষে কি সার্টিফিকেট দেওয়া হয়?",
      answer:
        "হ্যাঁ, সকল কোর্স সফলভাবে সম্পন্ন করার পর আপনি একটি ডিজিটাল সার্টিফিকেট পাবেন। এই সার্টিফিকেট আপনি ডাউনলোড করে প্রিন্ট করতে পারবেন এবং আপনার প্রোফাইলে সংরক্ষিত থাকবে।",
    },
    {
      id: 9,
      category: "certificate",
      question: "সার্টিফিকেট কি আন্তর্জাতিকভাবে স্বীকৃত?",
      answer:
        "আমাদের বেশিরভাগ সার্টিফিকেট বাংলাদেশের বিভিন্ন প্রতিষ্ঠান দ্বারা স্বীকৃত। কিছু বিশেষ কোর্সের সার্টিফিকেট আন্তর্জাতিক মানের, যা কোর্স বিবরণীতে উল্লেখ করা আছে।",
    },
    {
      id: 10,
      category: "account",
      question: "একাধিক ডিভাইসে একই অ্যাকাউন্ট ব্যবহার করা যাবে কি?",
      answer:
        "হ্যাঁ, আপনি একই অ্যাকাউন্ট দিয়ে সর্বাধিক ১টি ডিভাইসে লগইন করতে পারবেন। তবে একই সময়ে শুধুমাত্র একটি ডিভাইসে ভিডিও দেখা যাবে।",
    },
    {
      id: 12,
      category: "courses",
      question: "কোর্সের মেয়াদ কত দিন?",
      answer:
        "আমাদের কোর্সগুলোর কোন নির্দিষ্ট মেয়াদ নেই। আপনি নিজের গতিতে যেকোনো সময় কোর্স সম্পন্ন করতে পারেন। একবার কোর্স কিনলে আপনি সারাজীবন অ্যাক্সেস পাবেন।",
    },
    {
      id: 13,
      category: "technical",
      question: "ইন্টারনেট স্পিড কত হলে ভিডিও ভালোভাবে দেখা যাবে?",
      answer:
        "ভিডিও স্ট্রিমিং এর জন্য কমপক্ষে 1 Mbps ইন্টারনেট স্পিড প্রয়োজন। HD কোয়ালিটিতে দেখার জন্য 3-4 Mbps স্পিড সুপারিশ করা হয়। আপনি ভিডিও প্লেয়ারে কোয়ালিটি অপশন থেকে ভিডিও রেজোলিউশন কমিয়ে স্লো ইন্টারনেটেও দেখতে পারেন।",
    },
    {
      id: 14,
      category: "payment",
      question: "কোর্স কিনতে কি কুপন কোড ব্যবহার করা যায়?",
      answer:
        "হ্যাঁ, আমরা নিয়মিত বিভিন্ন প্রমোশনের জন্য কুপন কোড প্রদান করি। কোর্স কেনার সময় চেকআউট পেজে কুপন কোড অপশনে আপনার কুপন কোড বসিয়ে ডিসকাউন্ট পেতে পারেন।",
    }
  ]

  // Filter questions based on category and search query
  useEffect(() => {
    let filtered = faqItems

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter((item) => item.category === activeCategory)
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) => item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query),
      )
    }

    setFilteredQuestions(filtered)
  }, [activeCategory, searchQuery])

  // Toggle FAQ item expansion
  const toggleItem = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  const contentVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { type: "spring", stiffness: 100, damping: 20 },
        opacity: { duration: 0.25 },
      },
    },
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center mb-12">
          <motion.div variants={itemVariants} className="inline-block mb-2">
            <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-600 font-medium text-sm">সাধারণ জিজ্ঞাসা</span>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            আপনার <span className="text-blue-600">প্রশ্নের উত্তর</span> খুঁজুন
          </motion.h2>

          <motion.p variants={itemVariants} className="text-gray-600 max-w-2xl mx-auto">
            আমাদের প্লাটফর্ম সম্পর্কে সাধারণ জিজ্ঞাসা ও উত্তরগুলো এখানে দেওয়া আছে। আপনার প্রশ্নের উত্তর না পেলে আমাদের সাথে যোগাযোগ করুন।
          </motion.p>
        </motion.div>

        {/* Search Bar */}
        <motion.div variants={itemVariants} className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="আপনার প্রশ্ন খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="text-lg font-bold mb-4 px-2">বিষয়সমূহ</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeCategory === category.id ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                    }`}
                  >
                    <category.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{category.name}</span>
                    {activeCategory === category.id && (
                      <motion.div
                        layoutId="activeCategoryIndicator"
                        className="ml-auto w-1.5 h-5 bg-blue-600 rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Help Box */}
            <motion.div
              variants={itemVariants}
              className="bg-blue-50 rounded-xl shadow-md p-6 mt-6 border border-blue-100"
            >
              <h3 className="text-lg font-bold mb-2 text-blue-800">আরও সাহায্য প্রয়োজন?</h3>
              <p className="text-blue-700 mb-4 text-sm">
                আপনার প্রশ্নের উত্তর এখানে না পেলে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                যোগাযোগ করুন
              </motion.button>
            </motion.div>
          </motion.div>

          {/* FAQ Items */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-3">
            {filteredQuestions.length > 0 ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="space-y-4">
                  {filteredQuestions.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full flex justify-between items-start text-left gap-4 group"
                      >
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.question}
                        </h3>
                        <div className="flex-shrink-0 mt-1">
                          <motion.div
                            animate={{ rotate: expandedItems[item.id] ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className={`p-1 rounded-full ${
                              expandedItems[item.id] ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <ChevronDownIcon className="w-4 h-4" />
                          </motion.div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedItems[item.id] && (
                          <motion.div
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="mt-2 text-gray-600 overflow-hidden"
                          >
                            <div className="pt-2 pl-0">{item.answer}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <QuestionMarkCircleIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">কোন ফলাফল পাওয়া যায়নি</h3>
                <p className="text-gray-600 mb-4">
                  আপনার অনুসন্ধানের সাথে মিলে এমন কোন প্রশ্ন পাওয়া যায়নি। অন্য কিছু খুঁজে দেখুন অথবা আমাদের সাথে যোগাযোগ করুন।
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setActiveCategory("all")
                  }}
                  className="text-blue-600 font-medium hover:underline"
                >
                  সব প্রশ্ন দেখুন
                </button>
              </motion.div>
            )}

            {/* FAQ Stats */}
            {filteredQuestions.length > 0 && (
              <motion.div variants={itemVariants} className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <BookOpenIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-800">মোট প্রশ্ন</p>
                    <p className="text-xl font-bold text-green-900">{faqItems.length}</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <AcademicCapIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-800">বিষয় সংখ্যা</p>
                    <p className="text-xl font-bold text-blue-900">{categories.length - 1}</p>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <UserGroupIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-800">সাপোর্ট টিম</p>
                    <p className="text-xl font-bold text-purple-900">২৪/৭</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Still Have Questions Section */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-16 text-center">
          <motion.h3 variants={itemVariants} className="text-2xl font-bold mb-4">
            আরও প্রশ্ন আছে?
          </motion.h3>

          <motion.p variants={itemVariants} className="text-gray-600 max-w-2xl mx-auto mb-8">
            আমাদের সাপোর্ট টিম সবসময় আপনাকে সাহায্য করতে প্রস্তুত। আপনার যেকোনো প্রশ্ন বা সমস্যা নিয়ে আমাদের সাথে যোগাযোগ করুন।
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              লাইভ চ্যাট করুন
            </motion.a>

            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              ইমেইল পাঠান
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Faq

