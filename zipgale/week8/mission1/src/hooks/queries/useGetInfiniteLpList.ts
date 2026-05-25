import { useInfiniteQuery } from "@tanstack/react-query";
import type { PAGINATION_ORDER } from "../../enums/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseLpListDto } from "../../types/lp";

function useGetInfiniteLpList(
  limit: number,
  search: string,
  order: PAGINATION_ORDER
  ) {
  return useInfiniteQuery({
    queryFn: ({pageParam}) => getLpList({cursor:pageParam, limit, search, order}),
    queryKey: [QUERY_KEY.lps,search,order],
    initialPageParam: 0,
    getNextPageParam: (lastPage : ResponseLpListDto) => {
      //console.log(lastPage, allPages);
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
      // 다음 페이지가 있으면 커서 전달
    }
  },
);
} 

export default useGetInfiniteLpList;