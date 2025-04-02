import { useState } from "react";
import { Link } from "react-router-dom";
import useCategory from "../../../hooks/useCategory";
import Loading from "../../Loading";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { toast } from "sonner";
import SubcategoryManage from "../SubCategoryManage/SubcategoryManage";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

function CategoryManagement() {
  // const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("categories");
  const [category, loading, refetch] = useCategory();
  const axiosSecure = useAxiosPublic();


  if (loading) return <Loading />;
  const handleDelete = async (id) => {
    // TODO: Delete category from API
    const res = await axiosSecure.delete(`/categories/${id}`);
    if (res.status === 200) {
      toast.success(res.data.message, {
        duration: 1000,
      });
      refetch();
    }
  };
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left mb-4 sm:mb-0">
          ক্যাটাগরি ম্যানেজমেন্ট
        </h1>
        <Link
          to={
            activeTab === "categories"
              ? "/admin/create-categories"
              : "/admin/create-subcategories"
          }
        >
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto">
            {activeTab === "categories"
              ? "নতুন ক্যাটাগরি যোগ করুন"
              : "নতুন সাব-ক্যাটাগরি যোগ করুন"}
          </button>
        </Link>
      </div>

      <div className="flex border-b mb-6 overflow-x-auto">
        <button
          className={`px-4 py-2 flex-1 sm:flex-none ${
            activeTab === "categories"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("categories")}
        >
          ক্যাটাগরি
        </button>
        <button
          className={`px-4 py-2 flex-1 sm:flex-none ml-0 sm:ml-4 ${
            activeTab === "subcategories"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("subcategories")}
        >
          সাব-ক্যাটাগরি
        </button>
      </div>

      {activeTab === "categories" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {category?.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  {category.name}
                </h2>
                <div>
                  <Link to={`/admin/update-categories/${category._id}`}>
                    <button className="text-blue-600 text-2xl hover:text-blue-800 mr-3">
                    <FaEdit />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="text-red-600 text-2xl hover:text-red-800"
                  >
                   <MdDelete />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <SubcategoryManage />
      )}
    </div>
  );
}

export default CategoryManagement;
