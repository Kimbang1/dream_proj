import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "../../servies/AxiosApi";
import useEnter from "../../hook/useEnterky";
import useValidation from "../../hook/useValidation";

function Join() {
  const { errors, validate } = useValidation();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [tag_id, setTagId] = useState("");
  const [pwd, setPwd] = useState("");
  const [rpwd, setRpwd] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");

  const navigate = useNavigate();

  const handleJoinClick = async () => {
    const fields = { username, email, tag_id, pwd, rpwd, phone, birthday };

    if (!validate(fields)) {
      // 유효성 검사 실패 시 알람 메시지
      alert("입력 정보를 다시 확인해주세요.");
      return;
    }

    if (pwd !== rpwd) {
      alert("비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    const userData = {
      username,
      email,
      tag_id,
      pwd,
      phone,
      birthday,
      provider: "local",
    };

    try {
      const response = await AxiosApi.post("/join/local", userData);
      console.log(response.data);
      alert("회원가입 성공");
      navigate("/Login");
    } catch (error) {
      console.error("회원 가입 실패:", error);
    }
  };

  useEnter(handleJoinClick);

  return (
    <div id="background">
      <div id="joinBox">
        <span>당신의 아이디와 비밀번호를 입력해 주세요</span>

        <input
          className={`joinFrame ${errors.username ? "error" : ""}`}
          type="text"
          placeholder="이름을 입력하시오"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />

        <input
          className={`joinFrame ${errors.email ? "error" : ""}`}
          type="text"
          placeholder="e-mail을 입력하시오"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className={`joinFrame ${errors.tag_id ? "error" : ""}`}
          type="text"
          placeholder="태그 아이디입력 20자,!, @, #, ^만 가능"
          value={tag_id}
          onChange={(e) => setTagId(e.target.value)}
        />

        <input
          className={`joinFrame ${errors.pwd ? "error" : ""}`}
          placeholder="비밀번호를 입력해주세요"
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />

        <input
          className={`joinFrame ${errors.rpwd ? "error" : ""}`}
          placeholder="비밀번호를 다시 입력해주세요"
          type="password"
          value={rpwd}
          onChange={(e) => setRpwd(e.target.value)}
        />

        <input
          className={`joinFrame ${errors.phone ? "error" : ""}`}
          placeholder="전화번호를 입력해주세요"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className={`joinFrame ${errors.birthday ? "error" : ""}`}
          placeholder="생년월일을 입력해주세요"
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />

        <button id="signBtn" onClick={handleJoinClick}>
          입력 완료
        </button>
      </div>
    </div>
  );
}

export default Join;
