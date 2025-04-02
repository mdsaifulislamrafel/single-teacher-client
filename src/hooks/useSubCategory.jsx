import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useSubCategory = () => {
  const axiosSecure = useAxiosPublic();
  const queryClient = useQueryClient();
  
  const {
    data: subcategories,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/subcategories");
      return res.data;
    },
  });

  // Delete mutation with automatic cache update
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/subcategories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["subcategories"]);
    }
  });

  // Update mutation with automatic cache update
  const updateMutation = useMutation({
    mutationFn: (updatedSubcategory) => 
      axiosSecure.put(`/subcategories/${updatedSubcategory._id}`, updatedSubcategory),
    onSuccess: () => {
      queryClient.invalidateQueries(["subcategories"]);
    }
  });

  return { 
    subcategories, 
    loading, 
    refetch,
    deleteMutation,
    updateMutation
  };
};

export default useSubCategory;