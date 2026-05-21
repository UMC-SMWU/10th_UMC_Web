import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetLpList } from '../hooks/queries/useGetLpList';
import useDebounce from '../hooks/useDebounce';
import useThrottle from '../hooks/useThrottle';
import { SEARCH_DEBOUNCE_DELAY } from '../constants/delay';

const getRelativeTime = (dateString: string) => {
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} mins ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days < 7) return `${days} days ago`;

  return `${past.getFullYear()}.${(past.getMonth() + 1).toString().padStart(2, '0')}.${past.getDate().toString().padStart(2, '0')}`;
};

const HomePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const debouncedValue = useDebounce(search, SEARCH_DEBOUNCE_DELAY);
  const [sort, setSort] = useState<'desc' | 'asc'>('desc');

  const [rawScrollY, setRawScrollY] = useState(0);
  const throttledScrollY = useThrottle(rawScrollY, 1000);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetLpList({
      search: debouncedValue,
      sort,
      limit: 10,
    });

  const lpList = data?.pages.flatMap((page) => page.data.data) || [];

  console.log('다음 페이지 있나?:', hasNextPage);
  console.log('데이터 개수:', lpList.length);

  const handleScroll = () => {
    setRawScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    const isBottom = throttledScrollY + clientHeight >= scrollHeight - 300;

    if (isBottom && hasNextPage && !isFetchingNextPage) {
      console.log(
        '🎬 쓰로틀링 덕분에 1초에 최대 한 번만 실행됩니다! 다음 페이지 로딩 중...',
      );
      fetchNextPage();
    }
  }, [throttledScrollY, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 flex flex-col items-center">
      <div className="w-full flex justify-center mb-6 mt-12">
        <input
          className="w-full max-w-md border p-4 rounded-sm bg-[#333] text-white outline-none"
          placeholder="검색어를 입력하세요."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="w-full flex justify-start gap-1 mb-8">
        <button
          onClick={() => setSort('asc')}
          className={`px-4 py-1.5 rounded-sm text-xs font-bold transition-colors ${
            sort === 'asc' ? 'bg-white text-black' : 'bg-[#282828] text-white'
          }`}
        >
          오래된순
        </button>
        <button
          onClick={() => setSort('desc')}
          className={`px-4 py-1.5 rounded-sm text-xs font-bold transition-colors ${
            sort === 'desc' ? 'bg-white text-black' : 'bg-[#282828] text-white'
          }`}
        >
          최신순
        </button>
      </div>

      <div className="w-full grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-800 animate-pulse rounded-md"
              />
            ))
          : lpList.map((lp, index) => (
              <div
                key={`${lp.id}-${index}`}
                onClick={() => navigate(`/lp/${lp.id}`)}
                className="relative aspect-square group cursor-pointer overflow-hidden bg-[#181818]"
              >
                <img
                  src={lp.thumbnail}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={lp.title}
                />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <h3 className="text-white font-bold text-xs truncate">
                    {lp.title}
                  </h3>
                  <div className="flex justify-between items-center mt-1 text-[10px]">
                    <span className="text-gray-400">
                      {getRelativeTime(lp.createdAt)}
                    </span>
                    <span className="text-white">
                      ♥ {lp.likes?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
      </div>

      <button className="fixed bottom-10 right-10 w-16 h-16 bg-[#E91E63] rounded-full flex items-center justify-center text-white text-4xl shadow-xl hover:scale-110 transition-transform active:scale-95 z-50">
        <span className="leading-none pb-1">+</span>
      </button>
    </div>
  );
};

export default HomePage;
