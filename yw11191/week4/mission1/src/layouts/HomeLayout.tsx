import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";

const HomeLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);

    useEffect(() => {
        const handleResize = () => {
        // md 기준점인 768px 미만(모바일 사이즈)으로 떨어지면 자동으로 열림 상태를 닫음으로 변경
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className='min-h-dvh h-auto flex flex-col bg-neutral-900'>
            <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <div className="flex flex-1 pt-15 relative">
                {isSidebarOpen && (
                <div 
                    onClick={closeSidebar} 
                    className="fixed inset-0 top-15 bg-black/50 z-30 md:hidden backdrop-blur-xs cursor-pointer" 
                />
                )}
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? "md:pl-64" : "md:pl-0"}`}>
                    <main className='flex-1 p-6'>
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </div>
            
            
        </div>
    )
};

export default HomeLayout;