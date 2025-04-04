"use client"

import { useState, useEffect } from "react"
import { UsersIcon, FolderIcon, VideoCameraIcon, CurrencyBangladeshiIcon } from "@heroicons/react/24/outline"
import useUsers from "../../hooks/useUsers"
import Loading from "../Loading"
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
} from "recharts"

function Dashboard() {
  const [usersAll, loading, refetch] = useUsers()
  const [stats, setStats] = useState({
    totalUsers: usersAll?.length,
    totalCategories: 0,
    totalVideos: 0,
    totalPayments: 0,
  })

  // Sample data for charts
  const [monthlyData, setMonthlyData] = useState([
    { name: "জানুয়ারি", users: 40, videos: 24, revenue: 4000 },
    { name: "ফেব্রুয়ারি", users: 30, videos: 13, revenue: 3000 },
    { name: "মার্চ", users: 20, videos: 8, revenue: 2000 },
    { name: "এপ্রিল", users: 27, videos: 10, revenue: 2780 },
    { name: "মে", users: 18, videos: 5, revenue: 1890 },
    { name: "জুন", users: 23, videos: 9, revenue: 2390 },
    { name: "জুলাই", users: 34, videos: 12, revenue: 3490 },
    { name: "আগস্ট", users: 45, videos: 18, revenue: 4300 },
    { name: "সেপ্টেম্বর", users: 65, videos: 29, revenue: 6500 },
    { name: "অক্টোবর", users: 78, videos: 35, revenue: 7800 },
    { name: "নভেম্বর", users: 88, videos: 42, revenue: 8800 },
    { name: "ডিসেম্বর", users: 107, videos: 55, revenue: 10700 },
  ])

  // Category data for bar chart
  const [categoryData, setCategoryData] = useState([
    { name: "প্রোগ্রামিং", videos: 40, users: 120 },
    { name: "ডিজাইন", videos: 30, users: 80 },
    { name: "মার্কেটিং", videos: 20, users: 60 },
    { name: "ব্যবসা", videos: 27, users: 90 },
    { name: "ভাষা", videos: 18, users: 50 },
    { name: "পরীক্ষা প্রস্তুতি", videos: 23, users: 70 },
  ])

  useEffect(() => {
    refetch() // শুধুমাত্র কম্পোনেন্ট লোড হলে ফেচ হবে
  }, [refetch])

  if (loading) <Loading />
  useEffect(() => {
    // TODO: Fetch dashboard stats from API
    setStats({
      totalUsers: usersAll?.length,
      totalCategories: 8,
      totalVideos: 96,
      totalPayments: 25000,
    })
  }, [usersAll?.length])

  const statItems = [
    {
      title: "মোট ইউজার",
      icon: UsersIcon,
      value: stats.totalUsers,
    },
    {
      title: "মোট ক্যাটাগরি",
      icon: FolderIcon,
      value: stats.totalCategories,
    },
    {
      title: "মোট ভিডিও",
      icon: VideoCameraIcon,
      value: stats.totalVideos,
    },
    {
      title: "মোট আয়",
      icon: CurrencyBangladeshiIcon,
      value: `৳${stats.totalPayments}`,
    },
  ]

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">ড্যাশবোর্ড</h1>

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
        {/* Monthly Growth Chart */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">মাসিক বৃদ্ধি</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  name="ইউজার"
                  stroke="#3b82f6"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line type="monotone" dataKey="videos" name="ভিডিও" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" name="আয় (৳)" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">ক্যাটাগরি অনুযায়ী বিতরণ</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="videos" name="ভিডিও" fill="#3b82f6" />
                <Bar dataKey="users" name="ইউজার" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Chart - Revenue Trend */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">বার্ষিক আয়ের প্রবণতা</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`৳${value}`, "আয়"]} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                name="আয় (৳)"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

