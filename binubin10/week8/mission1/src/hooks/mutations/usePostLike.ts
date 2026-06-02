import { useMutation } from '@tanstack/react-query';
import { postLike } from '../../apis/lp';
import { QUERY_KEY } from '../../constants/key';
import { queryClient } from '../../App';

function usePostLike() {
  return useMutation({
    mutationFn: postLike,
    // data -> API 성공 응답데이터
    // variable -> mutate에 전달한 값
    // context -> onMutate에서 반환한 값
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, data.data.lpId],
        exact: true,
      });
    },
    // error -> 요청 실패시 발생한 에러
    // variable -> mutate에 전달한 값
    // context -> onMutate에서 반환한 값
    onError: (error, variable, context) => {},
    onMutate: (variables) => {
      return 'hello';
    },
  });
}

export default usePostLike;
