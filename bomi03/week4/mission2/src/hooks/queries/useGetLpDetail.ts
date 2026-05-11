import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpDetail(lpid: number) {
  return useQuery({
    queryKey: [QUERY_KEY.lp, lpid],
    queryFn: () => getLpDetail(lpid),
    enabled: !!lpid,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useGetLpDetail;
