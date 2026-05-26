import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpCommentList } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";
import { PAGINATION_ORDER } from "../../types/common";

function useGetInfiniteLpComments(lpId: string, order: PAGINATION_ORDER) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lpComments, lpId, order],
    queryFn: ({ pageParam = 0 }) =>
      getLpCommentList({
        lpId,
        cursor: pageParam,
        order,
        limit: 10,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
    enabled: Boolean(lpId),
  });
}

export default useGetInfiniteLpComments;