import { deleteLike } from '../../apis/lp';
import { useMutation } from '@tanstack/react-query';

function useDeleteLike() {
  return useMutation({
    mutationFn: deleteLike,
  });
}

export default useDeleteLike;
