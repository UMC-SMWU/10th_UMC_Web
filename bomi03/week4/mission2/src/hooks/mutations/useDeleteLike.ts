import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useDeleteLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLike,
    onSuccess: (_, lpId) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lp, lpId],
      });
    },
  });
}

export default useDeleteLike;
