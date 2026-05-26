import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ProtectedLayout = () => {
  const {accessToken} = useAuth();

  if(!accessToken){ // accessToken이 없으면 로그인 페이지로 이동
    return <Navigate to = {'/login'} replace /> // replace: 뒤로가기 했을 때 로그인 페이지로 돌아오지 않도록
  }
  return (
    <div className='h-dvh flex flex-col'>
      <Navbar/>
      <main className='flex-1 mt-10'>
        <Outlet/> {/* children을 표시 */}
      </main>
      <Footer/>
    </div>
  ) 
}

export default ProtectedLayout;