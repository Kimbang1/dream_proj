import React from "react";
import Header from "./layout/Header";
import SmallHeader from "./layout/SmallHeader";
import { useMediaQuery } from "react-responsive";
  /*
  화면 2택
  클때랑 작을때
  */
function ChageHeader() {
  const isSmallscrean = useMediaQuery({ maxWidth: 640 });
  return <>{isSmallscrean ? <SmallHeader /> : <Header />}</>;
}

export default ChageHeader;
