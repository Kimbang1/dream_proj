import React from "react";
import "./style/style.css";
import ChangeHeader from "./ChangeHeader";
import Leftaside from "./layout/Leftaside";
import { useMediaQuery } from "react-responsive";

function App() {
  const HiddenAside = useMediaQuery({ maxWidth:750 });

  /*
  하단 1택
  작을때 추가

  메인뷰
  갤러리, 포스트

  */

  return (
    <div id="wrap">
      <div id="left">{!HiddenAside && <Leftaside />}</div>

      <div id="right">
        <div id="head">
          <ChangeHeader />
        </div>

        <div className="mainview">메인 뷰</div>
      </div>
    </div>
  );
}

export default App;
