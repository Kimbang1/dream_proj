import React, { useState, useEffect } from "react";
import Gallery from "../../Pages/views/Gallery";
import Post from "../../Pages/views/Post";
import UserGallery from "../user/UserGallery";
import UserPost from "../user/UserPost";

const ViewChoice = ({ setIsMainPage, uuid }) => {
  // 상태 관리
  const [isPosthome, setIsPosthome] = useState(true);
  const [isGalleryhome, setIsGalleryhome] = useState(false);
  const [isMainPage, setIsMainPageState] = useState(setIsMainPage);
  const [currentUuid, setCurrentUuid] = useState(uuid); // 현재 uuid 상태 관리

  console.log("ViewChoice에서 받은 UUID:", uuid, "Type:", typeof uuid);

  // 클릭 이벤트 핸들러
  const onPostClick = () => {
    setIsPosthome(true);
    setIsGalleryhome(false);
  };

  const onGalleryClick = () => {
    setIsPosthome(false);
    setIsGalleryhome(true);
  };

  // UUID 변경 감지 및 상태 업데이트
  useEffect(() => {
    if (uuid !== currentUuid) {
      setCurrentUuid(uuid); // uuid가 변경될 때마다 상태 업데이트
      setIsPosthome(true); // 새 페이지에 대한 초기 설정
      setIsGalleryhome(false);
    }
  }, [uuid, currentUuid]);

  // isMainPage 상태 변경 함수
  useEffect(() => {
    setIsMainPageState(setIsMainPage); // 부모에서 전달받은 isMainPage 값을 상태로 관리
  }, [setIsMainPage]);

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
        {isMainPage ? (
          <>
            {isPosthome && <Post />} {/* 일반 Post 화면 */}
            {isGalleryhome && <Gallery />} {/* 일반 Gallery 화면 */}
          </>
        ) : (
          <>
            {isPosthome && <UserPost uuid={currentUuid} />}
            {/* 유저 Post 화면 */}
            {isGalleryhome && <UserGallery uuid={currentUuid} />}
            {/* 유저 Gallery 화면 */}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewChoice;
