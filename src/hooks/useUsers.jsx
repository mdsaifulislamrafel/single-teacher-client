import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useUsers = () => {
    const axiosSecure = useAxiosPublic();
    const { data: usersAll, isLoading: loading, refetch = [] } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        },
    });

    return [usersAll, loading, refetch];
};

export default useUsers;
