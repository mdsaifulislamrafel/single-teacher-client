import { useState } from "react";
import { toast } from "sonner";
import useSubCategory from "../../../hooks/useSubCategory";
import EditSubcategoryModal from "./EditSubcategoryModal";
import Loading from "../../Loading";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

function SubcategoryManage() {
  const { subcategories, loading, deleteMutation, updateMutation } =
    useSubCategory();

  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Subcategory deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete subcategory");
      },
    });
  };

  const handleEdit = (subcategory) => {
    setEditingSubcategory(subcategory);
    setIsModalOpen(true);
  };

  const handleUpdate = (updatedData) => {
    updateMutation.mutate(updatedData, {
      onSuccess: () => {
        toast.success("Subcategory updated successfully");
        setIsModalOpen(false);
      },
      onError: (error) => {
        const errorMessage =
          error.response?.data?.message || "Failed to update subcategory";
        toast.error(errorMessage);
      },
    });
  };

  if (loading) return <Loading />;

  return (
    <div>
      {subcategories?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">কোনো সাব-ক্যাটাগরি পাওয়া যায়নি</p>
          <Link to="/admin/create-subcategories">
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              সাব-ক্যাটাগরি যোগ করুন
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {subcategories?.map((sub) => (
            <div key={sub._id} className="bg-white rounded-lg shadow-md p-6">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold">
                  Category: {sub.category?.name}
                </h2>
                <br />
                <h2 className="text-sm sm:text-md font-semibold">
                  Subcategory: {sub.name}
                </h2>
                <p className="text-gray-600 mt-2">Description: {sub.description}</p>
                <div className="mt-4">
                  <button
                    onClick={() => handleEdit(sub)}
                    className="text-blue-600 text-2xl hover:text-blue-800 mr-3"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(sub._id)}
                    className="text-red-600 text-2xl hover:text-red-800"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <EditSubcategoryModal
          subcategory={editingSubcategory}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdate}
          isUpdating={updateMutation.isLoading}
        />
      )}
    </div>
  );
}

export default SubcategoryManage;