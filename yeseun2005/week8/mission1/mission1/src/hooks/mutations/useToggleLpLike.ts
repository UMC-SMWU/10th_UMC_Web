import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLikeLp, deleteLikeLp } from "../../apis/lp";

interface ToggleLikeParams {
  isLiked: boolean;
  userId: number;
}

const useToggleLpLike = (lpId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ isLiked }: ToggleLikeParams) => {
      return isLiked
        ? deleteLikeLp(Number(lpId))
        : postLikeLp(Number(lpId));
    },

    onMutate: async ({ isLiked, userId }) => {
      await queryClient.cancelQueries({
        queryKey: ["lp", lpId],
      });

      const previousLp = queryClient.getQueryData(["lp", lpId]);

      queryClient.setQueryData(["lp", lpId], (old: any) => {
        if (!old) return old;

        const prevLikes = old.data.likes ?? [];

        return {
          ...old,
          data: {
            ...old.data,
            likes: isLiked
              ? prevLikes.filter(
                  (like: any) =>
                    like.userId !== userId 
                )
              : [
                  ...prevLikes,
                  {
                    userId,
                  },
                ],
          },
        };
      });

      return { previousLp };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousLp) {
        queryClient.setQueryData(["lp", lpId], context.previousLp);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["lp", lpId],
      });
    },
  });
};

export default useToggleLpLike;