import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpComments } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { PAGINATION_ORDER } from "../../enums/common";
import type { ResponseLpCommentListDto } from "../../types/comment";

function useGetInfiniteLpComments({
  lpId,
  limit,
  order,
  enabled = true,
}: {
  lpId: number;
  limit: number;
  order: PAGINATION_ORDER;
  enabled?: boolean;
}) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lpComments, lpId, order],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getLpComments({
        lpId,
        cursor: pageParam,
        limit,
        order,
      }),
    initialPageParam: 0,
    enabled: !!lpId,
    getNextPageParam: (
      lastPage: ResponseLpCommentListDto,
      allPages: ResponseLpCommentListDto[],
    ) => {
      console.log(lastPage, allPages);
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
  });
}

export default useGetInfiniteLpComments;
