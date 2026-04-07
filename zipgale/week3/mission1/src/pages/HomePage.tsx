import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Outlet /> {/* children이 들어갈 자리 지정 */}
    </div>
  )
}

export default HomePage;