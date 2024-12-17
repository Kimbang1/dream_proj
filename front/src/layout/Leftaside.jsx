import React from "react";
import "../style/leftaside.css";
import { useMediaQuery } from "react-responsive";

function Leftaside() {
  const hiddenAside = useMediaQuery({ maxWidth: 750 });

  return (
    <div className="wrap">
      {!hiddenAside && (
        <form action="">
          <div className="LogoArea">
            <img src="/images/logo4.png" alt="로고" />
          </div>

          <div className="gnbArea">
            <div className="menu">
              <img src="/images/home.png" alt="홈" />
            </div>

            <div className="menu">
              <img src="/images/trade.png" alt="뷰 체인지" />
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

            <div className="menu">
              <img src="/images/cat.jpg" alt="프로필" />
            </div>

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
