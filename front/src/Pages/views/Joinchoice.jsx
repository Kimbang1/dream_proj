import React, { useState } from "react";
import Join from "./Join";
import { useNavigate } from "react-router-dom";
import AxiosApi from "../../servies/AxiosApi";

function Joinchoice() {
  const navigate = useNavigate();
  const Localhandle = () => {
    navigate("/join");
  };
  const handleKakaoClick = async () => {
    // 카카오 로그인 페이지로 리다이렉트
    const redirectUri = "http://localhost:8081/join/kakao";
    window.location.href = redirectUri;
  };
  return (
    <div className="background">
      <div className="choiceAreaBox">
        <div className="localArea">
          <button onClick={Localhandle} class="local">
            Whales
          </button>
        </div>
        <hr />
        <div id="socialArea">
          <button class="social">Naver</button> {/*onClick={}*/}
          <button class="social" onClick={handleKakaoClick}>
            kakao
          </button>
          <button class="social">google</button> {/*onClick={}*/}
        </div>
      </div>
    </div>
  );
}

export default Joinchoice;
