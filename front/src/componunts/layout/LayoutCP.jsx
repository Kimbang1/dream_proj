// LayoutCP.jsx
import React, { useState } from "react";
import ChangeHeader from "../../Pages/views/ChangeHeader";
import Leftaside from "../layout/Leftaside";
import Bottom from "../layout/BottomNav";
import { useMediaQuery } from "react-responsive";
import { Outlet } from "react-router-dom";

import RightAside from "./RightAside";
import ViewChoice from "./ViewChoice";

const Layout = () => {
  const HiddenAside = useMediaQuery({ maxWidth: 640 });
  const sft = useMediaQuery({ maxWidth: 640 });

  // const [isUserMainPage, setIsUserMainPage] = useState(false); //프로필 페이지 여부 상태
  const [isMainPage, setIsMainPage] = useState(true);
  return (
    <div id="wrap">
      <div id="left">
        {!HiddenAside && <Leftaside setIsMainPage={setIsMainPage} />}{" "}
        {/* setIsUserMainPage 전달 */}
      </div>

      <div id="right">
        <div id="head">
          <ChangeHeader setIsMainPage={setIsMainPage} />
        </div>

        <div className="viewArea">
          {!isMainPage && (
            <>
              {/* //프로필 페이지가 아닐때만 렌더링 */}
              <div className="ChoiceBtn">
                <ViewChoice />
              </div>
              <div className="RightAside">
                <RightAside />
              </div>
            </>
          )}
          {isMainPage && <Outlet />} {/*프로필 페이지를 보여줌*/}
        </div>
      </div>
      <div className="footerview">
        {sft && <Bottom setIsMainPage={setIsMainPage} />}
      </div>
    </div>
  );
};

export default Layout;
