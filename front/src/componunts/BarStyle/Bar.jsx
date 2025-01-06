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
      <div className="menu-icon" onClick={toggleDraw}>
        &#9776;
      </div>

      <div className={`drawer ${drawOpen ? "open" : ""}`}>
        <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
          {navItems.map((item) => (
            <div
              key={item.name}
              className="drawer-item"
              onClick={() => handleMenuClick(item.path)}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>

      <div
        className={`drawer-overlay ${drawOpen ? "open" : ""}`}
        onClick={toggleDraw}
      ></div>
    </div>
  );
}

export default Bar;
