import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "../../servies/AxiosApi";

function Join() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [tag_id, setTagId] = useState("");
  const [pwd, setPwd] = useState("");
  const [rpwd, setRpwd] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");

  const navigate = useNavigate();

  const handleLoginClick = async () => {
    if (pwd !== rpwd) {
      alert("비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    // 보내는 데이터 객체
    const userData = {
      username: username,
      email: email,
      tag_id: tag_id,
      pwd: pwd,
      phone: phone,
      birthday: birthday,
      provider: "local",
    };

    try {
      // Axios로 데이터 전송 (JSON 형식)
      const response = await AxiosApi.post("/join/local", userData);
      console.log(response.data);
      alert("회원가입 성공");
      navigate("/Login"); // 회원 가입 후 로그인 페이지로 이동
    } catch (error) {
      console.error("회원 가입 실패:", error);
      // 에러는 인터셉터에서 처리되므로 여기선 추가 처리 필요 없음
    }
  };

  return (
    <div id="background">
      <div id="joinBox">
        <span>당신의 아이디와 비밀번호를 입력해 주세요</span>

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
          placeholder="e-mail을 입력하시오"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          placeholder="비밀번호를 입력해주세요"
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />

        <input
          className="joinFrame"
          placeholder="비밀번호를 다시 입력해주세요"
          type="password"
          value={rpwd}
          onChange={(e) => setRpwd(e.target.value)}
        />

        <input
          className="joinFrame"
          placeholder="전화번호를 입력해주세요"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className="joinFrame"
          placeholder="생년월일을 입력해주세요"
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />

        <button id="signBtn" onClick={handleLoginClick}>
          입력 완료
        </button>
      </div>
    </div>
  );
}

export default Join;
