import React, { useState } from "react";
import UserPost from "../user/UserPost"; // UserPost 컴포넌트 임포트
import UserGallery from "../user/UserGallery"; // UserGallery 컴포넌트 임포트

const ViewChoice = () => {
  // 상태 관리
  const [isPosthome, setIsPosthome] = useState(true);
  const [isGalleryhome, setIsGalleryhome] = useState(false);

  // 클릭 이벤트 핸들러
  const onPostClick = () => {
    setIsPosthome(true);
    setIsGalleryhome(false);
  };

  const onGalleryClick = () => {
    setIsPosthome(false);
    setIsGalleryhome(true);
  };

  return (
    <div>
      {/* 버튼 영역 (공통) */}
      <div className="BtnAreaChoice">
        <button className="choice" onClick={onPostClick}>
          <img className="Btnicon" src="/images/PostHome.png" alt="포스트 홈" />
        </button>

        <button className="choice" onClick={onGalleryClick}>
          <img
            className="Btnicon"
            src="/images/GarrelyHome.png"
            alt="갤러리 홈"
          />
        </button>
      </div>

      {/* 뷰 영역 */}
      <div id="ViewArea">
        {/* 포스트/갤러리 누르는 것에 따른 화면 전환 */}
        {isPosthome && <UserPost />}
        {isGalleryhome && <UserGallery />}
      </div>
    </div>
  );
};

export default ViewChoice;
