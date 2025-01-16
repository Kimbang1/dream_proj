import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "../../servies/AxiosApi";
import ViewChoice from "../layout/ViewChoice";
import AlarmPage from "../../Pages/views/AlramPage";

function UserMainpage() {
  const [user, setUser] = useState({
    profile_image: "",
    user: {
      tag_id: "",
      username: "",
      introduce: "",
    },
  }); //불러올 데이터
  const [isAlramOpen, setIsAlramOpen] = useState(false); // 알림 모달 상태

  const rightaside = { maxwidth: 300 };
  const navigate = useNavigate();
  const UserEditHandle = () => {
    navigate("/Useredit");
  };

  //데이터 로드 함수
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosApi.get("/user/info"); //실제 API엔트포인트로 바꿔야함.
        setUser(response.data);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="UserFrame">
      <div className="userpage">
        <div className="viewChoiceBtn_view">
          {/* 프로필화면 상단 */}

          <div className="ProfileArea">
            <div className="PrImgArea">
              <img
                src={`/profileImage/${user.profile_image}`} alt="고양이 이미지"/>
            </div>

            <div className="InfoArea">
              <div className="useDetails">
                <div className="FirstLayer">
                  <div className="userName">@{user.user.tag_id}</div>

                  <button className="editProfileBtn" onClick={UserEditHandle}>
                    프로필 수정
                  </button>
                </div>

                <div className="SecondLayer">
                  <div className="postCount">게시물:{user.user.postCount}개</div>
                  <div className="followerCount">
                    팔로우{user.followerCount}
                  </div>
                  <div className="followingCount">
                    팔로워{user.followingCount}
                  </div>
                </div>

                <div className="ThirdLayer">
                  <div className="userName">{user.user.username}</div>
                  <div className="userContent">{user.user.introduce}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ViewChoiceArea">
          <ViewChoice />
        </div>
      </div>
    </div>
  );
}

export default UserMainpage;
