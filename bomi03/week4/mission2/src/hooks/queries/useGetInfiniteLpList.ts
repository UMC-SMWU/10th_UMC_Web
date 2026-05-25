import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { PAGINATION_ORDER } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseLpListDto } from "../../types/lp";

function useGetInfiniteLpList({
  limit,
  search,
  order,
  enabled = true,
}: {
  limit: number;
  search: string;
  order: PAGINATION_ORDER;
  enabled?: boolean;
}) {
  const trimmedSearch = search.trim();

  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, trimmedSearch, order],

    queryFn: ({ pageParam }: { pageParam: number }) =>
      getLpList({
        cursor: pageParam,
        limit,
        search: trimmedSearch,
        order,
      }),

    initialPageParam: 0,

    getNextPageParam: (
      lastPage: ResponseLpListDto,
      allPages: ResponseLpListDto[],
    ) => {
      console.log(lastPage, allPages);
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },

    enabled,

    staleTime: 1000 * 60,

    gcTime: 1000 * 60 * 5,
  });
}

export default useGetInfiniteLpList;
