import React from "react";
import Gallery1 from "../../Pages/views/Gallery";

function UserMainpage() {
  return (
    <div className="userpage">
      <div className="viewChoiceBtn_view">

        <div className="BtnAreaChoice">
          <button className="choice">
            <img
              className="Btnicon"
              src="/images/PostHome.png"
              alt="포스트 홈"
            />
          </button>

          <button className="choice">
            <img
              className="Btnicon"
              src="/images/GarrelyHome.png"
              alt="갤러리 홈"
            />
          </button>
        </div>

        <div id="ViewArea">
          <Gallery1 />
        </div>
      </div>

        <div className="rightAside">
          <div className="Frame">
            
          </div>
        </div>

    </div>
  );
}

export default UserMainpage;
