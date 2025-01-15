import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "../../servies/AxiosApi";
import useEnter from "../../hook/useEnterky";

function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const navigate = useNavigate();
  //useNavigate를 사용하기 위한 선언 (나중에 정리할 것)

  const handleJoinClick = () => {
    navigate("/joinchoice");
  };

  const handleLoginClick = async () => {
    try {
      // Spring Boot 서버에 요청할 데이터 생성
      const requestBody = {
        email: email,
        pwd: pwd,
        provider: "local",
      };

      // Axios를 통해 Spring Boot로 POST 요청
      const response = await AxiosApi.post("/auth/login", requestBody);
      console.log(response.data);
      alert("로그인 성공");
      navigate("/Mainview");
    } catch (error) {
      const errorResponse = error.response;
      console.error("로그인 실패: ", errorResponse);
      console.error("로그인 실패 타입: ", errorResponse.data.falseType);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  useEnter(handleLoginClick);

  return (
    <div id="Back">
      <div id="loginBox">
        <input
          className="loginFrame"
          placeholder="이메일을 입력해주세요"
          type="text"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <input
          className="loginFrame"
          placeholder="비밀번호를 입력해주세요"
          type="password"
          name="pwd"
          value={pwd}
          onChange={(e) => {
            setPwd(e.target.value);
          }}
        />

        <div className="loginBtnArea">
          <button className="loginBtn" onClick={handleLoginClick}>
            로그인
          </button>
        </div>

        <hr />
        <div className="loginBtnArea">
          <button className="loginBtn" onClick={handleJoinClick}>
            새 계정 만들기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
