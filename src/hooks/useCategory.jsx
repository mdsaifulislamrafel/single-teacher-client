import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useCategory = () => {
  const axiosSecure = useAxiosPublic();
  const {
    data: category,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const res = await axiosSecure.get("/categories");
      return res.data;
    },
  });
  return [category, loading, refetch];
};

export default useCategory;
