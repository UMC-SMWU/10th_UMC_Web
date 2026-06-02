import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpList } from '../../apis/lp';

export const useGetLpList = (params: {
  search: string;
  sort: 'desc' | 'asc';
  limit?: number;
}) => {
  return useInfiniteQuery({
    queryKey: ['lps', params.search, params.sort, params.limit],

    queryFn: ({ pageParam = 0 }) =>
      getLpList({ ...params, page: pageParam, limit: params.limit || 10 }),

    // enabled: !!params.search.trim(),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      const { hasNext } = lastPage.data;

      if (!hasNext) return undefined;

      const nextCursor = allPages.length * (params.limit || 10);

      console.log('🚀 다음 요청할 커서 번호:', nextCursor);
      return nextCursor;
    },

    staleTime: 1000 * 60 * 5, // 5분 동안은 신선한 데이터로 간주
    gcTime: 1000 * 60 * 10, // 캐시 유지 시간 설정
  });
};
