import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PAGINATION_ORDER } from "../types/common";
import useGetInfiniteLpComments from "../hooks/queries/useGetInfiniteLpComments";
import usePostLpComment from "../hooks/mutations/usePostLpComment";
import useUpdateLpComment from "../hooks/mutations/useUpdateLpComment";
import useDeleteLpComment from "../hooks/mutations/useDeleteLpComment";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useUpdateLp from "../hooks/mutations/useUpdateLp";
import useDeleteLp from "../hooks/mutations/useDeleteLp";

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
  const navigate = useNavigate();

  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const [comment, setComment] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const { data: myInfo } = useGetMyInfo();
  const { data: lpDetail, isPending: isLpPending, isError: isLpError } =
    useGetLpDetail(lpid);

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

  const { mutate: updateComment, isPending: isUpdating } = useUpdateLpComment(
    lpid ?? "",
    order
  );

  const { mutate: deleteComment, isPending: isDeleting } = useDeleteLpComment(
    lpid ?? "",
    order
  );

  const { mutate: updateLpMutate, isPending: isUpdatingLp } = useUpdateLp();
  const { mutate: deleteLpMutate, isPending: isDeletingLp } = useDeleteLp();

  const comments = data?.pages.flatMap((page) => page.data.data) ?? [];

  const handleToggleOrder = () => {
    setOrder((prev) =>
      prev === PAGINATION_ORDER.desc
        ? PAGINATION_ORDER.asc
        : PAGINATION_ORDER.desc
    );
  };

  const handleOpenEditModal = () => {
    if (!lpDetail?.data) return;

    setTitle(lpDetail.data.title);
    setContent(lpDetail.data.content);
    setThumbnail(lpDetail.data.thumbnail ?? "");
    setTags(lpDetail.data.tags?.map((tag) => tag.name) ?? []);
    setIsEditModalOpen(true);
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();

    if (!trimmedTag) return;
    if (tags.includes(trimmedTag)) return;

    setTags((prev) => [...prev, trimmedTag]);
    setTagInput("");
  };

  const handleDeleteTag = (targetTag: string) => {
    setTags((prev) => prev.filter((tag) => tag !== targetTag));
  };

  const handleUpdateLp = () => {
    if (!lpid) return;

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    updateLpMutate(
      {
        lpId: lpid,
        title,
        content,
        thumbnail,
        tags,
        published: true,
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          alert("LP가 수정되었습니다.");
        },
        onError: () => {
          alert("LP 수정에 실패했습니다.");
        },
      }
    );
  };

  const handleDeleteLp = () => {
    if (!lpid) return;
    if (!confirm("정말 LP를 삭제하시겠습니까?")) return;

    deleteLpMutate(lpid, {
      onSuccess: () => {
        alert("LP가 삭제되었습니다.");
        navigate("/");
      },
      onError: () => {
        alert("LP 삭제에 실패했습니다.");
      },
    });
  };

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

  const handleStartEdit = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditContent(content);
    setOpenMenuId(null);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleUpdateComment = (commentId: number) => {
    if (!editContent.trim()) {
      alert("수정할 내용을 입력해주세요.");
      return;
    }

    updateComment(
      {
        lpId: lpid ?? "",
        commentId,
        content: editContent,
      },
      {
        onSuccess: () => {
          setEditingCommentId(null);
          setEditContent("");
        },
        onError: () => {
          alert("댓글 수정에 실패했습니다.");
        },
      }
    );
  };

  const handleDeleteComment = (commentId: number) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    deleteComment(
      {
        lpId: lpid ?? "",
        commentId,
      },
      {
        onSuccess: () => {
          setOpenMenuId(null);
        },
        onError: () => {
          alert("댓글 삭제에 실패했습니다.");
        },
      }
    );
  };

  if (isLpPending) {
    return <div className="px-6 py-8">LP 정보를 불러오는 중...</div>;
  }

  if (isLpError) {
    return <div className="px-6 py-8">LP 정보를 불러오지 못했습니다.</div>;
  }

  return (
    <div className="px-6 py-8">
      <section className="mx-auto max-w-3xl rounded-xl border p-6 shadow">
        <img
          src={lpDetail?.data?.thumbnail || "https://placehold.co/400x400"}
          alt={lpDetail?.data?.title}
          className="mx-auto mb-6 h-72 w-72 rounded-lg object-cover"
        />

        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{lpDetail?.data?.title}</h1>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleOpenEditModal}
              className="rounded bg-gray-800 px-4 py-2 text-white"
            >
              수정
            </button>

            <button
              type="button"
              onClick={handleDeleteLp}
              disabled={isDeletingLp}
              className="rounded bg-red-500 px-4 py-2 text-white disabled:bg-gray-300"
            >
              {isDeletingLp ? "삭제 중..." : "삭제"}
            </button>
          </div>
        </div>

        <p className="mb-4 text-gray-700">{lpDetail?.data?.content}</p>

        <div className="flex flex-wrap gap-2">
          {lpDetail?.data?.tags?.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-gray-200 px-3 py-1 text-sm"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-3xl">
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
            {comments.map((comment) => {
              const isMyComment = comment.author?.id === myInfo?.data?.id;

              return (
                <div key={comment.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold">
                      {comment.author?.name ?? "익명"}
                    </span>

                    <div className="relative flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>

                      {isMyComment && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId((prev) =>
                                prev === comment.id ? null : comment.id
                              )
                            }
                            className="rounded px-2 py-1 text-lg hover:bg-gray-100"
                          >
                            …
                          </button>

                          {openMenuId === comment.id && (
                            <div className="absolute right-0 top-8 z-10 w-24 rounded border bg-white shadow">
                              <button
                                type="button"
                                onClick={() =>
                                  handleStartEdit(comment.id, comment.content)
                                }
                                className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                              >
                                수정
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteComment(comment.id)
                                }
                                disabled={isDeleting}
                                className="block w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-gray-100 disabled:text-gray-300"
                              >
                                삭제
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {editingCommentId === comment.id ? (
                    <div className="flex gap-2">
                      <input
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="flex-1 rounded border px-3 py-2"
                      />

                      <button
                        type="button"
                        onClick={() => handleUpdateComment(comment.id)}
                        disabled={isUpdating}
                        className="rounded bg-pink-500 px-3 py-2 text-white disabled:bg-gray-300"
                      >
                        저장
                      </button>

                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="rounded bg-gray-200 px-3 py-2"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <p>{comment.content}</p>
                  )}
                </div>
              );
            })}
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

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[420px] rounded-xl bg-white p-6 text-black shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">LP 수정</h2>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="LP 제목"
                className="rounded border px-3 py-2"
              />

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="LP 내용"
                className="h-24 resize-none rounded border px-3 py-2"
              />

              <input
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="썸네일 URL"
                className="rounded border px-3 py-2"
              />

              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="태그 입력"
                  className="flex-1 rounded border px-3 py-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={handleAddTag}
                  className="rounded bg-gray-800 px-4 py-2 text-white"
                >
                  추가
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleDeleteTag(tag)}
                      className="font-bold"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={handleUpdateLp}
                disabled={isUpdatingLp}
                className="mt-3 rounded bg-pink-500 px-4 py-2 text-white disabled:bg-gray-300"
              >
                {isUpdatingLp ? "수정 중..." : "수정 완료"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LpDetailPage;