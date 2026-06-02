import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLpComment } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useCreateLpComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLpComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, variables.lpId],
      });
    },
  });
}

export default useCreateLpComment;
