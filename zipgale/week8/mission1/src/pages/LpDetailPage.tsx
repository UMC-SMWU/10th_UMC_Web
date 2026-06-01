import React from 'react'
import { useParams } from 'react-router-dom'
import useGetLpDetail from '../hooks/queries/useGetLpDetail';
import { Heart } from 'lucide-react';
import useGetMyInfo from '../hooks/queries/useGetMyInfo';
import { useAuth } from '../contexts/AuthContext';
import { deleteLike, postLike } from '../apis/lp';
import usePostLike from '../hooks/mutations/usePostLike';
import useDeleteLike from '../hooks/mutations/useDeleteLike';

const LpDetailPage = () => {
const {lpId} = useParams();
const {accessToken} = useAuth();
const {data:lp, isPending, isError} = useGetLpDetail({lpId: Number(lpId)}) // number로 형변환

  if (isPending && isError){
  }
  const {data:me} = useGetMyInfo(accessToken);
  const isLiked = lp?.data.likes.map((like) => like.userId)
                                .includes(me?.data.id as number); // 내 아이디와 일치하는지를 검사
  // mutate -> 비동기 요청을 실행하고, 콜백 함수를 이용해서 후속 작업 처리함.
  // mutateAsync -> Promise를 반환해서 await 사용 가능. 
  const {mutate:likeMutate} = usePostLike();
  const {mutate:disLikeMutate} = useDeleteLike();
  const handleLikeLp = () => {
    likeMutate({lpId : Number(lpId)});
  };

  const handleDislikeLp = () => {
    disLikeMutate({lpId: Number(lpId)}) 
  }

    

  return (
    <div className='mt-12 text-white'>
      <h1>{lp?.data.title}</h1>
      <img src={lp?.data.thumbnail} alt={lp?.data.title}/>
      <p>{lp?.data.content}</p>
      <button onClick= {isLiked ? handleDislikeLp: handleLikeLp}>
        <Heart color={isLiked ? 'red' : 'white'} fill={isLiked ? 'red' : 'transparent'}/>
      </button>
    </div>
  )
}

export default LpDetailPage