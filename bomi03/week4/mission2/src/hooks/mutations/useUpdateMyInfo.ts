import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";
import type {
  RequestUpdateMyInfoDto,
  ResponseMyInfoDto,
} from "../../types/auth";

function useUpdateMyInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyInfo,

    onMutate: async (newMyInfo: RequestUpdateMyInfoDto) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.myInfo],
      });

      const previousMyInfo = queryClient.getQueryData<ResponseMyInfoDto>([
        QUERY_KEY.myInfo,
      ]);

      queryClient.setQueryData<ResponseMyInfoDto>(
        [QUERY_KEY.myInfo],
        (oldMyInfo) => {
          if (!oldMyInfo) return oldMyInfo;

          return {
            ...oldMyInfo,
            data: {
              ...oldMyInfo.data,
              name: newMyInfo.name,
              bio: newMyInfo.bio ?? null,
              avatar: newMyInfo.avatar ?? null,
            },
          };
        },
      );

      return { previousMyInfo };
    },

    onError: (_error, _newMyInfo, context) => {
      if (context?.previousMyInfo) {
        queryClient.setQueryData([QUERY_KEY.myInfo], context.previousMyInfo);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.myInfo],
      });
    },
  });
}

export default useUpdateMyInfo;
