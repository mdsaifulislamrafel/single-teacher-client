import { useState, useEffect } from 'react';
import { VideoCameraIcon } from '@heroicons/react/24/outline';

function VideoManagement() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // TODO: Fetch videos from API
    setVideos([
      { 
        id: 1, 
        title: 'বাংলা ভাষার ইতিহাস', 
        category: 'বাংলা',
        subcategory: 'প্রথম অধ্যায়',
        duration: '10:30',
        views: 150
      },
      { 
        id: 2, 
        title: 'ব্যাকরণ পরিচিতি', 
        category: 'বাংলা',
        subcategory: 'দ্বিতীয় অধ্যায়',
        duration: '15:45',
        views: 120
      },
    ]);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ভিডিও ম্যানেজমেন্ট</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          নতুন ভিডিও আপলোড করুন
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-100 p-4 flex items-center justify-center">
              <VideoCameraIcon className="w-16 h-16 text-gray-400" />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{video.title}</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p>ক্যাটাগরি: {video.category}</p>
                <p>সাব-ক্যাটাগরি: {video.subcategory}</p>
                <p>সময়: {video.duration}</p>
                <p>ভিউ: {video.views}</p>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button className="text-blue-600 hover:text-blue-800">এডিট</button>
                <button className="text-red-600 hover:text-red-800">ডিলিট</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoManagement;