import { useEffect, useState } from "react";
import useThrottle from "../hooks/useThrottle";

const ThrottlePage = () => {
  const [scrollY, setScrollY] = useState<number>(0);
  const throttledScrollY = useThrottle(scrollY, 2000);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    console.log("throttledScrollY 변경:", throttledScrollY);
  }, [throttledScrollY]);

  return (
    <div className="flex h-[300vh] flex-col items-center justify-center">
      <div className="fixed top-1/2 -translate-y-1/2 text-center">
        <h1>쓰로틀링이 무엇일까요?</h1>
        <p>ScrollY : {throttledScrollY}px</p>
      </div>
    </div>
  );
};

export default ThrottlePage;
