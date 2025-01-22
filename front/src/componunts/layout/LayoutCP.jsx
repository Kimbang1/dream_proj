import React, { useState } from "react";
import ChangeHeader from "../../Pages/views/ChangeHeader";
import Leftaside from "../layout/Leftaside";
import Bottom from "../layout/BottomNav";
import { useMediaQuery } from "react-responsive";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Chatting from "../../Pages/chatingPage/ChatingPage";
import ViewChoice from "./ViewChoice";

const Layout = () => {
  const HiddenAside = useMediaQuery({ maxWidth: 640 });
  const sft = useMediaQuery({ maxWidth: 640 });

  const [isMainPage, setIsMainPage] = useState(true);
  const [isChatting, setIsChatting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로를 확인하기 위한 hook

  const handleChatClick = () => {
    setIsChatting(true);
    navigate("/chatting"); // 채팅 페이지로 강제로 이동
  };

  // 특정 경로에서 헤더를 숨기기 위한 조건
  const hideHeaderPaths = ["/chatting", "/UserList"]; // 헤더를 숨기고 싶은 경로 목록
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <div id="wrap">
      <div id="left">
        {!HiddenAside && (
          <Leftaside
            setIsMainPage={setIsMainPage}
            setIsChatting={setIsChatting}
          />
        )}
      </div>

      <div id="right">
        {!isChatting ? (
          // 채팅 상태가 아니면 기존 콘텐츠 렌더링
          <>
            {/* 특정 경로에서만 헤더 렌더링 */}
            {!shouldHideHeader && (
              <div id="head">
                <ChangeHeader setIsMainPage={setIsMainPage} />
              </div>
            )}

            <div className="viewArea">
              {!isMainPage && (
                <div className="ChoiceBtn">
                  <ViewChoice />
                </div>
              )}
              {isMainPage && <Outlet />} {/* Outlet으로 다른 페이지 표시 */}
            </div>
          </>
        ) : (
          <Chatting /> // 채팅 상태일 때 채팅 컴포넌트 렌더링
        )}
      </div>

      <div className="footerview">
        {sft && <Bottom setIsMainPage={setIsMainPage} />}
      </div>
    </div>
  );
};

export default Layout;
