import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetInfiniteLpComments from "../hooks/queries/useGetInfiniteLpComments";
import { PAGINATION_ORDER } from "../enums/common";
import CommentSkeletonList from "../components/LpComment/CommentSkeletonList";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AuthContext";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const LpDetailPage = () => {
  const { lpid } = useParams();
  const { accessToken } = useAuth();
  const lpIdNumber = Number(lpid);

  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const [comment, setComment] = useState("");

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

  const myId = me?.data?.id;
  const isLiked = lp?.likes?.some((like) => like.userId === myId) ?? false;
  const isLikePending =
    postLikeMutation.isPending || deleteLikeMutation.isPending;

  const isAuthor = !!myId && lp?.authorId === myId;

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
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-200 text-lg">
                🌐
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

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{lp.title}</h1>

          {isAuthor && (
            <div className="flex items-center gap-4 text-xl text-gray-200">
              <button type="button" className="hover:text-pink-400">
                ✎
              </button>
              <button type="button" className="hover:text-pink-400">
                🗑
              </button>
            </div>
          )}
        </div>

        <div className="mb-8 flex justify-center">
          <div className="relative flex h-[360px] w-[360px] items-center justify-center rounded-md bg-[#20242d] shadow-lg">
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="h-[320px] w-[320px] rounded-full border-4 border-black object-cover"
            />

            <div className="absolute h-20 w-20 rounded-full bg-white" />
          </div>
        </div>

        <p className="mx-auto mb-8 max-w-2xl whitespace-pre-line text-center text-sm leading-6 text-gray-100">
          {lp.content}
        </p>

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
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="댓글을 입력해주세요"
                className="flex-1 rounded-md border border-gray-500 bg-transparent px-3 py-2 text-white outline-none"
              />

              <button
                type="button"
                disabled={comment.trim().length === 0}
                className="rounded-md bg-gray-500 px-5 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-600"
              >
                작성
              </button>
            </div>

            {comment.trim().length === 0 && (
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
                  <div key={commentItem.id} className="flex gap-3">
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
                      <p className="text-sm text-gray-200">
                        {commentItem.content}
                      </p>
                    </div>

                    {commentItem.author.id === myId && (
                      <button type="button" className="text-xl text-gray-300">
                        ⋮
                      </button>
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
