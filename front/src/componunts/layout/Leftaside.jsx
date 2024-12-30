import React from "react";

import { useMediaQuery } from "react-responsive";
import { useNavigate, Link } from "react-router-dom"; // Link 컴포넌트 추가

function Leftaside() {
  const hiddenAside = useMediaQuery({ maxWidth: 750 });

  const navigate = useNavigate();
  const handlehomeClick = () => {
    navigate("/Mainview");
  };
  

  return (
    <div className="wrap">
      {!hiddenAside && (
        <form action="">
          <div className="LogoArea">
            <img onClick={handlehomeClick} src="/images/logo4.png" alt="로고" />
          </div>

          <div className="gnbArea">
            <div className="menu">
              <img onClick={handlehomeClick} src="/images/home.png" alt="홈" />
            </div>

            <div className="menu">
              <img src="/images/map.png" alt="지도" />
            </div>

            <div className="menu">
              <img src="/images/chating.png" alt="채팅" />
            </div>

            <div className="menu">
              <img src="/images/whale.png" alt="챗봇" />
            </div>

            {/*링크도 경로를 맞춰줘야 함.*/}
            <Link to="/user/UserMainpage">
              <div className="menu">
                <img src="/images/cat.jpg" alt="프로필" />
              </div>
            </Link>

            <div className="Manager">
              <div className="menu">
                <span>회원목록</span>
              </div>

              <div className="menu">
                <span>게시글 목록</span>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default Leftaside;
