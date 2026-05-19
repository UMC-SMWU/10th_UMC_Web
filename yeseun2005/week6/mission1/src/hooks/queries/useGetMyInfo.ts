import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/auth";

function useGetMyInfo() {
    return useQuery({
        queryKey: ["myInfo"],
        queryFn: getMyInfo,
    });
}

export default useGetMyInfo;