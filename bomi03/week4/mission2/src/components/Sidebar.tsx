import { Link } from "react-router-dom";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* 모바일에서 사이드바가 열렸을 때만 외부 어두운 영역 표시 */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-16 bottom-0 z-30 h-[calc(100vh-80px)] w-52 bg-white dark:bg-gray-900 text-white transition-transform duration-300
        md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <nav className="flex flex-col gap-6 px-8 py-8 text-lg font-semibold">
          <Link
            to="/search"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <span>🔍</span>
            <span>찾기</span>
          </Link>

          <Link
            to="/mypage"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <span>👤</span>
            <span>마이페이지</span>
          </Link>
        </nav>

        <button className="absolute bottom-6 left-8 text-sm text-gray-400">
          탈퇴하기
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
