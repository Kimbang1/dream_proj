import React from "react";
// react-router-dom을 사용하기 위해 API import
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Mainview from "../Mainview";
import Alarm from "../Pages/Alarm";
import Login from "../Pages/Login";
import SmallHeader from "../layout/SmallHeader";

// Router라는 함수 만든 뒤 아래와 같이 작성
// BrowserRouter를 Router로 감싸는 이유: SPA의 장점인 브라우저 새로고침 없이 다른 페이지로 이동이 가능해진다.
function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mainview />} />
        <Route path="/login" element={<Login />} />
        <Route path="/alarm" element={<Alarm />} />
        <Route path="/Sv" element={<SmallHeader />} />

      </Routes>
    </BrowserRouter>
  );
}

export default Router;
