import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      const redirectPath = location.pathname + location.search;

      sessionStorage.setItem("redirectAfterLogin", redirectPath);
      console.log("저장된 redirect 경로:", redirectPath);

      alert("로그인이 필요한 서비스입니다. 로그인을 해주세요!");

      navigate("/login", {
        replace: true,
        state: { fromProtectedRoute: true },
      });
    }
  }, [accessToken, location.pathname, location.search, navigate]);

  if (!accessToken) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar onClickMenu={() => setIsSidebarOpen(true)} />

      <div className="flex flex-1 pt-[80px] bg-black">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 md:ml-52 bg-black">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ProtectedLayout;
