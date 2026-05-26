import { useState } from "react";
import { useParams } from "react-router-dom";
import { PAGINATION_ORDER } from "../types/common";
import useGetInfiniteLpComments from "../hooks/queries/useGetInfiniteLpComments";
import usePostLpComment from "../hooks/mutations/usePostLpComment";

const CommentSkeleton = () => {
  return (
    <div className="animate-pulse space-y-2 rounded-lg bg-gray-100 p-4">
      <div className="h-4 w-24 rounded bg-gray-300" />
      <div className="h-4 w-full rounded bg-gray-300" />
      <div className="h-4 w-2/3 rounded bg-gray-300" />
    </div>
  );
};

const LpDetailPage = () => {
  const { lpid } = useParams();
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const [comment, setComment] = useState("");

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetInfiniteLpComments(lpid ?? "", order);

  const { mutate: postComment, isPending: isPosting } = usePostLpComment(
    lpid ?? "",
    order
  );

  const comments = data?.pages.flatMap((page) => page.data.data) ?? [];

  const handleToggleOrder = () => {
    setOrder((prev) =>
      prev === PAGINATION_ORDER.desc
        ? PAGINATION_ORDER.asc
        : PAGINATION_ORDER.desc
    );
  };
    console.log("id:", lpid);
  const handleSubmitComment = () => {
    if (!comment.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    postComment(comment, {
      onSuccess: () => {
        setComment("");
      },
      onError: () => {
        alert("댓글 작성에 실패했습니다.");
      },
    });
  };

  return (
    <div className="px-6 py-8">
      {/* 여기에 기존 LP 상세 정보 UI 있으면 넣으면 됨 */}

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">댓글</h2>

          <button
            onClick={handleToggleOrder}
            className="rounded bg-gray-800 px-3 py-2 text-sm text-white"
          >
            {order === PAGINATION_ORDER.desc ? "최신순" : "오래된순"}
          </button>
        </div>

        <div className="mb-2 flex gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="댓글을 입력해주세요"
            className="flex-1 rounded border px-3 py-2"
          />

          <button
            onClick={handleSubmitComment}
            disabled={isPosting}
            className="rounded bg-pink-500 px-4 py-2 text-white disabled:bg-gray-300"
          >
            {isPosting ? "작성 중..." : "작성"}
          </button>
        </div>

        {!comment.trim() && (
          <p className="mb-4 text-sm text-gray-400">
            댓글 내용을 입력한 뒤 작성 버튼을 눌러주세요.
          </p>
        )}

        {isPending && (
          <div className="space-y-3">
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
          </div>
        )}

        {isError && <p>댓글을 불러오지 못했습니다.</p>}

        {!isPending && !isError && comments.length === 0 && (
          <p className="mt-6 text-center text-gray-500">댓글이 없습니다.</p>
        )}

        {!isPending && !isError && comments.length > 0 && (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold">
                    {comment.author?.name ?? "익명"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p>{comment.content}</p>
              </div>
            ))}
          </div>
        )}

        {isFetchingNextPage && (
          <div className="mt-4 space-y-3">
            <CommentSkeleton />
            <CommentSkeleton />
          </div>
        )}

        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="mt-6 w-full rounded bg-gray-200 py-3 disabled:bg-gray-100"
          >
            {isFetchingNextPage ? "불러오는 중..." : "댓글 더보기"}
          </button>
        )}
      </section>
    </div>
  );
};

export default LpDetailPage;