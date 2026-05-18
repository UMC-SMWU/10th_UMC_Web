import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiCheck, FiEdit2, FiImage, FiTrash2, FiX } from "react-icons/fi";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetInfiniteLpComments from "../hooks/queries/useGetInfiniteLpComments";
import { PAGINATION_ORDER } from "../enums/common";
import CommentSkeletonList from "../components/LpComment/CommentSkeletonList";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AuthContext";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import useCreateLpComment from "../hooks/mutations/useCreateLpComment";
import useUpdateLpComment from "../hooks/mutations/useUpdateLpComment";
import useDeleteLpComment from "../hooks/mutations/useDeleteLpComment";
import useUpdateLp from "../hooks/mutations/useUpdateLp";
import useDeleteLp from "../hooks/mutations/useDeleteLp";
import useUploadImages from "../hooks/mutations/useUploadImages";

const LpDetailPage = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const lpIdNumber = Number(lpid);

  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const [newComment, setNewComment] = useState("");

  const [openMenuCommentId, setOpenMenuCommentId] = useState<number | null>(
    null,
  );
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const [isEditingLp, setIsEditingLp] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTagInput, setEditTagInput] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editThumbnail, setEditThumbnail] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { ref, inView } = useInView();

  const { data: lp, isPending, isError, refetch } = useGetLpDetail(lpIdNumber);

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchComments,
  } = useGetInfiniteLpComments({
    lpId: lpIdNumber,
    limit: 10,
    order,
    enabled: !!accessToken,
  });

  const { data: me } = useGetMyInfo(accessToken);

  const postLikeMutation = usePostLike();
  const deleteLikeMutation = useDeleteLike();
  const createCommentMutation = useCreateLpComment();
  const updateCommentMutation = useUpdateLpComment();
  const deleteCommentMutation = useDeleteLpComment();

  const updateLpMutation = useUpdateLp();
  const deleteLpMutation = useDeleteLp();
  const uploadImageMutation = useUploadImages();

  const myId = me?.data?.id;
  const isLiked = lp?.likes?.some((like) => like.userId === myId) ?? false;
  const isLikePending =
    postLikeMutation.isPending || deleteLikeMutation.isPending;

  const isAuthor = !!myId && lp?.authorId === myId;
  const isCommentEmpty = newComment.trim().length === 0;

  const isUpdateLpPending =
    updateLpMutation.isPending || uploadImageMutation.isPending;

  const handleClickLike = () => {
    if (!accessToken) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    if (!lp) return;

    if (isLiked) {
      deleteLikeMutation.mutate(lpIdNumber);
    } else {
      postLikeMutation.mutate(lpIdNumber);
    }
  };

  const handleStartEditLp = () => {
    if (!lp) return;

    setIsEditingLp(true);
    setEditTitle(lp.title);
    setEditContent(lp.content);
    setEditThumbnail(lp.thumbnail);
    setEditPreviewUrl(lp.thumbnail);
    setEditTags(lp.tags?.map((tag) => tag.name) ?? []);
    setEditTagInput("");
    setEditImageFile(null);
  };

  const handleCancelEditLp = () => {
    setIsEditingLp(false);
    setEditTitle("");
    setEditContent("");
    setEditThumbnail("");
    setEditPreviewUrl("");
    setEditTags([]);
    setEditTagInput("");
    setEditImageFile(null);
  };

  const handleChangeEditImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setEditImageFile(file);
    setEditPreviewUrl(URL.createObjectURL(file));
  };

  const handleAddEditTag = () => {
    const nextTag = editTagInput.trim();

    if (!nextTag) return;

    if (editTags.includes(nextTag)) {
      setEditTagInput("");
      return;
    }

    setEditTags((prev) => [...prev, nextTag]);
    setEditTagInput("");
  };

  const handleRemoveEditTag = (tagName: string) => {
    setEditTags((prev) => prev.filter((tag) => tag !== tagName));
  };

  const handleUpdateLp = async () => {
    if (!editTitle.trim() || !editContent.trim()) return;

    try {
      let nextThumbnail = editThumbnail;

      if (editImageFile) {
        const uploadedImage =
          await uploadImageMutation.mutateAsync(editImageFile);

        nextThumbnail = uploadedImage.imageUrl;
      }

      updateLpMutation.mutate(
        {
          lpId: lpIdNumber,
          title: editTitle.trim(),
          content: editContent.trim(),
          thumbnail: nextThumbnail,
          tags: editTags,
          published: true,
        },
        {
          onSuccess: () => {
            setIsEditingLp(false);
            setEditImageFile(null);
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteLp = () => {
    const isConfirmed = window.confirm("정말 삭제하시겠습니까?");

    if (!isConfirmed) return;

    deleteLpMutation.mutate(lpIdNumber, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  const handleCreateComment = () => {
    if (isCommentEmpty) return;

    createCommentMutation.mutate(
      {
        lpId: lpIdNumber,
        content: newComment.trim(),
      },
      {
        onSuccess: () => {
          setNewComment("");
        },
      },
    );
  };

  const handleStartEditComment = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
    setOpenMenuCommentId(null);
  };

  const handleUpdateComment = () => {
    if (!editingCommentId || !editingContent.trim()) return;

    updateCommentMutation.mutate(
      {
        lpId: lpIdNumber,
        commentId: editingCommentId,
        content: editingContent.trim(),
      },
      {
        onSuccess: () => {
          setEditingCommentId(null);
          setEditingContent("");
        },
      },
    );
  };

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate({
      lpId: lpIdNumber,
      commentId,
    });

    setOpenMenuCommentId(null);
  };

  useEffect(() => {
    if (!accessToken) return;

    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [accessToken, inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-black text-white">
        <div className="text-lg">LP 상세 정보를 불러오는 중입니다...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-black text-white">
        <p className="mb-4">LP 상세 정보를 불러오지 못했습니다.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-md bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!lp) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-black text-white">
        LP 정보가 없습니다.
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black px-6 py-10 text-white">
      <section className="mx-auto w-full max-w-4xl rounded-2xl bg-[#242833] px-12 py-10 shadow-xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {lp.author?.avatar ? (
              <img
                src={lp.author.avatar}
                alt={lp.author.name}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-bold">
                {lp.author?.name?.slice(0, 2) ?? "작성"}
              </div>
            )}

            <span className="font-semibold text-white">
              {lp.author?.name ?? "작성자"}
            </span>
          </div>

          <span className="text-sm text-gray-300">
            {new Date(lp.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="mb-8 flex items-start justify-between gap-6">
          {isEditingLp ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 rounded-md border border-gray-500 bg-transparent px-3 py-2 text-2xl font-bold text-white outline-none focus:border-blue-400"
            />
          ) : (
            <h1 className="text-2xl font-bold">{lp.title}</h1>
          )}

          {isAuthor && (
            <div className="flex items-center gap-4 text-xl text-gray-200">
              {isEditingLp ? (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleChangeEditImage}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="hover:text-pink-400"
                    aria-label="LP 이미지 수정"
                  >
                    <FiImage />
                  </button>

                  <button
                    type="button"
                    onClick={handleUpdateLp}
                    disabled={isUpdateLpPending}
                    className="hover:text-pink-400 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="LP 수정 완료"
                  >
                    <FiCheck />
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEditLp}
                    className="hover:text-pink-400"
                    aria-label="LP 수정 취소"
                  >
                    <FiX />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleStartEditLp}
                    className="hover:text-pink-400"
                    aria-label="LP 수정"
                  >
                    <FiEdit2 />
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteLp}
                    disabled={deleteLpMutation.isPending}
                    className="hover:text-pink-400 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="LP 삭제"
                  >
                    <FiTrash2 />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="mb-8 flex justify-center">
          <div className="relative flex h-[360px] w-[360px] items-center justify-center rounded-md bg-[#20242d] shadow-lg">
            <img
              src={isEditingLp ? editPreviewUrl : lp.thumbnail}
              alt={isEditingLp ? editTitle : lp.title}
              className="h-[320px] w-[320px] rounded-full border-4 border-black object-cover"
            />

            <div className="absolute h-20 w-20 rounded-full bg-white" />
          </div>
        </div>

        {isEditingLp ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="mx-auto mb-6 block w-full max-w-2xl rounded-md border border-gray-500 bg-transparent px-3 py-2 text-sm leading-6 text-white outline-none focus:border-blue-400"
            rows={3}
          />
        ) : (
          <p className="mx-auto mb-8 max-w-2xl whitespace-pre-line text-center text-sm leading-6 text-gray-100">
            {lp.content}
          </p>
        )}

        {isEditingLp ? (
          <div className="mx-auto mb-8 max-w-2xl">
            <div className="mb-4 flex gap-2">
              <input
                value={editTagInput}
                onChange={(e) => setEditTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddEditTag();
                }}
                placeholder="LP Tag"
                className="flex-1 rounded-md border border-gray-500 bg-transparent px-3 py-2 text-white outline-none"
              />

              <button
                type="button"
                onClick={handleAddEditTag}
                className="rounded-md bg-gray-400 px-4 py-2 text-white hover:bg-pink-500"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {editTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleRemoveEditTag(tag)}
                  className="rounded-full bg-[#3A4352] px-3 py-1 text-sm text-gray-100 hover:text-pink-400"
                >
                  #{tag} ×
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {lp.tags?.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-[#3A4352] px-3 py-1 text-sm text-gray-100"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-xl">
          <button
            type="button"
            onClick={handleClickLike}
            disabled={isLikePending}
            className={`transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50 ${
              isLiked ? "text-pink-400" : "text-gray-400"
            }`}
          >
            {isLiked ? <FaHeart /> : <FaRegHeart />}
          </button>

          <span>{lp.likes?.length ?? 0}</span>
        </div>
      </section>

      <section className="mx-auto mt-8 w-full max-w-4xl rounded-2xl bg-[#242833] px-8 py-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">댓글</h2>

          {accessToken && (
            <div className="flex overflow-hidden rounded-md border border-gray-500 text-sm">
              <button
                type="button"
                onClick={() => setOrder(PAGINATION_ORDER.asc)}
                className={`px-4 py-2 ${
                  order === PAGINATION_ORDER.asc
                    ? "bg-white text-black"
                    : "bg-transparent text-white"
                }`}
              >
                오래된순
              </button>

              <button
                type="button"
                onClick={() => setOrder(PAGINATION_ORDER.desc)}
                className={`px-4 py-2 ${
                  order === PAGINATION_ORDER.desc
                    ? "bg-white text-black"
                    : "bg-transparent text-white"
                }`}
              >
                최신순
              </button>
            </div>
          )}
        </div>

        {!accessToken ? (
          <p className="py-8 text-center text-sm text-gray-400">
            댓글을 확인하려면 로그인이 필요합니다.
          </p>
        ) : (
          <>
            <div className="mb-6 flex gap-2">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력해주세요"
                className="flex-1 rounded-md border border-gray-500 bg-transparent px-3 py-2 text-white outline-none"
              />

              <button
                type="button"
                onClick={handleCreateComment}
                disabled={isCommentEmpty || createCommentMutation.isPending}
                className={`rounded-md px-5 py-2 text-white transition-colors disabled:cursor-not-allowed ${
                  isCommentEmpty || createCommentMutation.isPending
                    ? "bg-gray-600"
                    : "bg-pink-500 hover:bg-pink-600"
                }`}
              >
                {createCommentMutation.isPending ? "작성 중..." : "작성"}
              </button>
            </div>

            {isCommentEmpty && (
              <p className="mb-5 text-sm text-gray-400">
                댓글 내용을 입력하면 작성 버튼을 사용할 수 있습니다.
              </p>
            )}

            {isCommentsError && (
              <div className="mb-5">
                <p className="mb-2">댓글 목록을 불러오지 못했습니다.</p>
                <button
                  type="button"
                  onClick={() => refetchComments()}
                  className="rounded bg-pink-500 px-4 py-2 text-sm text-white hover:bg-pink-600"
                >
                  다시 시도
                </button>
              </div>
            )}

            {isCommentsLoading && <CommentSkeletonList count={10} />}

            <div className="flex flex-col gap-5">
              {commentsData?.pages.map((page) =>
                page.data.map((commentItem) => (
                  <div key={commentItem.id} className="relative flex gap-3">
                    {commentItem.author.avatar ? (
                      <img
                        src={commentItem.author.avatar}
                        alt={commentItem.author.name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500 text-sm">
                        {commentItem.author.name.slice(0, 1)}
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="font-semibold">{commentItem.author.name}</p>

                      {editingCommentId === commentItem.id ? (
                        <div className="mt-2 flex gap-2">
                          <input
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="flex-1 rounded-md border border-gray-500 bg-transparent px-3 py-2 text-sm text-white outline-none"
                          />

                          <button
                            type="button"
                            onClick={handleUpdateComment}
                            disabled={
                              !editingContent.trim() ||
                              updateCommentMutation.isPending
                            }
                            className="rounded-md bg-pink-500 px-3 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-500"
                            aria-label="댓글 수정 완료"
                          >
                            <FiCheck />
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-200">
                          {commentItem.content}
                        </p>
                      )}
                    </div>

                    {commentItem.author.id === myId && (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuCommentId((prev) =>
                              prev === commentItem.id ? null : commentItem.id,
                            )
                          }
                          className="text-xl text-gray-300 hover:text-white"
                        >
                          ⋮
                        </button>

                        {openMenuCommentId === commentItem.id && (
                          <div className="absolute right-0 top-8 z-10 flex gap-3 rounded-md bg-black px-3 py-2 text-lg shadow-lg">
                            <button
                              type="button"
                              onClick={() =>
                                handleStartEditComment(
                                  commentItem.id,
                                  commentItem.content,
                                )
                              }
                              className="hover:text-pink-400"
                              aria-label="댓글 수정"
                            >
                              <FiEdit2 />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteComment(commentItem.id)
                              }
                              className="hover:text-pink-400"
                              aria-label="댓글 삭제"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )),
              )}
            </div>

            {isFetchingNextPage && (
              <div className="mt-5">
                <CommentSkeletonList count={5} />
              </div>
            )}

            <div ref={ref} className="h-10" />
          </>
        )}
      </section>
    </div>
  );
};

export default LpDetailPage;
