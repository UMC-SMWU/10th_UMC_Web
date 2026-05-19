import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <aside className="hidden md:flex w-52 bg-black text-white min-h-[calc(100vh-80px)] flex-col p-6 gap-6">
            <Link to="/search" className="hover:text-pink-400">
                🔍 찾기
            </Link>
            <Link to="/my" className="hover:text-pink-400">
                👤 마이페이지
            </Link>
        </aside>
    );
};

export default Sidebar;