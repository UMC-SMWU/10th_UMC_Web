import { useInfiniteQuery } from "@tanstack/react-query";
import { getSearchLps } from "../../apis/lp";

const useGetInfiniteSearchLps = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["search", search],
    queryFn: ({ pageParam }) =>
      getSearchLps({
        search,
        cursor: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.data.nextCursor ?? undefined;
    },
    enabled: search.trim().length > 0,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};

export default useGetInfiniteSearchLps;