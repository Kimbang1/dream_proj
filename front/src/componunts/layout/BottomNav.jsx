import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Bottom() {
  const navigate = useNavigate();
  const [isPostHome, setIsePostHome] = useState(true);
  const [isGarrelytHome, setIsGarrelytHome] = useState(false);
  const [isContentWrite, setIsContentwrite] = useState(true);

  const onContentWriteClick = () => {
    setIsContentwrite(true);
  };


  const onPostClick = () => {
    setIsePostHome(true);
    setIsGarrelytHome(false);
    navigate("/Post");
  };

  const onGalleryClick = () => {
    setIsGarrelytHome(true);
    setIsePostHome(false);
    navigate("/Gallery");
  };

  const handleUserPg = () => {
    navigate("/user/UserMainpage");
  };
  return (
    <nav id="footerFrame">
      <div class="Bottomicon">
        <img onClick={onPostClick} src="/images/PostHome.png" alt="포스트홈" />
      </div>

      <div class="Bottomicon">
        <img
          onClick={onGalleryClick}
          src="/images/GarrelyHome.png"
          alt="갤러리 페이지"
        />
      </div>

      <div class="Bottomicon">
        <img onClick={onContentWriteClick} src="/images/plus.png" alt="추가" />
      </div>

      <div class="Bottomicon">
        <img src="/images/dodbogi.png" alt="돋보기" />
      </div>

      <div class="Bottomicon">
        <img onClick={handleUserPg} src="/images/cat.jpg" alt="프로필" />
      </div>
    </nav>
  );
}

export default Bottom;
