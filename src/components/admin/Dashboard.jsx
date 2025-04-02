import { useState, useEffect } from 'react';
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

  const statItems = [
    {
      title: 'মোট ইউজার',
      icon: UsersIcon,
      value: stats.totalUsers,
    },
    {
      title: 'মোট ক্যাটাগরি',
      icon: FolderIcon,
      value: stats.totalCategories,
    },
    {
      title: 'মোট ভিডিও',
      icon: VideoCameraIcon,
      value: stats.totalVideos,
    },
    {
      title: 'মোট আয়',
      icon: CurrencyBangladeshiIcon,
      value: `৳${stats.totalPayments}`,
    }
  ];

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">ড্যাশবোর্ড</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
    </div>
  );
}

export default Dashboard;