import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import Gallery from "../../Pages/views/Gallery"; // Gallery 컴포넌트 임포트
import RightAside from "../../componunts/layout/RightAside";
import ViewChoice from "../../componunts/layout/ViewChoice";

function Mainview(isMainPage) {
  // const [currentPage, setCurrentPage] = useState("gallery"); // 현재 페이지를 관리하는 상태

  return (
    <>
      {/* //프로필 페이지가 아닐때만 렌더링 */}
      <div className="ChoiceBtn">
        <ViewChoice />
      </div>
      <div className="RightAside">
        <RightAside />
      </div>
      <div className="viewArea">{!isMainPage && <Gallery />}</div>
    </>
  );
}

export default Mainview;
