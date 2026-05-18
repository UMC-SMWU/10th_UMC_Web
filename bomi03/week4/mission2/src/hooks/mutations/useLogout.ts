import { useMutation } from "@tanstack/react-query";

function useLogout(logout: () => Promise<void>) {
  return useMutation({
    mutationFn: logout,
  });
}

export default useLogout;
