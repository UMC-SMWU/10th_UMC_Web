import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function usePostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLike,
    onSuccess: (_, lpId) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lp, lpId],
      });
    },
  });
}

export default usePostLike;
