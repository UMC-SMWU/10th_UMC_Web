import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLpComment } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";
import type { PAGINATION_ORDER } from "../../types/common";

const useUpdateLpComment = (lpId: string, order: PAGINATION_ORDER) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLpComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, lpId, order],
      });
    },
  });
};

export default useUpdateLpComment;