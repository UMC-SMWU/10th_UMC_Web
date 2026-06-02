import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/auth";
import { LOCAL_STORAGE_KEY } from "../../constants/key";

function useGetMyInfo() {
    const accessToken = localStorage.getItem(
        LOCAL_STORAGE_KEY.accessToken
    );

    return useQuery({
        queryKey: ["myInfo"],
        queryFn: getMyInfo,
        enabled: !!accessToken,
    });
}

export default useGetMyInfo;