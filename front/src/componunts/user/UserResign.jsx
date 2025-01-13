import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "../../servies/AxiosApi";

function UserResign() {


  const [userInfo, setUserInfo] = useState({
    uuid: "",
    tag_id: "",
    username: "",
    introduce: "",
    create_at: "",
    follwing:"",
    follow:"",
    introduce:"",
    contentCount:"",
    profile_path: "",
  });

  const [isAgreed, setIsAgreed] = useState(false);    // 체크박스 상태 관리
  const navigate = useNavigate();   // useNavigate 훅 초기화

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await AxiosApi.get("/user/info"); // 실제 API 엔드포인트로 변경
        const data = response.data;
        setUserInfo({
          uuid: data.uuid || "",
          tag_id: data.tag_id || "",
          username: data.username || "",
          introduce: data.introduce || "",
          create_at: data.create_at || "",
          phone: data.phone || "",
          profile_path: data.profile_path || "",
          follow: data.follow || "",
          following: data.following || "",
          contentCount: data.contentCount || "",
        });
      } catch (error) {
        console.error("유저 정보를 가져오지 못했습니다.:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleResign = async () => {
    if(!isAgreed) {
      alert("탈퇴에 동의하셔야 합니다.");
      return;
    }
    
    try {
      const response = await AxiosApi.post("/user/resign", {uuid: userInfo.uuid});
      if (response.status === 200) {
        alert("탈퇴 처리가 완료되었습니다.");
        const logoutResponse = await AxiosApi.post("/auth/logout", {});
        if (logoutResponse.status === 200) {
          navigate("/");
        }
      } else {
        alert("탈퇴 처리 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    } catch(error) {
      console.error("탈퇴 처리 실패: ", error);
      alert("탈퇴 처리 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="Resign">
      <div className="profileViewArea">
        <div className="profileImg">
          {userInfo.profileImg ? (
            <img classname="UserProfileImg" src={`/contentImage/${userInfo.profile_path}`} alt="유저 사진" />
          ) : (
            "유저 사진"
          )}
        </div>

        <div className="usertagid_nameArea">
          <div className="tagId secondLine">{userInfo.tag_id}</div>

          <div className="userName secondLine">{userInfo.username}</div>
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
          <span>{userInfo.introduce}</span>
        </div>

        <div className="joinDay contentsBox">
          <span>{userInfo.create_at}</span>
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
          <input type="checkbox" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)}/>
          <div className="resignAgree">
            <span>네,탈퇴하겠습니다.</span>
          </div>
        </div>
      </div>

      <div className="resignBtnArea">
        <button onClick={handleResign}>탈퇴</button>
      </div>
    </div>
  );
}

export default UserResign;
