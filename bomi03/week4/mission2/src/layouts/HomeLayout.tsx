import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import useSidebar from "../hooks/useSidebar";

const HomeLayout = () => {
  const { isOpen, open, close } = useSidebar();

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar onClickMenu={open} />

      <div className="flex flex-1 pt-[80px] bg-black">
        <Sidebar isOpen={isOpen} onClose={close} />

        <main className="flex-1 bg-black">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default HomeLayout;
