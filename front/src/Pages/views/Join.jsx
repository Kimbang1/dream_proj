import React, { useState } from "react";
// import "../style/user/JoinStyle.css";
import { useNavigate } from "react-router-dom";
//페이지 이동을 위한 훅

function Join() {
  const [Name, setName] = useState("");
  const [eMail, seteMail] = useState("");
  const [Id, setId] = useState("");
  const [Pwd, setPwd] = useState("");
  const [Rpwd, setRpwd] = useState("");
  const [Phon, setPhon] = useState("");
  const [Bday, setBday] = useState("");

  // console.log("이름:", Name);
  // console.log("이메일:", eMail);
  // console.log("@아이디:", Id);
  // console.log("비번:", Pwd);
  // console.log("비번확인:", Rpwd);
  // console.log("전화번호:", Phon);
  // console.log("생년월일:", Bday);

  const navigate = useNavigate();
  //useNavigate사용을 위한 선언

  const handleLoginClick = () => {
    navigate("/Login"); //회원
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
          onChange={(e) => {
            setName(e.target.value);
          }}
        />

        <input
          className="joinFrame"
          type="text"
          placeholder="e-mail을 입력하시오"
          value={eMail}
          onChange={(e) => {
            seteMail(e.target.value);
          }}
        />

        <input
          className="joinFrame"
          type="text"
          placeholder="아이디를 입력해주세요"
          value={Id}
          onChange={(e) => {
            setId(e.target.value);
          }}
        />

        <input
          className="joinFrame"
          placeholder="비밀번호를 입력해주세요"
          type="password"
          value={Pwd}
          onChange={(e) => {
            setPwd(e.target.value);
          }}
        />

        <input
          className="joinFrame"
          placeholder="비밀번호를 다시 입력해주세요"
          type="password"
          value={Rpwd}
          onChange={(e) => {
            setRpwd(e.target.value);
          }}
        />

        <input
          className="joinFrame"
          placeholder="전화번호를 입력해주세요"
          type="text"
          value={Phon}
          onChange={(e) => {
            setPhon(e.target.value);
          }}
        />

        <input
          className="joinFrame"
          placeholder="생년월일을 입력해주세요"
          type="date"
          value={Bday}
          onChange={(e) => {
            setBday(e.target.value);
          }}
        />

        <button id="signBtn" onClick={handleLoginClick /*수정예정*/}>
          입력 완료
        </button>
      </div>
    </div>
  );
}

export default Join;
