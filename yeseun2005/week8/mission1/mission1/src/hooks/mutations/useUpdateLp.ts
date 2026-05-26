import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

const useUpdateLp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLp,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps],
      });
    },
  });
};

export default useUpdateLp;