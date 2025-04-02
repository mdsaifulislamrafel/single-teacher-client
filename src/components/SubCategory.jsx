import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircleIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import Loading from './Loading';

function SubCategory() {
  const { subCategoryId } = useParams();
  const [videos, setVideos] = useState([]);
  const [subCategory, setSubCategory] = useState(null);

  useEffect(() => {
    // TODO: Fetch subcategory and videos from API
    setSubCategory({ id: subCategoryId, name: 'প্রথম অধ্যায়' });
    setVideos([
      { id: 1, title: 'ভিডিও ১', duration: '10:00', completed: true, locked: false },
      { id: 2, title: 'ভিডিও ২', duration: '12:00', completed: true, locked: false },
      { id: 3, title: 'ভিডিও ৩', duration: '15:00', completed: false, locked: false },
      { id: 4, title: 'ভিডিও ৪', duration: '8:00', completed: false, locked: true },
    ]);
  }, [subCategoryId]);

  if (!subCategory) return <Loading/>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{subCategory.name}</h1>
      <div className="space-y-4">
        {videos.map((video) => (
          <Link
            key={video.id}
            to={video.locked ? '#' : `/video/${video.id}`}
            className={`block bg-white rounded-lg shadow-md p-4 ${
              video.locked ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {video.completed ? (
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                ) : video.locked ? (
                  <LockClosedIcon className="w-6 h-6 text-gray-500" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                )}
                <h2 className="text-lg font-medium">{video.title}</h2>
              </div>
              <span className="text-gray-600">{video.duration}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SubCategory;