import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer.tsx"
import Sidebar from "../components/Sidebar";

const HomeLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-black">
            <Navbar />

            <div className="flex flex-1 pt-20">
                <Sidebar />

                <main className="flex-1 bg-black text-white px-6 py-8">
                    <Outlet />
                </main>
            </div>

            <Footer />
        </div>
    )
};

export default HomeLayout;