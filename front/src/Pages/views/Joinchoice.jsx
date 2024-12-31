import React, { useState } from "react";
import Join from "./Join";
import { useNavigate } from "react-router-dom";
function Joinchoice() {

    const navigate = useNavigate();
    const Localhandle= ()=>{
        navigate("/join");
    }
  return (
    <div className="background">
      <div className="choiceAreaBox">
        <div className="localArea">
          <button onClick={Localhandle} class="local">
            Whales
          </button>
        </div>
        <hr />
        <div id="socialArea">
          <button class="social">Naver</button> {/*onClick={}*/}
     
          <button class="social">kakao</button> {/*onClick={}*/}
       
          <button class="social">google</button> {/*onClick={}*/}
        </div>
      </div>
    </div>
  );
}

export default Joinchoice;
