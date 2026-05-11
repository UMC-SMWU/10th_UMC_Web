import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { PAGINATION_ORDER } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseLpListDto } from "../../types/lp";

function useGetInfiniteLpList({
  limit,
  search,
  order,
}: {
  limit: number;
  search: string;
  order: PAGINATION_ORDER;
}) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getLpList({
        cursor: pageParam,
        limit,
        search,
        order,
      }),
    queryKey: [QUERY_KEY.lps, search, order],
    initialPageParam: 0,
    getNextPageParam: (
      lastPage: ResponseLpListDto,
      allPages: ResponseLpListDto[],
    ) => {
      console.log(lastPage, allPages);
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
  });
}

export default useGetInfiniteLpList;
