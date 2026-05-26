import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateMyInfo,
  type UpdateMyInfoRequest,
} from "../../apis/auth";

const useUpdateMyInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateMyInfoRequest) => updateMyInfo(body),

    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: ["myInfo"],
      });

      const previousMyInfo = queryClient.getQueryData(["myInfo"]);

      queryClient.setQueryData(["myInfo"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            name: newData.name,
            bio: newData.bio,
            avatar: newData.avatar,
          },
        };
      });

      return { previousMyInfo };
    },

    onError: (_error, _newData, context) => {
      if (context?.previousMyInfo) {
        queryClient.setQueryData(
          ["myInfo"],
          context.previousMyInfo
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["myInfo"],
      });
    },
  });
};

export default useUpdateMyInfo;