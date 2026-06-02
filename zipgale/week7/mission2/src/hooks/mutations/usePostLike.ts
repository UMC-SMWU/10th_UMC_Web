import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function usePostLike() {
  return useMutation({
    mutationFn: postLike,
    onSuccess: () => { // 무효화
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps],
        exact: false, // key의 앞부분만 맞아도 처리
      })
    }
  })
}

export default usePostLike;