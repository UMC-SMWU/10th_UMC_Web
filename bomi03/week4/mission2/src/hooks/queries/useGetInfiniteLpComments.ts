import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpComments } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { PAGINATION_ORDER } from "../../enums/common";

type UseGetInfiniteLpCommentsProps = {
  lpId: number;
  limit: number;
  order: PAGINATION_ORDER;
  enabled?: boolean;
};

function useGetInfiniteLpComments({
  lpId,
  limit,
  order,
  enabled = true,
}: UseGetInfiniteLpCommentsProps) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lpComments, lpId, order],
    queryFn: ({ pageParam }) =>
      getLpComments({
        lpId,
        cursor: pageParam,
        limit,
        order,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
    enabled: !!lpId && enabled,
    retry: false,
  });
}

export default useGetInfiniteLpComments;
