// LayoutCP.jsx
import React from "react";
import ChangeHeader from "../../Pages/views/ChangeHeader";
import Leftaside from "../layout/Leftaside";
import Bottom from "../layout/BottomNav";
import { useMediaQuery } from "react-responsive";
import { Outlet } from "react-router-dom"; 

const Layout = () => {
  const HiddenAside = useMediaQuery({ maxWidth: 640 });
  const sft = useMediaQuery({ maxWidth: 640 });

  return (
    <div id="wrap">
      <div id="left">{!HiddenAside && <Leftaside />}</div>

      <div id="line"> </div>

      <div id="right">
        <div id="head">
          <ChangeHeader />
        </div>

        <div className="mainview">
          <Outlet /> {/* Outlet을 통해 하위 라우트 렌더링 */}
        </div>

        <div className="footerview">{sft && <Bottom />}</div>
      </div>
    </div>
  );
};

export default Layout;
