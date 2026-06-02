import { useMutation } from "@tanstack/react-query";
import type { UserSigninInformation } from "../../utils/validate";

function useLogin(login: (values: UserSigninInformation) => Promise<void>) {
  return useMutation({
    mutationFn: login,
  });
}

export default useLogin;
