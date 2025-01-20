import React from "react";
import { useNavigate } from "react-router-dom";

function ChatingList() {

    const navigator = useNavigate("");


  return (
    <>
      <div className="chatingList">
        {/*설정과 광고가 들어가는 영역 */}
        <div className="functionTools">
            <div className="advertisement"></div>
            <div className="Tools">
                <img src="" alt="" />
            </div>
        </div>
        <div className="chatingBoxes"
            onClick={()=>{
                console.log("채팅방 입장~");
                navigator("/ChatRoom");
            }}
        >
          <dib className="reftArea">
            <img
              className="chatingPro"
              // src={`/profileImage/${user.up_filename}`}
              // alt={`${user?.username} 이미지`}
            />
            <span className="chatinNames">채팅방 이름</span>
          </dib>

          <div className="CameraArea">
            <img src="/camera.png" alt="카메라사진" />
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatingList;
