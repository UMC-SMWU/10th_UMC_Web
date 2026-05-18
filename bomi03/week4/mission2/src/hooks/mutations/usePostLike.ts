import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { LpDetail } from "../../types/lp";
import type { ResponseMyInfoDto } from "../../types/auth";

function usePostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLike,

    onMutate: async (lpId: number) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lp, lpId],
      });

      const previousLp = queryClient.getQueryData<LpDetail>([
        QUERY_KEY.lp,
        lpId,
      ]);

      const myInfo = queryClient.getQueryData<ResponseMyInfoDto>([
        QUERY_KEY.myInfo,
      ]);

      const myId = myInfo?.data.id;

      queryClient.setQueryData<LpDetail>([QUERY_KEY.lp, lpId], (oldLp) => {
        if (!oldLp || !myId) return oldLp;

        const alreadyLiked = oldLp.likes.some((like) => like.userId === myId);

        if (alreadyLiked) return oldLp;

        return {
          ...oldLp,
          likes: [
            ...oldLp.likes,
            {
              id: Date.now(),
              userId: myId,
              lpId,
            },
          ],
        };
      });

      return { previousLp };
    },

    onError: (_error, lpId, context) => {
      if (context?.previousLp) {
        queryClient.setQueryData([QUERY_KEY.lp, lpId], context.previousLp);
      }
    },

    onSettled: (_data, _error, lpId) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lp, lpId],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps],
      });
    },
  });
}

export default usePostLike;
