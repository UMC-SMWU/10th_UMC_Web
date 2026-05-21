import { useQuery } from '@tanstack/react-query';
import { getLpDetail } from '../../apis/lp';
import { QUERY_KEY } from '../../constants/key';
import type { RequestLpDto } from '../../types/lp';

function useGetLpDetail({ lpId }: RequestLpDto) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, lpId],
    queryFn: () => getLpDetail({ lpId }),
  });
}

export default useGetLpDetail;
