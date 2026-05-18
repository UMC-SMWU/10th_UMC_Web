import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLpComment } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useDeleteLpComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLpComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, variables.lpId],
      });
    },
  });
}

export default useDeleteLpComment;
