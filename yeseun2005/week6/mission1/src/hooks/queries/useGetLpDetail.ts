import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";

function useGetLpDetail(lpId: string | undefined) {
    return useQuery({
        queryKey: ["lp", lpId],
        queryFn: () => getLpDetail(lpId!),
        enabled: Boolean(lpId),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}

export default useGetLpDetail;