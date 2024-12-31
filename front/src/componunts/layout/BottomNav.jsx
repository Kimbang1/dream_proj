import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Bottom() {
  const [isUserMainPage, setIsUserMainPage] = useState(true);
  const [isGalleryhome, setIsGalleryhome] = useState(false);
  const [isPosthome, setIsPosthome] = useState(false);
  const [isContentWrite, setIsContentWrite] = useState(false);

  const navigate = useNavigate();

  const changeUserMain = () => {
    setIsUserMainPage(true);
    setIsGalleryhome(false);
    setIsPosthome(false);
    setIsContentWrite(false);
    navigate("/user/UserMainpage"); // 네비게이션 추가
  };

  const changeGallery = () => {
    setIsGalleryhome(true);
    setIsUserMainPage(false);
    setIsPosthome(false);
    setIsContentWrite(false);
    navigate("/Gallery"); // 네비게이션 추가
  };

  const changePost = () => {
    setIsPosthome(true);
    setIsUserMainPage(false);
    setIsGalleryhome(false);
    setIsContentWrite(false);
    navigate("/Post"); // 네비게이션 추가
  };

  const changeContentWrite = () => {
    setIsContentWrite(true);
    setIsUserMainPage(false);
    setIsGalleryhome(false);
    setIsPosthome(false);
    navigate("/ContentWrite"); // 네비게이션 추가
  };

  return (
    <div>
      {isUserMainPage && <div>사용자 메인 페이지</div>}
      {isGalleryhome && <div>갤러리 페이지</div>}
      {isPosthome && <div>포스트 페이지</div>}
      {isContentWrite && <div>게시글 작성 페이지</div>}

      <nav id="footerFrame">
        <div className="Bottomicon">
          <img onClick={changePost} src="/images/PostHome.png" alt="포스트홈" />
        </div>

        <div className="Bottomicon">
          <img
            onClick={changeGallery}
            src="/images/GarrelyHome.png"
            alt="갤러리 페이지"
          />
        </div>

        <div className="Bottomicon">
          <img onClick={changeContentWrite} src="/images/plus.png" alt="추가" />
        </div>

        <div className="Bottomicon">
          <img src="/images/dodbogi.png" alt="돋보기" />
        </div>

        <div className="Bottomicon">
          <img onClick={changeUserMain} src="/images/cat.jpg" alt="프로필" />
        </div>
      </nav>
    </div>
  );
}

export default Bottom;
