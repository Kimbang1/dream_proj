import React from "react";
import "../style/style.css";

function App() {
  return (
    <div id="header">
      <div id="Logo">
        <img alt="로고이미지" src="/images/logo4.png" />
      </div>

      <div id="gnbArea">
        <div className="gnbs">
          <span>홈</span>
        </div>

        <div className="gnbs">
          <span>채팅</span>
        </div>

        <div className="gnbs">
          <span>알림</span>
        </div>

        <div className="gnbs">
          <span>회원관리</span>
        </div>

        <div className="gnbs">
          <span>글관리</span>
        </div>
      </div>
      {/* gnbArea 끝 */}

      <form id="smartSearch" action="">
        <div id="searchArea">
          <input
            id="search"
            type="text"
            placeholder="검색어 입력"
            name="searchText"
          />
          
        </div>
      </form>
    </div>
  );
}

export default App;
