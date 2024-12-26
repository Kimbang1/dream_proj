import React from "react";
import { useMediaQuery } from "react-responsive";
import "../style/Style.css";
import ChangeHeader from "./ChangeHeader";
import Leftaside from "../componunts/layout/Leftaside";
import Bottom from "../componunts/layout/BottomNav";
import Gallery from "../Pages/views/Gallery";

function App() {
  const HiddenAside = useMediaQuery({ maxWidth: 640 });

  const sft = useMediaQuery({ maxWidth: 640 });

  /*
  하단 1택
  작을때 추가

  메인뷰
  갤러리, 포스트

  */

  return (
    <div id="wrap">
      <div id="left">{!HiddenAside && <Leftaside />}</div>

      <div id="line"> </div>

      <div id="right">
        <div id="head">
          <ChangeHeader />
        </div>

        <div className="mainview">
          <Gallery />
        </div>

        <div className="footerview">{sft && <Bottom />}</div>
      </div>
    </div>
  );
}

export default App;