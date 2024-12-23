import React from "react";
// react-router-dom을 사용하기 위해 API import
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Mainview from "../Mainview";
import Alarm from "../Pages/Alarm";
import Join from "../Pages/user/Join";
import Login from "../Pages/user/Login";
import Landing from "../Pages/landingpage/Landing";
import "../style/style.css";

// Router라는 함수 만든 뒤 아래와 같이 작성
// BrowserRouter를 Router로 감싸는 이유: SPA의 장점인 브라우저 새로고침 없이 다른 페이지로 이동이 가능해진다.
function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Join" element={<Join />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/alarm" element={<Alarm />} />
        <Route path="/Mainview" element={<Mainview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
