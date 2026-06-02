import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLpDetail } from '../apis/lp';
import { FaPencilAlt, FaTrashAlt, FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const getRelativeTime = (dateString: string) => {
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now.getTime() - past.getTime();
  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} mins ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${past.getFullYear()}.${(past.getMonth() + 1).toString().padStart(2, '0')}.${past.getDate().toString().padStart(2, '0')}`;
};

const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: lp,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['lp', lpId],
    queryFn: () => getLpDetail({ lpId: Number(lpId) }),
    enabled: !!lpId,
  });

  const detail = lp?.data;

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (isError || !detail)
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        데이터를 불러오지 못했습니다.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8 pt-24">
      <div className="max-w-3xl mx-auto bg-[#1e1e1e] rounded-3xl p-8 shadow-2xl border border-white/5">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E91E63] rounded-full flex items-center justify-center font-bold">
              {detail.user?.name?.[0] || 'P'}
            </div>
            <div className="flex flex-col">
              <span className="font-bold">{detail.user?.name || '익명'}</span>
              <span className="text-gray-400 text-xs">
                {getRelativeTime(detail.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex gap-4 text-gray-500">
            <button className="hover:text-white transition-colors">
              <FaPencilAlt size={18} />
            </button>
            <button className="hover:text-red-500 transition-colors">
              <FaTrashAlt size={18} />
            </button>
          </div>
        </div>

        <h1 className="text-4xl font-black mb-10 leading-tight">
          {detail.title}
        </h1>

        <div className="flex justify-center mb-12">
          <div className="relative w-64 h-64 md:w-80 md:h-80 group">
            <div className="w-full h-full rounded-full border-[6px] border-[#121212] shadow-2xl overflow-hidden bg-black">
              <img
                src={detail.thumbnail}
                className="w-full h-full object-cover"
                alt="LP Thumbnail"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#1e1e1e] rounded-full border-4 border-black shadow-inner"></div>
          </div>
        </div>

        <div className="space-y-6 mb-12">
          <p className="text-gray-300 leading-relaxed text-lg italic font-light">
            "{detail.content || '음악에 대한 감상이 적혀있지 않습니다.'}"
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {detail.tags?.length > 0 ? (
              detail.tags.map((tag: any, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#282828] rounded-full text-xs text-[#E91E63] font-medium"
                >
                  #{tag.name || tag}
                </span>
              ))
            ) : (
              <span className="text-gray-600 text-sm">#LP #Music #Vinyl</span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center border-t border-white/10 pt-10">
          <button className="flex items-center gap-2 group hover:scale-110 transition-transform">
            <FaHeart className="text-[#E91E63]" size={32} />
            <span className="font-bold text-2xl text-white">
              {detail.likes?.length || 0}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LpDetailPage;
