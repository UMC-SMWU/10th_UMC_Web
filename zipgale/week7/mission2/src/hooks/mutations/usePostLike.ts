import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import type { Likes, RequestLpDto, ResponseLikeLpDto } from "../../types/lp";
import type { ResponseMyInfoDto } from "../../types/auth";
import type { ResponseLpDto } from "../../types/lp";
function usePostLike() {
  return useMutation({
    mutationFn: postLike,
    /*
    // data -> API 성공 응답데이터
    // variables -> mutate에 전달한 값
    // context -> onMutate에서 반환한 값
    onSuccess: (data: ResponseLikeLpDto) => { // 무효화
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, data.data.lpId],
        exact: true
      })},
    // error -> 요청 실패 시 반환한 에러
    // variables -> mutate에 전달한 값
    // context -> onMutate에서 반환한 값
    onError: (error, variables,context) => {},
    //요청 직전에 실행되기 직전에 실행되는 함수
    // Optimistic Update 구현에 유용
    onMutate:(variables:RequestLpDto) => {},
    // 요청이 끝난 후 항상 실행됨
    // 로딩 상태를 초기화할 때 유용.
    onSettled: (data) => {} */

    onMutate:async (lp:RequestLpDto) => {
        //1. 이 게시글에 관련된 쿼리를 취소 (캐시된 데이터를 새로 불러오는 요청)
        await queryClient.cancelQueries({
          queryKey:[QUERY_KEY.lps, lp.lpId],
        });
        // 2. 현재 게시글의 데이터를 캐시에서 가져오기
        const previousLpPost = queryClient.getQueryData<ResponseLpDto>([QUERY_KEY.lps,
          lp.lpId]);
    
        // 3. 게시글 데이터를 복사해서 NewLpPost라는 새로운 객체를 만들기
        // 복사하는 가장 큰 이유 -> 오류 시 롤백
        const newLpPost = {...previousLpPost};
    
        // 게시글에 저장된 좋아요 목록에서 현재 내가 눌렀던 좋아요의 위치를 찾기
        const me = queryClient.getQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo]);
        const userId = Number(me?.data.id);
    
        const likedIndex = previousLpPost?.data.likes.findIndex((like) => like.userId === userId
      ) ?? -1;
    
      if(likedIndex >= 0)
        {
          previousLpPost?.data.likes.splice(likedIndex, 1);
        }else {
          const newLike = {userId, lpId:lp.lpId} as Likes;
          previousLpPost?.data.likes.push(newLike);
        }
    
      // 업데이트된 게시글 데이터를 캐시에 저장
      // 이렇게하면 UI가 바로 업데이트 됨. 사용자가 변화를 확인할 수 있다.
      queryClient.setQueryData([QUERY_KEY.lps, lp.lpId], newLpPost);
    
      return {previousLpPost, newLpPost};
      },
    
      onError:(err, newLp, context) => {
        console.log(err,newLp)
        queryClient.setQueryData(
          [QUERY_KEY.lps, newLp.lpId],
          context?.previousLpPost?.data.id,
        );
      },
    
      //onSettled는 API 요청이 끝난 후 성공하든 실패하든 실행
      onSettled: async(data, error, variables, context) => {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.lps, variables.lpId],
        });
      },
  })
}

export default usePostLike;