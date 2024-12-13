import React, { useRef } from "react";
import "./style/style.css";
import Header from "./layout/Header"; // Header 컴포넌트
import LeftBar from "./layout/LeftBar"; // LeftBar 컴포넌트
import Posetview1 from "./layout/Postview1";
import InputPost1 from "./layout/InputPost1";

function App() {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div id="wrap">
      {/* 세션값을 줄 장소 일반 유저인지 관리자인지 */}
      <Header />

      <div id="Mainview">
        <div id="left">
          {/* 세션값을 줄 장소 일반 유저인지 관리자인지 */}
          <LeftBar />
        </div>

        <div id="right">
          <Posetview1 />
          <div id="rsideBar">
            <InputPost1 />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
