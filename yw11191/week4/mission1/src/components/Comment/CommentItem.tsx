import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Pencil, Trash2, Check } from "lucide-react";
import { axiosInstance } from "../../apis/axios";
import { PAGINATION_ORDER } from "../../enums/common";

interface CommentItemProps {
  comment: any;
  currentUserId: number | undefined;
  lpId: number;
  order: PAGINATION_ORDER;
}

export const CommentItem = ({ comment, currentUserId, lpId, order }: CommentItemProps) => {
  const queryClient = useQueryClient();
  
  // 1. 상태 관리 (수정 모드 활성화 여부, 수정 텍스트, ... 메뉴 팝오버 여부)
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthor = comment.author.id === currentUserId; // 본인 댓글 여부 확인

  // 2. 댓글 수정 useMutation
  const updateCommentMutation = useMutation({
    mutationFn: async (newContent: string) => {
      // 서버 라우팅 규칙에 맞게 엔드포인트를 매싱하세요 (주로 아래 두 형태 중 하나입니다)
      const response = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${comment.id}`, {
        content: newContent,
      });
      return response.data;
    },
    onSuccess: () => {
      // 수정 성공 시 댓글 목록 쿼리키 무효화로 즉시 반영
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("댓글 수정 실패:", error);
      alert("댓글 수정 중 에러가 발생했습니다.");
    },
  });

  // 3. 댓글 삭제 useMutation
  const deleteCommentMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete(`/v1/lps/${lpId}/comments/${comment.id}`);
      return response.data;
    },
    onSuccess: () => {
      // 삭제 성공 시 댓글 목록 쿼리키 무효화로 즉시 반영
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
      setIsMenuOpen(false);
    },
    onError: (error) => {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제 중 에러가 발생했습니다.");
    },
  });

  const handleUpdateSubmit = () => {
    if (!editText.trim()) return alert("댓글 내용을 입력해주세요.");
    updateCommentMutation.mutate(editText);
  };

  const handleDeleteSubmit = () => {
    if (window.confirm("정말 이 댓글을 삭제하시겠습니까?")) {
      deleteCommentMutation.mutate();
    }
  };

  return (
    <div className="flex gap-3 py-4 border-b border-neutral-900 group relative">
      {/* 아바타 이미지 구역 */}
      <div className="w-10 h-10 bg-neutral-800 rounded-full flex-shrink-0 overflow-hidden">
        {comment.author.avatar ? (
          <img src={comment.author.avatar} alt="아바타" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-indigo-900/30" />
        )}
      </div>

      {/* 콘텐트 바디 구역 */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold">{comment.author.name}</span>
          <span className="text-[10px] text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* 수정 모드 스위칭 인터페이스 */}
        {isEditing ? (
          <div className="flex items-center gap-3 mt-1 w-full">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1 bg-transparent border border-neutral-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              onKeyDown={(e) => e.key === "Enter" && handleUpdateSubmit()}
            />
            <button
              onClick={handleUpdateSubmit}
              disabled={updateCommentMutation.isPending}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="수정 완료"
            >
              <Check size={20} />
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
        )}
      </div>

      {/* 본인 댓글일 때만 노출되는 ... 메뉴 버튼 및 액션 오버레이 */}
      {isAuthor && !isEditing && (
        <div className="relative flex items-start">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-500 hover:text-white hover:bg-neutral-800 p-1 rounded transition-all"
          >
            <MoreVertical size={18} />
          </button>

          {/* 팝오버 수정/삭제 툴팁 레이아웃 */}
          {isMenuOpen && (
            <div className="absolute right-0 top-7 z-10 flex items-center gap-1 bg-[#121318] border border-neutral-800 rounded-lg p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setIsMenuOpen(false);
                }}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-neutral-800 rounded transition-all"
                title="수정"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={handleDeleteSubmit}
                disabled={deleteCommentMutation.isPending}
                className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-neutral-800 rounded transition-all"
                title="삭제"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};