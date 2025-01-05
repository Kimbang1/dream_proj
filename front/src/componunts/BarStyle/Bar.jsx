import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/layout-css/Bar.css";

function Bar() {
  const [drawOpen, setDrawOpen] = useState(false);
  const [isUserMainPage, setIsUserMainPage] = useState(false);
  const navigate = useNavigate();

  //드로우 토글
  const toggleDraw = () => {
    setDrawOpen((prev) => !prev);
  };

  //메뉴 항목 배열
  const navItems = [
    { name: "지도", path: "/Map" },
    { name: "알람", path: "/Alram" },
    { name: "채팅", path: "/Chating" },
    { name: "챗봇", path: "/whale" },
    { name: "관리자", path: "/Manager" },
  ];

  const handleMenuClick = (path) => {
    setIsUserMainPage(true);
    navigate(path);
    toggleDraw();
  };

  return (
    <div className="header">
      {/* 삼발이 아이콘 */}
      <div className="menu-icon" onClick={toggleDraw}>
        &#9776; {/* 삼발이 메뉴 아이콘 (유니코드) */}
      </div>

      {/* 드로어 */}
      <div className={`drawer ${drawOpen ? "open" : ""}`}>
        <div className="drawer-content">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="drawer-item"
              onClick={() => {
                handleMenuClick(item.path); //메뉴 클릭시 페이지 이동
                console.log("클릭한것이야?:", handleMenuClick(item.path));
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
        {/* 드로어 외부 영역 클릭 시 닫기 */}
        <div className="drawer-overlay" onClick={toggleDraw}></div>
      </div>
    </div>
  );
}

export default Bar;
