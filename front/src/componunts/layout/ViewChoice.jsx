import React, { useState } from "react";
import Gallery from "../../Pages/views/Gallery";
import Post from "../../Pages/views/Post";
import UserGallery from "../user/UserGallery";
import UserPost from "../user/UserPost";

const ViewChoice = ({ setIsMainPage }) => {
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
        {/* 메인 페이지 여부에 따라 다른 컴포넌트 렌더링 */}
        {setIsMainPage ? (
          <>
            {isPosthome && <Post />} {/* 일반 Post 화면 */}
            {isGalleryhome && <Gallery />} {/* 일반 Gallery 화면 */}
          </>
        ) : (
          <>
            {isPosthome && <UserPost />} {/* 유저 Post 화면 */}
            {isGalleryhome && <UserGallery />} {/* 유저 Gallery 화면 */}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewChoice;
