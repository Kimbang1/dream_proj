import AxiosApi from "../../servies/AxiosApi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Social() {
  const [username, setUserName] = useState("");
  const [tag_id, setTagId] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");

  const navigate = useNavigate();

  const handleReset = ()=>{
    setUserName("");
    setTagId("");
    setPhone("");
    setBirthday("");
  }
  const handleSubmit = async () => {
    // 사용자 데이터 준비
    const userData = {
      username: username,
      tag_id: tag_id,
      phone: phone,
      birthday: birthday,
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
