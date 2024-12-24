import React from "react";
import { useNavigate } from "react-router-dom";

function Bottom() {
  const navigate = useNavigate();
  const handleUserPg = () => {
    navigate("/UserMainpage");
  };
  return (
    <nav id="footerFrame">
      <div class="icon">
        <img src="/images/PostHome.png" alt="포스트홈" />
      </div>

      <div class="icon">
        <img src="/images/GarrelyHome.png" alt="갤러리 페이지" />
      </div>

      <div class="icon">
        <img src="/images/+.png" alt="추가" />
      </div>

      <div class="icon">
        <img src="/images/dodbogi.png" alt="돋보기" />
      </div>

      <div class="icon">
        <img onClick={handleUserPg} src="/images/cat.jpg" alt="프로필" />
      </div>
    </nav>
  );
}

export default Bottom;
