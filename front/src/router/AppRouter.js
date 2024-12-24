import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// react-router-dom을 사용하기 위해 API import
import pageRoutes from "./routes/PageRoutes";
import userRoutes from "./routes/UserRoutes";

// Router라는 함수 만든 뒤 아래와 같이 작성
// BrowserRouter를 Router로 감싸는 이유: SPA의 장점인 브라우저 새로고침 없이 다른 페이지로 이동이 가능해진다.

function AppRouter() {
  // 모든 라우트를 병합
  const allRoutes = [...pageRoutes, ...userRoutes];

  return (
    <Router>
      <Routes>
        {allRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={<route.component />} />
        ))}
      </Routes>
    </Router>
  );
}

export default AppRouter;
