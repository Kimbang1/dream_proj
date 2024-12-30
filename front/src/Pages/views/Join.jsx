import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios 추가

function Join() {
  const [Name, setName] = useState("");
  const [eMail, seteMail] = useState("");
  const [Id, setId] = useState("");
  const [Pwd, setPwd] = useState("");
  const [Rpwd, setRpwd] = useState("");
  const [Phon, setPhon] = useState("");
  const [Bday, setBday] = useState("");

  const navigate = useNavigate();

  const handleLoginClick = async () => {
    if (Pwd !== Rpwd) {
      alert("비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    // 보내는 데이터 객체
    const userData = {
      name: Name,
      email: eMail,
      id: Id,
      password: Pwd,
      phon: Phon,
      bday: Bday,
    };

    try {
      // Axios로 데이터 전송 (JSON 형식)
      const response = await axios.post(
        "http://localhost:3000/api/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json", // JSON 형식 지정
          },
        }
      );

      console.log(response.data);
      navigate("/Login"); // 회원 가입 후 로그인 페이지로 이동
    } catch (error) {
      console.error("회원 가입 실패:", error);
      alert("회원 가입에 실패했습니다. 다시 시도해주세요.");
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
          value={Name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="joinFrame"
          type="text"
          placeholder="e-mail을 입력하시오"
          value={eMail}
          onChange={(e) => seteMail(e.target.value)}
        />

        <input
          className="joinFrame"
          type="text"
          placeholder="아이디를 입력해주세요"
          value={Id}
          onChange={(e) => setId(e.target.value)}
        />

        <input
          className="joinFrame"
          placeholder="비밀번호를 입력해주세요"
          type="password"
          value={Pwd}
          onChange={(e) => setPwd(e.target.value)}
        />

        <input
          className="joinFrame"
          placeholder="비밀번호를 다시 입력해주세요"
          type="password"
          value={Rpwd}
          onChange={(e) => setRpwd(e.target.value)}
        />

        <input
          className="joinFrame"
          placeholder="전화번호를 입력해주세요"
          type="text"
          value={Phon}
          onChange={(e) => setPhon(e.target.value)}
        />

        <input
          className="joinFrame"
          placeholder="생년월일을 입력해주세요"
          type="date"
          value={Bday}
          onChange={(e) => setBday(e.target.value)}
        />

        <button id="signBtn" onClick={handleLoginClick}>
          입력 완료
        </button>
      </div>
    </div>
  );
}

export default Join;
