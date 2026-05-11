import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "../apis/todos";

export const TodoList = () => {
  const { data, isPending, isError, error, isFetching, refetch } = useQuery({
    queryKey: ["todos"], // 데이터의 캐시 주소 정함
    queryFn: fetchTodos, // 비동기 패칭 함수 등록
    staleTime: 30_000, // 30초 동안은 fresh로 간주(불필요한 네트워크 감소)
    gcTime: 5 * 60 * 1000, // 5분 후 사용되지 않는 캐시 정리(메모리 관리)
    retry: 1, // 실패 시 재시도 횟수(기본 3에서 낮추기 등)
    refetchOnWindowFocus: true, // 포커스 복귀 시 최신화(팀 정책에 따라 on/off)
    // select: (raw) => raw.filter(t => !t.completed), // 필요한 형태로 데이터 가공
    // placeholderData: [],       // 첫 페치 이전에 잠깐 보여줄 값(깜빡임 완화)
  });

  if (isPending) return <div>Loading...</div>; // 초기 로딩 시 로딩 문구(스피너/스켈레톤) 보여주고

  if (isError) return <div>Error: {error.message}</div>; // 실패하면 error.message를 노출

  return (
    <div>
      <ul>
        {data?.map(
          (
            t, // 성공하면 data를 그림
          ) => (
            <li key={t.id}>
              <label>
                <input type="checkbox" checked={t.completed} readOnly />{" "}
                {t.title}
              </label>
            </li>
          ),
        )}
      </ul>
      <button disabled={isFetching} onClick={() => refetch()}>
        {isFetching ? "새로고침 중..." : "목록 새로고침"}
      </button>
    </div>
  );
};
