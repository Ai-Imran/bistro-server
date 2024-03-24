import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";


const useAdmin = () => {
    const { user ,loading} = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: isAdmin, isPending: isAdminLoading } = useQuery({
        queryKey: [user?.email, 'isAdmin'],
        enabled : !loading,
        queryFn: async () => {
            console.log('user admin', user.email);
            const res = await axiosSecure.get(`/users/admin/${user.email}`);
            console.log('is admin', res);
            return res.data?.admin;
        }
        
    })
    // console.log('admin', user)

    return [isAdmin, isAdminLoading]
};

export default useAdmin;