import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useCreateLp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLp,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps],
      });
    },
  });
}

export default useCreateLp;
