import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      {/* 자식 요소를 보여주기 위해 Outlet을 설정해야 함 -> 그래야 영화에 대한 데이터들이 잘 보임(App.tsx) */}
    </>
  );
};

export default HomePage;