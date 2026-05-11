import { useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";

const LpDetailPage = () => {
  const { lpid } = useParams();
  const lpIdNumber = Number(lpid);

  const { data: lp, isPending, isError, refetch } = useGetLpDetail(lpIdNumber);

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
        {/* 상단 작성자 / 날짜 영역 */}
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

        {/* 제목 / 버튼 */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{lp.title}</h1>

          <div className="flex items-center gap-4 text-xl text-gray-200">
            <button type="button" className="hover:text-pink-400">
              ✎
            </button>
            <button type="button" className="hover:text-pink-400">
              🗑
            </button>
          </div>
        </div>

        {/* LP 이미지 */}
        <div className="mb-8 flex justify-center">
          <div className="relative flex h-[360px] w-[360px] items-center justify-center rounded-md bg-[#20242d] shadow-lg">
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="h-[320px] w-[320px] rounded-full border-4 border-black object-cover"
            />

            {/* LP 가운데 구멍 느낌 */}
            <div className="absolute h-20 w-20 rounded-full bg-white" />
          </div>
        </div>

        {/* 본문 */}
        <p className="mx-auto mb-8 max-w-2xl whitespace-pre-line text-center text-sm leading-6 text-gray-100">
          {lp.content}
        </p>

        {/* 태그 */}
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

        {/* 좋아요 */}
        <div className="flex items-center justify-center gap-2 text-xl">
          <button type="button" className="text-pink-400 hover:scale-110">
            ♥
          </button>
          <span>{lp.likes?.length ?? 0}</span>
        </div>
      </section>
    </div>
  );
};

export default LpDetailPage;
