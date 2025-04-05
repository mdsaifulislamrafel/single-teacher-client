/* eslint-disable react/prop-types */
"use client"

import { motion } from "framer-motion"
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
} from "@heroicons/react/24/outline"

const Contact = () => {
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

  // Contact info items
  const contactInfo = [
    {
      icon: EnvelopeIcon,
      title: "ইমেইল",
      details: "info@shikkhaplatform.com",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: PhoneIcon,
      title: "ফোন",
      details: "+880 1712-345678",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: MapPinIcon,
      title: "ঠিকানা",
      details: "মিরপুর-১০, ঢাকা, বাংলাদেশ",
      color: "bg-purple-100 text-purple-600",
    },
  ]

  // FAQ items
  const faqItems = [
    {
      question: "কোর্স সম্পর্কে তথ্য কিভাবে পাব?",
      answer: "আমাদের ওয়েবসাইটে সকল কোর্সের বিস্তারিত তথ্য পাওয়া যাবে। আপনি চাইলে আমাদের সাথে যোগাযোগ করে বিস্তারিত জানতে পারেন।",
    },
    {
      question: "কোর্স ফি কিভাবে পরিশোধ করব?",
      answer:
        "আপনি বিকাশ, নগদ, রকেট বা অন্যান্য মোবাইল ব্যাংকিং সেবার মাধ্যমে কোর্স ফি পরিশোধ করতে পারেন। এছাড়া ক্রেডিট/ডেবিট কার্ডও ব্যবহার করতে পারেন।",
    },
    {
      question: "কোর্স শেষে কি সার্টিফিকেট পাব?",
      answer: "হ্যাঁ, সকল কোর্স সফলভাবে সম্পন্ন করার পর আপনি একটি ডিজিটাল সার্টিফিকেট পাবেন যা আপনার প্রোফাইলে যুক্ত হবে।",
    },
    {
      question: "কোর্স কি মোবাইলে দেখা যাবে?",
      answer: "হ্যাঁ, আমাদের সকল কোর্স মোবাইল, ট্যাবলেট এবং কম্পিউটারে দেখা যাবে। আমাদের প্লাটফর্ম সম্পূর্ণ রেসপন্সিভ।",
    },
    {
      question: "কোর্স কি সারাজীবন অ্যাক্সেস করতে পারব?",
      answer: "হ্যাঁ, একবার কোর্স কিনলে আপনি সারাজীবন অ্যাক্সেস পাবেন। আমরা নিয়মিত কোর্স আপডেট করি যা আপনি বিনামূল্যে পাবেন।",
    },
  ]

  // Office hours
  const officeHours = [
    { day: "সোমবার - শুক্রবার", time: "সকাল ৯টা - সন্ধ্যা ৬টা" },
    { day: "শনিবার", time: "সকাল ১০টা - দুপুর ২টা" },
    { day: "রবিবার", time: "বন্ধ" },
  ]

  // Social media links
  const socialLinks = [
    { name: "Facebook", url: "#", icon: "facebook" },
    { name: "YouTube", url: "#", icon: "youtube" },
    { name: "Instagram", url: "#", icon: "instagram" },
    { name: "LinkedIn", url: "#", icon: "linkedin" },
  ]

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center mb-12">
          <motion.div variants={itemVariants} className="inline-block mb-2">
            <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-600 font-medium text-sm">
              আমাদের সাথে যোগাযোগ করুন
            </span>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            আমাদের <span className="text-blue-600">যোগাযোগ মাধ্যম</span>
          </motion.h2>

          <motion.p variants={itemVariants} className="text-gray-600 max-w-2xl mx-auto">
            আমরা সবসময় আপনাকে সাহায্য করতে প্রস্তুত। আপনার যেকোনো প্রশ্ন বা জিজ্ঞাসার জন্য নিচের যোগাযোগ মাধ্যমগুলো ব্যবহার করুন।
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Info Cards - Now spans 5 columns */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 space-y-6"
          >
            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 gap-4">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4"
                >
                  <div
                    className={`w-14 h-14 rounded-full ${item.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <item.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-lg">{item.title}</h4>
                    <p className="text-gray-600">{item.details}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Office Hours */}
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <ClockIcon className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">অফিস সময়</h3>
              </div>

              <div className="space-y-3">
                {officeHours.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0"
                  >
                    <span className="font-medium">{item.day}</span>
                    <span className="text-gray-600">{item.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Social Media Links */}
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.48 22a.99.99 0 0 1-.71-.29l-4.26-4.27a.996.996 0 0 1-.29-.71v-2.73l-3.28 3.28a1.49 1.49 0 0 1-2.12 0 1.49 1.49 0 0 1 0-2.12l3.28-3.28H8.37a.996.996 0 0 1-.71-.29l-4.27-4.26a.996.996 0 0 1 0-1.41l4.05-4.05a.996.996 0 0 1 1.41 0l4.26 4.27c.19.19.29.44.29.71v2.73l6.63-6.63a.996.996 0 0 1 1.41 0l2.73 2.73c.19.19.29.44.29.71s-.1.52-.29.71L18.48 22z"></path>
                </svg>
                <h3 className="text-lg font-bold text-gray-900">সোশ্যাল মিডিয়া</h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {socialLinks.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.url}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 font-medium flex items-center gap-2 transition-colors"
                  >
                    <SocialIcon name={item.icon} />
                    {item.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* FAQ Section - Now spans 7 columns */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-7">
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <BookOpenIcon className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">সাধারণ জিজ্ঞাসা</h3>
              </div>

              <div className="space-y-6">
                {faqItems.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="border-b border-gray-100 pb-5 last:border-0 last:pb-0"
                  >
                    <h4 className="font-medium text-gray-900 mb-2 flex items-start gap-2 text-lg">
                      <AcademicCapIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      {item.question}
                    </h4>
                    <p className="text-gray-600 pl-7">{item.answer}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Map Section */}
            <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-4">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                {/* Replace with actual map embed */}
                <div className="w-full h-full flex items-center justify-center bg-blue-50">
                  <div className="text-center">
                    <MapPinIcon className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">আমাদের অফিসের অবস্থান</p>
                    <p className="text-sm text-gray-500 mt-2">মিরপুর-১০, ঢাকা, বাংলাদেশ</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Helper component for social icons
const SocialIcon = ({ name }) => {
  switch (name) {
    case "facebook":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
        </svg>
      )
    case "youtube":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.244 4c.534.003 1.87.016 3.29.073l.504.022c1.429.067 2.857.183 3.566.38a2.5 2.5 0 0 1 1.754 1.755c.197.71.313 2.138.38 3.567l.022.504c.057 1.42.07 2.756.073 3.29v.818c-.003.534-.016 1.87-.073 3.29l-.022.504c-.067 1.429-.183 2.857-.38 3.566a2.5 2.5 0 0 1-1.754 1.754c-.71.197-2.138.313-3.567.38l-.504.022c-1.42.057-2.756.07-3.29.073h-.818c-.534-.003-1.87-.016-3.29-.073l-.504-.022c-1.429-.067-2.857-.183-3.566-.38a2.5 2.5 0 0 1-1.755-1.754c-.197-.71-.313-2.138-.38-3.567l-.022-.504c-.057-1.42-.07-2.756-.073-3.29v-.818c.003-.534.016-1.87.073-3.29l.022-.504c.067-1.429.183-2.857.38-3.566A2.5 2.5 0 0 1 4.06 4.476c.71-.197 2.137-.313 3.566-.38l.504-.022c1.42-.057 2.756-.07 3.29-.073h.818ZM10 9v6l5.25-3L10 9Z" />
        </svg>
      )
    case "instagram":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0-2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm6.5-.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM12 4c-2.474 0-2.878.007-4.029.058-.784.037-1.31.142-1.798.332-.434.168-.747.369-1.08.703a2.89 2.89 0 0 0-.704 1.08c-.19.49-.295 1.015-.331 1.798C4.006 9.075 4 9.461 4 12c0 2.474.007 2.878.058 4.029.037.783.142 1.31.331 1.797.17.435.37.748.702 1.08.337.336.65.537 1.08.703.494.191 1.02.297 1.8.333C9.075 19.994 9.461 20 12 20c2.474 0 2.878-.007 4.029-.058.782-.037 1.309-.142 1.797-.331.433-.169.748-.37 1.08-.702.337-.337.538-.65.704-1.08.19-.493.296-1.02.332-1.8.052-1.104.058-1.49.058-4.029 0-2.474-.007-2.878-.058-4.029-.037-.782-.142-1.31-.332-1.798a2.911 2.911 0 0 0-.703-1.08 2.884 2.884 0 0 0-1.08-.704c-.49-.19-1.016-.295-1.798-.331C14.925 4.006 14.539 4 12 4Zm0-2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2Z" />
        </svg>
      )
    case "linkedin":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68Z" />
        </svg>
      )
    default:
      return null
  }
}

export default Contact

