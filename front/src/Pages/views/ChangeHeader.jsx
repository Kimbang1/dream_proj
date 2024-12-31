import React from "react";
import Header from "../../componunts/layout/Header";
import SmallHeader from "../../componunts/layout/SmallHeader";
import { useMediaQuery } from "react-responsive";
/*
  화면 크기에 따라 다른 헤더를 표시
  - 320px 이상 750px 미만: SmallHeader
  - 750px 이상: Header
*/
function ChageHeader({ setIsUserMainPage }) {
  // const isSmallScreen = useMediaQuery({ maxWidth: 749 });
  const isLargeScreen = useMediaQuery({ minWidth: 750 });

  return (
    <>
      {isLargeScreen ? (
        <Header setIsUserMainPage={setIsUserMainPage} />
      ) : (
        <SmallHeader setIsUserMainPage={setIsUserMainPage} />
      )}
    </>
  );
}
export default ChageHeader;
