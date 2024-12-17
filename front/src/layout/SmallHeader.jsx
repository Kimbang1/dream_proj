import React from "react";
import "../style/smallheader.css";

function SmallHeader(){
    return(
        <div id="smallHeda">
            <div className="logo">
                <img src="/images/logo4.png" alt="로고사진  " />
            </div>
            
            <div className="managerOption">
                <img src="/images/manager.png" alt="관리자 페이지 가기" />
            </div>

            <div className="left">
                <img src="/images/bell.png" alt="" />
                <img src="/images/whale.png" alt="" />
                <img src="/images/chating.png" alt="" />
            </div>
        </div>
    );
}

export default SmallHeader;