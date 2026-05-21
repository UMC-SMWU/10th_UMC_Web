import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpList } from '../../apis/lp';

export const useGetLpList = (params: {
  search: string;
  sort: 'desc' | 'asc';
}) => {
  return useInfiniteQuery({
    queryKey: ['lps', params.search, params.sort],

    queryFn: ({ pageParam = 1 }) =>
      getLpList({ ...params, page: pageParam, limit: 500 }),

    // enabled: !!params.search.trim(),

    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.data.nextPage;
    },

    staleTime: 1000 * 60 * 5, // 5분 동안은 신선한 데이터로 간주
    gcTime: 1000 * 60 * 10, // 캐시 유지 시간 설정
  });
};
