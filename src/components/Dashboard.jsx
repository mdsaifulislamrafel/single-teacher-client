import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon, FolderIcon, VideoCameraIcon, CurrencyBangladeshiIcon } from '@heroicons/react/24/outline';

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCategories: 0,
    totalVideos: 0,
    totalPayments: 0
  });

  useEffect(() => {
    // TODO: Fetch dashboard stats from API
    setStats({
      totalUsers: 150,
      totalCategories: 8,
      totalVideos: 96,
      totalPayments: 25000
    });
  }, []);

  const adminMenuItems = [
    {
      title: 'ইউজার ম্যানেজমেন্ট',
      icon: UsersIcon,
      link: '/admin/users',
      stats: stats.totalUsers,
      statLabel: 'মোট ইউজার'
    },
    {
      title: 'ক্যাটাগরি ম্যানেজমেন্ট',
      icon: FolderIcon,
      link: '/admin/categories',
      stats: stats.totalCategories,
      statLabel: 'মোট ক্যাটাগরি'
    },
    {
      title: 'ভিডিও ম্যানেজমেন্ট',
      icon: VideoCameraIcon,
      link: '/admin/videos',
      stats: stats.totalVideos,
      statLabel: 'মোট ভিডিও'
    },
    {
      title: 'পেমেন্ট ম্যানেজমেন্ট',
      icon: CurrencyBangladeshiIcon,
      link: '/admin/payments',
      stats: `৳${stats.totalPayments}`,
      statLabel: 'মোট আয়'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">অ্যাডমিন ড্যাশবোর্ড</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminMenuItems.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <item.icon className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">{item.stats}</span>
            </div>
            <p className="text-sm text-gray-600">{item.statLabel}</p>
          </div>
        ))}
      </div>

      {/* Admin Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminMenuItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <item.icon className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold">{item.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;