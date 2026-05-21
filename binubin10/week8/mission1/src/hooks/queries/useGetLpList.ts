// src/hooks/queries/useGetLpList.ts
import { useQuery } from '@tanstack/react-query';
import { getLpList } from '../../apis/lp';

export const useGetLpList = (params: {
  search: string;
  sort: 'desc' | 'asc';
  limit: number;
}) => {
  return useQuery({
    queryKey: ['lps', params.search, params.sort],
    queryFn: () => getLpList(params),
    staleTime: 0,
    gcTime: 0,
  });
};
