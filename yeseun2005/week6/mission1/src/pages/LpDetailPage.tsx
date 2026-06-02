import { useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";

const LpDetailPage = () => {
    const { lpid } = useParams();
    const { data, isPending, isError } = useGetLpDetail(lpid);

    if (isPending) {
        return <div className="mt-20 px-6">로딩 중...</div>;
    }

    if (isError) {
        return <div className="mt-20 px-6">상세 정보를 불러오지 못했습니다.</div>;
    }

    const lp = data?.data;

    return (
        <div className="mt-20 px-6 max-w-3xl mx-auto">
            <img
                src={lp?.thumbnail || "https://placehold.co/500x500"}
                alt={lp?.title}
                className="w-full max-h-[500px] object-cover rounded-lg"
            />

            <h1 className="text-3xl font-bold mt-6">{lp?.title}</h1>

            <p className="text-gray-500 mt-2">
                {lp?.createdAt && new Date(lp.createdAt).toLocaleDateString()}
            </p>

            <p className="mt-4">좋아요 {lp?.likes.length}개</p>

            <p className="mt-6 leading-7">{lp?.content}</p>

            <div className="flex gap-2 mt-6">
                <button className="px-4 py-2 bg-gray-800 text-white rounded">
                    수정
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded">
                    삭제
                </button>
                <button className="px-4 py-2 bg-pink-500 text-white rounded">
                    좋아요
                </button>
            </div>
        </div>
    );
};

export default LpDetailPage;