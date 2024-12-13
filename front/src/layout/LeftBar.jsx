import React from "react";
import "../style/style.css";


function LeftSidebar() {
  return (
    <div id="leftSlidebar">
      <div id="userimage">
        <img src="/images/cat.jpg" alt="임시 사진" />
      </div>

      <div id="frame2">
        <div id="nameLabel">
          <span>username</span>
        </div>

        <div id="postFollowframe">
          <div className="smallP_F">
            <span className="title">Post</span>
            <span className="content">n 개</span>
          </div>

          <div className="smallP_F">
            <span className="title">Follower</span>
            <span className="content">n 명</span>
          </div>
        </div>

        <div id="myFagebtnArea">
          <button type="button">마이페이지</button>
        </div>
      </div>
    </div>
  );
}

export default LeftSidebar;
