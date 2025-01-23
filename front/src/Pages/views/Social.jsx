import AxiosApi from "../../servies/AxiosApi";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Social() {
  const [username, setUserName] = useState("");
  const [tag_id, setTagId] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");

  const navigate = useNavigate();

  const [provider, setProvider] = useState("");
  const [uuid, setUuid] = useState("");
  const [res, setRes] = useState("");
  const [email, setEmail] = useState("");
  const [key, setKey] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resFromUrl = urlParams.get("res") || "";
    setRes(resFromUrl);
    setProvider(urlParams.get("provider") || "");
    setUuid(urlParams.get("uuid") || "");
    setEmail(urlParams.get("email") || "");
    setKey(urlParams.get("key") || "");
  }, []);

  useEffect(() => {
    // email, key, provider 값이 모두 있을 때 로그인 처리
    if (res === "login" && email && key && provider) {
      const loginData = {
        email: email,
        social_key: key,
        provider: provider,
      };
      handleLogin(loginData);
    }
  }, [email, key, provider, res]);

  const handleLogin = async (loginData) => {
    // 로그인 로직 (백엔드에서 로그인 처리 후, 필요한 토큰 등을 받아와야 함)
    console.log("email : ", email);
    console.log("key : ", key);
    console.log("provider : ", provider);
    console.log("res : ", res);
    try {
      const response = await AxiosApi.post("/join/local", loginData);
      console.log(response.data);
      // 로그인 후 메인뷰로 리다이렉트
      navigate("/Mainview");
    } catch (error) {
      console.error("로그인 실패", error);
      alert("로그인 실패");
    }
  };

  const handleReset = () => {
    setUserName("");
    setTagId("");
    setPhone("");
    setBirthday("");
  };
  const handleSubmit = async () => {
    // 사용자 데이터 준비
    const userData = {
      uuid: uuid,
      provider: provider,
      username: username,
      tag_id: tag_id,
      phone: phone,
      birthday: birthday,
      email: email,
    };

    try {
      // 서버에 데이터 전송
      const response = await AxiosApi.post("/auth/join", userData);
      console.log(response.data);
      alert("소셜회원가입 성공");

      // 가입 성공 후 Mainview로 이동
      navigate("/Mainview"); // 경로 지정
    } catch (error) {
      console.error("소셜회원가입 실패", error);
      alert("소셜회원가입 실패");
    }
  };

  return (
    <div className="backGround">
      <div className="socialbox">
        <input
          className="joinFrame"
          type="text"
          placeholder="이름을 입력하시오"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />

        <input
          className="joinFrame"
          type="text"
          placeholder="태그 아이디를 입력해주세요"
          value={tag_id}
          onChange={(e) => setTagId(e.target.value)}
        />

        <input
          className="joinFrame"
          type="text"
          placeholder="전화번호를 입력해주쇼"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className="joinFrame"
          type="date"
          placeholder="생일을 입력해주쇼"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />

        <div id="SocialBtnArea">
          <button onClick={handleReset}>초기화</button>
          <button onClick={handleSubmit}>등록 완료</button>
        </div>
      </div>
    </div>
  );
}

export default Social;
