import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";
import { toast } from "sonner";

const usePDF = () => {
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();

  // ✅ Fetch all PDFs
  const {
    data: pdfs = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pdfs"],
    queryFn: async () => {
      const res = await axiosPublic.get("/pdfs");
      return res.data;
    },
  });

  // ✅ Create PDF Mutation
  const createMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axiosPublic.post("/pdfs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pdfs"]);
      toast.success("✅ PDF created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "❌ Failed to create PDF");
    },
  });

  // ✅ Update PDF Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axiosPublic.put(`/pdfs/${id}`, data);
      return res.data;
    }
  });

  // ✅ Delete PDF Mutation
  const deleteMutation = useMutation({
    mutationFn: async (pdfId) => {
      const res = await axiosPublic.delete(`/pdfs/${pdfId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pdfs"]);
      toast.success("🗑️ PDF deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "❌ Failed to delete PDF");
    },
  });

  return {
    pdfs,
    isLoading,
    isError,
    error,
    refetch,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};

export default usePDF;
