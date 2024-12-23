import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [id, setid] = useState("");
  const [pw, setpw] = useState("");
  const navigate = useNavigate();
  //useNavigate를 사용하기 위한 선언 (나중에 정리할 것)

  const handleJoinClick = () => {
    navigate("/join");
  };

  const handleMainviewClick = () => {
    navigate("/Mainview");
  };

  return (
    <div id="Back">
      <div id="loginBox">
        <input
          className="loginFrame"
          placeholder="아이디를 입력해주세요"
          type="text"
          name="id"
          value={id}
          onChange={(e) => {
            setid(e.target.value);
          }}
        />

        <input
          className="loginFrame"
          placeholder="비밀번호를 입력해주세요"
          type="password"
          name="pw"
          value={pw}
          onChange={(e) => {
            setpw(e.target.value);
          }}
        />

        <div id="loginBtnArea">
          <button className="loginBtn" onClick={handleMainviewClick}>
            로그인
          </button>
        </div>
        <hr />
        <div id="socialArea">
          <button class="social">네이버</button> {/*onClick={}*/}
          <button class="social">kakao</button> {/*onClick={}*/}
          <button class="social">google</button> {/*onClick={}*/}
        </div>
        <hr />
        <div id="NewLicense">
          <button className="loginBtn" onClick={handleJoinClick}>
            새 계정 만들기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
