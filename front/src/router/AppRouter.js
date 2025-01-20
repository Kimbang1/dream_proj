import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// react-router-dom을 사용하기 위해 API import
import pageRoutes from "./routes/PageRoutes";
import userRoutes from "./routes/UserRoutes";
import Layout from "../componunts/layout/LayoutCP";
import LandingRoutes from "../router/routes/LandingRoutes";
import AdminRoutes from "../router/routes/AdminRoutes";
import ChatingRouter from "../router/routes/ChatingRouters";

function AppRouter() {
  // 모든 라우트를 병합
  const allRoutes = [...pageRoutes, ...userRoutes];

  return (
    <Router>
      <Routes>
        {LandingRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}

        {/* Layout을 사용하여 공통 레이아웃 적용 */}
        <Route element={<Layout />}>
          {allRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}

          {/* userRoutes */}
          {userRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}

          {/* AdminRoutes */}
          {AdminRoutes.map((route, index) => {
            return (
              <Route key={index} path={route.path} element={route.element} />
            );
          })}

        {/* 채팅라우터 */}
        {ChatingRouter.map((route, index) => {
          return<Route key={index} path={route.path} element={route.element} />
        })}
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
