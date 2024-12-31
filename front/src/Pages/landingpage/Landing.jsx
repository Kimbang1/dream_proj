import React from "react";
import { useNavigate } from "react-router-dom";
// 페이지 이동을 위한 훅
import bridge from "../../assets/landig/bridge.png";
import danpoong from "../../assets/landig/danpoong.png";
import dngdae from "../../assets/landig/dngdae.png";
import hanokg from "../../assets/landig/hanokg.png";

import AutoSlied from "../landingpage/AutoSlide";
//자동 슬라이드 컴포넌트 임포트
function Landing() {
  const images = [bridge, danpoong, dngdae, hanokg];
  const intervalTime = 3000;

  const navigate = useNavigate();
  //useNavigate훅을 사용하기 위해 선언

  const handleLoginClick = () => {
    navigate("/login"); //로그인 페이지로 이동
  };

  const handleJoinClick = () => {
    navigate("/Agree"); //약관 동의 페이지
  };
  return (
    <div id="wrap">
      <div className="wordArea">
        <h1>Whales</h1>
        <div className="content">
          <span>Now, New, Network</span>
        </div>
        <div className="content">
          <span>Lorem(설명)</span>
        </div>

        <div className="lojoArea">
          <div className="btnArea">
            <button id="login" onClick={handleLoginClick}>
              login
            </button>
          </div>

          <div className="btnArea">
            <button id="join" onClick={handleJoinClick}>
              join
            </button>
          </div>
        </div>
      </div>

      <div className="imgArea">
        <AutoSlied images={images} intervalTime={intervalTime} />
      </div>
    </div>
  );
}

export default Landing;
