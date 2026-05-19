import { useQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import type { PaginationDto } from "../../types/common";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseLpListDto } from "../../types/lp";

const initialLpListData:ResponseLpListDto = {
    status:true,
    statusCode:200,
    message:"",
    data:{
        data:[]
    },
    nextCursor:0,
    hasNext:false,
}

function useGetLpList({cursor, search, order, limit}: PaginationDto) {
    return useQuery({
        queryKey: [QUERY_KEY.lps, search],
        queryFn: () => 
            getLpList({cursor, search, order, limit}),

        // 데이터가 신선하다고 간주되는 시간
        // 이 시간동안은 캐시도니 데이터를 그대로 사용, 컴포넌트가 마운트 되거나 창에 포커스 들어오는경우도 재요청x
        // 5분 동안 기존 데이터를 그대로 활용해 네트워크 요청을 줄인다.
        staleTime: 1000 * 60 * 5, // 5m

        // 사용되지 않는 쿼리 데이터가 캐시에 남아있는 시간
        // 이 시간동안은 캐시에서 데이터를 활용, 이 시간동안 재사용되지 않으면 캐시에서 데이터 삭제
        // 트레이드 오프를 고려하자
        gcTime: 1000 * 60 * 10, // 10m

        // enabled:Boolean(search),
        // refetchInterval: 1000 * 60 * 10, // 5m

        // retry:3, // 실패시 재시도 횟수

        // InitialData: 이전에 받아온 데이터가 있다면, 네트워크 요청 없이 해당 데이터를 초기 데이터로 사용
        // initialData: initialLpListData,

        select: (data) => data.data.data,
    });
}

export default useGetLpList;