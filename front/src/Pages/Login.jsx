import React, { useState } from "react";
import "../style/loginStyle.css";

function Login() {
  const [Name, setName] = useState("");
  const [eMail, seteMail] = useState("");
  const [Id, setId] = useState("");
  const [Pwd, setPwd] = useState("");
  const [Rpwd, setRpwd] = useState("");
  const [Phon, setPhon] = useState("");
  const [Bday, setBday] = useState("");

  return (
    <div id="background">
      <div id="loginBox">
        <span>당신의 아이디와 비밀번호를 입력해 주세요</span>

        <input
          class="loginFrame"
          type="text"
          placeholder="이름을 입력하시오"
          value={Name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />

        <input
          class="loginFrame"
          type="text"
          placeholder="e-mail을 입력하시오"
          value={eMail}
          onChange={(e) => {
            seteMail(e.target.value);
          }}
        />

        <input
          class="loginFrame"
          type="text"
          placeholder="아이디를 입력해주세요"
          value={Id}
          onChange={(e) => {
            setId(e.target.value);
          }}
        />

        <input
          class="loginFrame"
          placeholder="비밀번호를 입력해주세요"
          type="password"
          value={Pwd}
          onChange={(e) => {
            setPwd(e.target.value);
          }}
        />

        <input
          class="loginFrame"
          placeholder="비밀번호를 다시 입력해주세요"
          type="password"
          value={Rpwd}
          onChange={(e) => {
            setRpwd(e.target.value);
          }}
        />

        <input
          class="loginFrame"
          placeholder="전화번호를 입력해주세요"
          type="text"
          value={Phon}
          onChange={(e) => {
            setPhon(e.target.value);
          }}
        />

        <input
          class="loginFrame"
          placeholder="생년월일을 입력해주세요"
          type="date"
          value={Bday}
          onChange={(e) => {
            setBday(e.target.value);
          }}
        />

        <button
          id="signBtn"
          onClick={
            () => alert(`ID: ${Id}, Password: ${Pwd}`)
            /*수정예정*/
          }
        >
          sign in
        </button>
      </div>
    </div>
  );
}

export default Login;
