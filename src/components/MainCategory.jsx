import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loading from './Loading';

function MainCategory() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    // TODO: Fetch category and subcategories from API
    setCategory({ id: categoryId, name: 'বাংলা' });
    setSubCategories([
      { id: 1, name: 'প্রথম অধ্যায়', totalVideos: 12, completedVideos: 5 },
      { id: 2, name: 'দ্বিতীয় অধ্যায়', totalVideos: 10, completedVideos: 0 },
    ]);
  }, [categoryId]);

  if (!category) return <Loading/>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{category.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subCategories.map((subCategory) => (
          <Link
            key={subCategory.id}
            to={`/subcategory/${subCategory.id}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{subCategory.name}</h2>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${(subCategory.completedVideos / subCategory.totalVideos) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-gray-600 mt-2">
                {subCategory.completedVideos}/{subCategory.totalVideos} ভিডিও সম্পন্ন
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MainCategory;