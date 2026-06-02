import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function useDeleteLike() {
  return useMutation({
    mutationFn: deleteLike,
    onSuccess: (data: ResponseLikeLpDto) => { // 무효화
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, data.data.lpId],
        exact: true
      })
    }
  })
}

export default useDeleteLike;