import React, { useEffect, useState } from "react";

function UserResign() {


  const [userInfo, setUserInfo] = useState({
    tagId: "",
    userName: "",
    introduce: "",
    joinDate: "",
    follwing:"",
    follow:"",
    introduce:"",
    contentCount:"",
    profileImage: "",
  });

  useEffect(()=>{
    //유저 정보를 가져오는 api호출
    fetch("/api/user_info") //적절한 API엔드포인트로 변경
    .then((response)=>response.json())
    .then((data)=>{
      setUserInfo(data);  //상태 업데이트
    })
    .catch((error) => console.error("유저의 데이터에 페칭을 하지 못했습니다:",error));
  },[]);
  return (
    <div className="Resign">
      <div className="profileViewArea">
        <div className="profileImg">
          {/* {userInfo.profileImg ? (
            <img classname="UserProfileImg" src={userInfo.profileImg} alt="유저 사진" />
          ) : (
            "유저 사진"
          )} */}
          유저사진
        </div>

        <div className="usertagid_nameArea">
          <div className="tagId secondLine">{userInfo.tagId}tagId</div>

          <div className="userName secondLine">{userInfo.userName}유저이름</div>
        </div>

        <div className="followCont_content">

          <div className="follow_following">
            <div className="follow thirdLine">{userInfo.follow}팔로우</div>
            <div className="following thirdLine">{userInfo.follwing}팔로잉</div>
          </div>

          <div className="contentCount">
           {userInfo.contentCount} 게시물수
          </div>
        </div>

      </div>

      <div className="middleArea">

        <div className="usercontent contentsBox">
          <span>{userInfo.introduce}
            유저 소개글 안녕하세요</span>
        </div>

        <div className="joinDay contentsBox">
          <span>{userInfo.joinDate}가입날짜</span>
        </div>

        <div className="resignContent contentsBox">
          <span>
            위 계정을 정말로 탈퇴하시겠습니까?
            <br />
            탈퇴 후 N일까지의 데이터가 보관되며 N일 후 계정을 복구할 수
            없습니다.
          </span>
        </div>

        <div className="agreeArea">
          <input type="checkbox" />
          <div className="resignAgree">
            <span>네,탈퇴하겠습니다.</span>
          </div>
        </div>
      </div>

      <div className="resignBtnArea">
        <button>탈퇴</button>
      </div>
    </div>
  );
}

export default UserResign;
