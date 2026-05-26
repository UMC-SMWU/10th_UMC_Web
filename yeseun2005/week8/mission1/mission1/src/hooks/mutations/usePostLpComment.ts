import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLpComment } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";
import { PAGINATION_ORDER } from "../../types/common";

function usePostLpComment(lpId: string, order: PAGINATION_ORDER) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      postLpComment({
        lpId,
        content,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, lpId, order],
      });
    },
  });
}

export default usePostLpComment;