import { useNavigate, useParams } from 'react-router-dom';
import useGetLpDetail from '../hooks/queries/UseGetLpDetail';
import { Heart, MessageSquare } from 'lucide-react';
import useGetMyInfo from '../hooks/queries/useGetMyInfo';
import { useAuth } from '../context/AuthContext';
import usePostLike from '../hooks/mutations/usePostLike';
import useDeleteLike from '../hooks/mutations/useDeleteLike';
import { useEffect, useState } from 'react';
import { PAGINATION_ORDER } from '../enums/common';
import { useInView } from 'react-intersection-observer';
import { CommentSkeletonList } from '../components/Comment/CommentSkeleton';
import { useGetInfiniteComments } from '../hooks/queries/useGetInfiniteComments';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../apis/axios';
import { CommentItem } from '../components/Comment/CommentItem';

interface LpDetailData {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  tags?: string[];
  published?: boolean;
}

export const LpDetailPage = () => {
    const {lpId} = useParams();
    const {accessToken} = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Lp 수정 모드 상태 관리
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");

    // LP 상세 조회 Query
    const { data: lpData, isLoading } = useQuery<LpDetailData>({
      queryKey: ["lpDetail", lpId],
      queryFn: async () => {
        const response = await axiosInstance.get(`/v1/lps/${lpId}`);
        return response.data.data;
      },
    });

    // 2. LP 정보 업데이트 Mutation
    const updateLpMutation = useMutation({
      mutationFn: async (updatedFields: Partial<LpDetailData>) => {
        const response = await axiosInstance.patch(`/v1/lps/${lpId}`, updatedFields);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["lpDetail", lpId] });
        setIsEditing(false);
        alert("LP 정보가 성공적으로 수정되었습니다.");
      },
      onError: (error) => {
        console.error("LP 수정 실패", error);
        alert("수정 중 오류가 발생했습니다.");
      },
    });

    // 3. LP 삭제 Mutation
    const deleteLpMutation = useMutation({
      mutationFn: async () => {
        const response = await axiosInstance.delete(`/v1/lps/${lpId}`);
        return response.data;
      },
      onSuccess: () => {
        alert("요청이 성공했습니다. (LP 삭제 완료)");
        navigate("/"); // 삭제 후 홈 화면 리다이렉션
      },
      onError: (error) => {
        console.error("LP 삭제 실패", error);
        alert("삭제 중 오류가 발생했습니다.");
      },
    });

    // 수정 시작 핸들러
    const handleStartEdit = () => {
      if (!lpData) return;
      setEditTitle(lpData.title);
      setEditContent(lpData.content);
      setIsEditing(true);
    };

    // 수정 완료 제출 핸들러
    const handleUpdateSubmit = () => {
      if (!editTitle.trim() || !editContent.trim()) {
        return alert("제목과 소개 내용은 필수 항목입니다.");
      }
      
      updateLpMutation.mutate({
        title: editTitle,
        content: editContent,
        thumbnail: lpData?.thumbnail || "https://example.com/thumbnail.png",
        tags: lpData?.tags || [],
        published: true
      });
    };


    // 댓글 상태 관리 (정렬, 입력)
    const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
    const [commentText, setCommentText] = useState("");

    // 데이터 패칭
    const {data:lp, isPending, isError} = useGetLpDetail({ lpId:Number(lpId) });
    const {data:me} = useGetMyInfo(accessToken);
    const { 
        data: commentPages, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage, 
        isPending: isCommentPending 
      } = useGetInfiniteComments(Number(lpId), order);

    // 무한 스크롤 관찰자
    const { ref, inView } = useInView();
    useEffect(() => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // 댓글 작성 전용 useMutation 정의
    const createCommentMutation = useMutation({
      mutationFn: async (content: string) => {
        const response = await axiosInstance.post(`/v1/lps/${Number(lpId)}/comments`, {
          content: content,
        });
        return response.data;
      },
      onSuccess: () => {
        // 댓글 생성 성공 시 목록 queryKey 무효화 처리
        queryClient.invalidateQueries({ queryKey: ["lpComments", Number(lpId), order] });
        setCommentText(""); // 인풋창 비우기
      },
      onError: (error) => {
        console.error("댓글 작성 실패:", error);
        alert("댓글 등록 중 에러가 발생했습니다.");
      },
    });
    
    const handleCommentSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!commentText.trim()) return;
      createCommentMutation.mutate(commentText);
    };

    // 좋아요 로직
    const {mutate:likeMutate} = usePostLike();
    const {mutate:disLikeMutate} = useDeleteLike();
    const isLiked = lp?.data.likes.some((like)=> like.userId === me?.data.id);

    

    const handleLikeLp = () => {
      likeMutate({lpId:Number(lpId)});
    }

    const handelDisLikeLp = () => {
      disLikeMutate({lpId:Number(lpId)});
    }

    if (isPending) return <div className="p-20">정보를 불러오는 중...</div>;
    if (isError) return <div className="p-20">에러가 발생했습니다.</div>;

    return (
    <div className="max-w-4xl mx-auto mt-12 px-4 pb-20 text-white">
      {isEditing ? (
        <div className="space-y-4 bg-[#1b1c21] border border-neutral-800 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4 text-indigo-400">LP 정보 수정하기</h2>
          
          <div>
            <label className="text-xs text-gray-400 block mb-1">LP 제목</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded-xl text-sm focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">LP 소개 내용</label>
            <textarea
              rows={5}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded-xl text-sm focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-sm font-medium cursor-pointer transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleUpdateSubmit}
              disabled={updateLpMutation.isPending}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold cursor-pointer transition-colors"
            >
              {updateLpMutation.isPending ? "저장 중..." : "수정 완료"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 상단 관리 버튼 세트 (수정/삭제 단추) */}
          <div className="flex justify-end gap-3 mb-4">
            <button
              onClick={handleStartEdit}
              className="text-xs text-gray-400 hover:text-white bg-neutral-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              수정
            </button>
            <button
              onClick={() => {
                if (window.confirm("정말 이 LP 판을 삭제하시겠습니까?")) {
                  deleteLpMutation.mutate();
                }
              }}
              className="text-xs text-gray-500 hover:text-rose-500 bg-neutral-900 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              삭제
            </button>
          </div>

          {/* LP 상단 상세 영역 */}
          <section className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden shadow-2xl border border-neutral-800">
              <img src={lp?.data.thumbnail} alt={lp?.data.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between py-2">
              <div>
                <h1 className="text-4xl font-bold mb-4">{lp?.data.title}</h1>
                <p className="text-gray-400 leading-relaxed mb-6">{lp?.data.content}</p>
              </div>
              <button 
                onClick={() => isLiked ? disLikeMutate({ lpId: Number(lpId) }) : likeMutate({ lpId: Number(lpId) })}
                className="flex items-center gap-2 px-6 py-3 bg-neutral-800 rounded-full w-fit hover:bg-neutral-700 transition-colors"
              >
                <Heart color={isLiked ? "#f43f5e" : "white"} fill={isLiked ? "#f43f5e" : "transparent"} />
                <span className={isLiked ? "text-rose-500 font-bold" : "text-white"}>
                  좋아요 {lp?.data.likes?.length || 0}개
                </span>
              </button>
            </div>
          </section>

          <hr className="border-neutral-800 mb-10" />

          {/* 댓글 섹션 */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MessageSquare size={20} />
                <h2 className="text-xl font-semibold">댓글</h2>
              </div>
              
              <div className="flex bg-neutral-900 p-1 rounded-lg">
                <button 
                  onClick={() => setOrder(PAGINATION_ORDER.asc)}
                  className={`px-4 py-1.5 text-xs rounded-md transition-all ${order === PAGINATION_ORDER.asc ? 'bg-neutral-700 text-white shadow-md' : 'text-gray-500'}`}
                >
                  오래된순
                </button>
                <button 
                  onClick={() => setOrder(PAGINATION_ORDER.desc)}
                  className={`px-4 py-1.5 text-xs rounded-md transition-all ${order === PAGINATION_ORDER.desc ? 'bg-neutral-700 text-white shadow-md' : 'text-gray-500'}`}
                >
                  최신순
                </button>
              </div>
            </div>

            {/* 댓글 작성 폼 */}
            <form onSubmit={handleCommentSubmit} className="bg-[#1b1c21] border border-neutral-800 rounded-xl p-4 mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden">
                  {me?.data.avatar ? (
                    <img src={me.data.avatar} alt="내 프로필" className="w-full h-full object-cover" />
                  ) : (
                    me?.data.name?.charAt(0) || "U"
                  )}
                </div>
                <span className="text-sm font-medium">{me?.data.name || "로그인이 필요합니다"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <textarea 
                  value={commentText}
                  onChange={(e) => setEditContent ? setCommentText(e.target.value) : undefined}
                  placeholder="댓글을 입력해주세요..."
                  className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none focus:outline-none"
                  rows={2}
                />
                <button 
                  type="submit"
                  disabled={!commentText.trim() || createCommentMutation.isPending}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-700 px-5 py-1.5 rounded-lg text-sm font-semibold transition-colors self-end"
                >
                  작성
                </button>
              </div>
            </form>

            {/* 댓글 리스트 출력부 */}
            <div className="space-y-2">
              {isCommentPending && <CommentSkeletonList count={5} />}

              {commentPages?.pages.map((page) => 
                page.data.data.map((comment: any) => (
                  <CommentItem 
                    key={comment.id} 
                    comment={comment} 
                    currentUserId={me?.data.id} 
                    lpId={Number(lpId)}
                    order={order}
                  />
                ))
              )}

              {isFetchingNextPage && <CommentSkeletonList count={3} />}
              <div ref={ref} className="h-10" />
            </div>
          </section>
        </>
      )}
    </div>
  );
};