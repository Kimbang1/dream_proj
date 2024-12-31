import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Bottom() {
  const navigate = useNavigate();

  const changeUserMain = () => {
      navigate("UserMainpage"); // 네비게이션 추가
  };

  const changeGallery = () => {
    navigate("/Gallery"); // 네비게이션 추가
  };

  const changePost = () => {
    navigate("/Post"); // 네비게이션 추가
  };

  const changeContentWrite = () => {
    navigate("/ContentWrite"); // 네비게이션 추가
  };

  return (
    <div>
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
