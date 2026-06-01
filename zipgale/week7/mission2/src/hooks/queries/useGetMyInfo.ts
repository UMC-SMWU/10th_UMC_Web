import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { getMyInfo } from "../../apis/auth";

function useGetMyInfo(accessToken: string | null) {
  return useQuery(
    {
      queryKey: [QUERY_KEY.myInfo],
      queryFn: getMyInfo,
      enabled: !!accessToken // string -> boolean type으로 변환
    }
  )
}

export default useGetMyInfo;