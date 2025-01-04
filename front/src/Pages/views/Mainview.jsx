import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import Gallery from "../../Pages/views/Gallery"; // Gallery 컴포넌트 임포트

function Mainview() {
  const [currentPage, setCurrentPage] = useState("gallery"); // 현재 페이지를 관리하는 상태
  const navigate = useNavigate();

  const handleMenuClick = (page) => {
    setCurrentPage(page);
    switch (page) {
      case "gallery":
        navigate("/gallery");
        break;

      // 추가 메뉴 항목에 따라 case 추가 가능
      default:
        navigate("/"); // 기본 페이지로 이동
        break;
    }
  };

  return (
    <>
      <div>
        {/* 메뉴 항목 */}
        <button onClick={() => handleMenuClick("gallery")}>Gallery</button>

        {/* 다른 메뉴 항목 버튼 추가 가능 */}
      </div>

      {/* 현재 페이지에 따라 컴포넌트 렌더링 */}
      {currentPage === "gallery" && <Gallery />}

      {/* 추가적인 페이지에 따라 조건부 렌더링 가능 */}
    </>
  );
}

export default Mainview;
