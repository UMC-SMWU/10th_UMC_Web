import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "../../apis/auth";

const useDeleteUser = () => {
  return useMutation({
    mutationFn: deleteUser,
  });
};

export default useDeleteUser;