import { useInfiniteQuery } from "@tanstack/react-query";
import type { PAGINATION_ORDER } from "../../enums/common";
import { axiosInstance } from "../../apis/axios";

export const useGetInfiniteComments = (lpId: number, order: PAGINATION_ORDER) => {
  return useInfiniteQuery({
    queryKey: ['lpComments', lpId, order],
    queryFn: async ({ pageParam = null }) => { 
      const response = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
        params: {
          cursor: pageParam, 
          take: 10,
          order: order,
        },
      });
      return response.data;
    },
    initialPageParam: null, 
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
    enabled: !isNaN(lpId),
  });
};