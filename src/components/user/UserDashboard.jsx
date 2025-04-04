"use client"

import { useState } from "react"
import { BookOpenIcon, CheckCircleIcon, DocumentTextIcon, CurrencyBangladeshiIcon } from "@heroicons/react/24/outline"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const UserDashboard = () => {
  // Sample user stats
  const [userStats, setUserStats] = useState({
    enrolledCourses: 5,
    completedCourses: 3,
    purchasedPdfs: 8,
    totalSpent: 3500,
  })

  // Sample data for learning progress chart
  const [progressData, setProgressData] = useState([
    { name: "জানুয়ারি", progress: 10, hours: 5 },
    { name: "ফেব্রুয়ারি", progress: 25, hours: 8 },
    { name: "মার্চ", progress: 40, hours: 12 },
    { name: "এপ্রিল", progress: 55, hours: 15 },
    { name: "মে", progress: 70, hours: 20 },
    { name: "জুন", progress: 85, hours: 25 },
    { name: "জুলাই", progress: 100, hours: 30 },
  ])

  // Sample data for category distribution
  const [categoryData, setCategoryData] = useState([
    { name: "প্রোগ্রামিং", value: 2 },
    { name: "ডিজাইন", value: 1 },
    { name: "মার্কেটিং", value: 1 },
    { name: "ব্যবসা", value: 1 },
  ])

  // Sample data for purchase history
  const [purchaseData, setPurchaseData] = useState([
    { name: "জানুয়ারি", courses: 1, pdfs: 2, amount: 800 },
    { name: "ফেব্রুয়ারি", courses: 0, pdfs: 1, amount: 300 },
    { name: "মার্চ", courses: 1, pdfs: 0, amount: 1200 },
    { name: "এপ্রিল", courses: 0, pdfs: 2, amount: 400 },
    { name: "মে", courses: 2, pdfs: 1, amount: 1500 },
    { name: "জুন", courses: 1, pdfs: 2, amount: 1100 },
  ])

  // Colors for pie chart
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  const statItems = [
    {
      title: "মোট কোর্স",
      icon: BookOpenIcon,
      value: userStats.enrolledCourses,
    },
    {
      title: "সম্পূর্ণ কোর্স",
      icon: CheckCircleIcon,
      value: userStats.completedCourses,
    },
    {
      title: "মোট PDF",
      icon: DocumentTextIcon,
      value: userStats.purchasedPdfs,
    },
    {
      title: "মোট ব্যয়",
      icon: CurrencyBangladeshiIcon,
      value: `৳${userStats.totalSpent}`,
    },
  ]

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">আমার ড্যাশবোর্ড</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statItems.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <item.icon className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              <span className="text-xl md:text-2xl font-bold text-gray-900">{item.value}</span>
            </div>
            <p className="text-sm text-gray-600">{item.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Learning Progress Chart */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">শিক্ষার অগ্রগতি</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="progress"
                  name="অগ্রগতি (%)"
                  stroke="#3b82f6"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line type="monotone" dataKey="hours" name="ঘন্টা" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">কোর্স ক্যাটাগরি বিতরণ</h2>
          <div className="h-80 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} কোর্স`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Purchase History Chart */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">ক্রয় ইতিহাস</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={purchaseData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="courses" name="কোর্স" fill="#3b82f6" />
              <Bar dataKey="pdfs" name="PDF" fill="#10b981" />
              <Line
                type="monotone"
                dataKey="amount"
                name="মূল্য (৳)"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4">সাম্প্রতিক কার্যকলাপ</h2>
        <div className="space-y-4">
          {[
            { date: "১০ জুন, ২০২৩", activity: "প্রোগ্রামিং বেসিক কোর্স সম্পন্ন করেছেন", type: "course" },
            { date: "০৫ জুন, ২০২৩", activity: "ওয়েব ডিজাইন PDF ক্রয় করেছেন", type: "pdf" },
            { date: "০১ জুন, ২০২৩", activity: "জাভাস্ক্রিপ্ট অ্যাডভান্সড কোর্সে নথিভুক্ত হয়েছেন", type: "enrollment" },
            { date: "২৫ মে, ২০২৩", activity: "মার্কেটিং বেসিক PDF ক্রয় করেছেন", type: "pdf" },
          ].map((item, index) => (
            <div key={index} className="flex items-start border-b border-gray-100 pb-3 last:border-0">
              <div
                className={`mt-1 rounded-full p-1 ${
                  item.type === "course" ? "bg-green-100" : item.type === "pdf" ? "bg-blue-100" : "bg-yellow-100"
                }`}
              >
                {item.type === "course" ? (
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                ) : item.type === "pdf" ? (
                  <DocumentTextIcon className="w-4 h-4 text-blue-600" />
                ) : (
                  <BookOpenIcon className="w-4 h-4 text-yellow-600" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{item.activity}</p>
                <p className="text-xs text-gray-500">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard

