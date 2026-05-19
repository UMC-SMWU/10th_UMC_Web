import {useQuery} from "@tanstack/react-query"
import type {PaginationDto} from "../../types/common.ts"
import { getLpList } from "../../apis/lp.ts"
import { QUERY_KEY } from "../../constants/key.ts";
import type { ResponseLpListDto } from "../../types/lp.ts";

const intialLpListData: ResponseLpListDto = {
    status: true,
    statusCode: 200,
    message: "",
    data: {
        data: [],
    },
    nextCursor: 0,
    hasNext: false,
};

function useGetLpList({cursor, search, order, limit}: PaginationDto) {
    return useQuery({
        queryKey:[QUERY_KEY.lps, search, order],
        queryFn: () =>
            getLpList({
                cursor,
                search,
                order,
                limit,
            }),
            // 데이터가 신선하다고 간주하는 시간
            staleTime: 1000*60*5, // 5분

            // 사용되지 않는 (비활성 상태) 쿼리 데이터가 캐시에 남아있는 시간
            // 예) 10분 동안 사용되지 않으면 해당 캐시 데이터가 삭제되어 다시 요청시 새 데이터를 받아오게 함
            gcTime: 100*60*10, // 10분
            // 조건에 따라 쿼리 실행 여부 제어
            // enabled: Boolean(search),
            // refetchInterval: 100*60,

            // retry: 쿼리 요청이 실패했을 때 자동으로 재시도할 횟수 지정
            // 기본값은 3회 정도, 네트워크 오류 등 임시적인 문제 보완 가능

            // initialData: 쿼리 실행 전 미리 제공할 초기 데이터 설정
            // 컴포넌트가 렌더링 될 때 빈 데이터 구조를 미리 제공해서 로딩 전에도 안전하게 UI를 구성할 수 있게 해줌
            // initialData: intialLpListData,
    });
}

export default useGetLpList;