import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLpComment } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useUpdateLpComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLpComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, variables.lpId],
      });
    },
  });
}

export default useUpdateLpComment;
