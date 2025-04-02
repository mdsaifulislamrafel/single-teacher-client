import { Link } from 'react-router-dom';

function HomePage() {
  const categories = [
    { id: 1, name: 'বাংলা', description: 'বাংলা ভাষা ও সাহিত্য শিখুন' },
    { id: 2, name: 'ইংরেজি', description: 'ইংরেজি ভাষা ও গ্রামার শিখুন' },
    { id: 3, name: 'গণিত', description: 'গণিত ও পাটিগণিত শিখুন' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          আপনার শিক্ষার যাত্রা শুরু করুন
        </h1>
        <p className="text-xl text-gray-600">
          সহজ ও আকর্ষণীয় উপায়ে শিখুন, যেকোনো সময়, যেকোনো জায়গা থেকে
        </p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">{category.name}</h2>
            <p className="text-gray-600">{category.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-16 bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          আমাদের বৈশিষ্ট্যসমূহ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">ইন্টারেক্টিভ শিক্ষা</h3>
            <p className="text-gray-600">আকর্ষণীয় ভিডিও ও কুইজের মাধ্যমে শিখুন</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">নিজের গতিতে শিখুন</h3>
            <p className="text-gray-600">যেকোনো সময় যেকোনো জায়গা থেকে অধ্যয়ন করুন</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">সার্টিফিকেট</h3>
            <p className="text-gray-600">কোর্স শেষে সার্টিফিকেট অর্জন করুন</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;