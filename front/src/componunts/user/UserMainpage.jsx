import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AxiosApi from "../../servies/AxiosApi";
import ViewChoice from "../layout/ViewChoice";
import FollowFC from "../../config/FollowFC";

function UserMainpage() {
  const location = useLocation();
  const { uuid } = location.state || {};
  const [isSameUser, setIsSameUser] = useState(true); // 기본적으로 내 계정으로 설정

  console.log("Received UUID:", uuid, "Type:", typeof uuid);
  const [user, setUser] = useState({
    profile_image: "",
    user: {
      tag_id: "",
      username: "",
      introduce: "",
    },
  }); // 불러올 데이터
  const [isAlramOpen, setIsAlramOpen] = useState(false); // 알림 모달 상태

  const rightaside = { maxwidth: 300 };
  const navigate = useNavigate();
  const UserEditHandle = () => {
    navigate("/Useredit");
  };

  // 데이터 로드 함수
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosApi.get(`/user/info?uuid=${uuid}`); // 실제 API 엔드포인트로 바꿔야 함
        setUser(response.data);

        // 받은 데이터로 사용자 정보 비교하여 isSameUser 상태 설정
        if (response.data.user.uuid === uuid) {
          console.log("가져오는 값이 무엇이냐", response.data.user.uuid);
          setIsSameUser(true); // 자신의 계정이면 true
        } else {
          setIsSameUser(false); // 상대 계정이면 false
        }
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };
    if (uuid) {
      fetchData();
    }
  }, [uuid]);

  return (
    <div className="UserFrame">
      <div className="userpage">
        <div className="viewChoiceBtn_view">
          {/* 프로필 화면 상단 */}

          <div className="ProfileArea">
            <div className="PrImgArea">
              <img
                src={`/profileImage/${user.profile_image}`}
                alt="프로필 이미지"
              />
            </div>

            <div className="InfoArea">
              <div className="useDetails">
                <div className="FirstLayer">
                  <div className="userName">@{user.user.tag_id}</div>
                  {/* 내 프로필이 아니면 팔로우 버튼이 뜨게 */}
                  {!isSameUser && <FollowFC setIsSameUser={setIsSameUser} />}
                  {/* 내 계정이라면 수정 버튼만 표시 */}
                  {isSameUser && (
                    <button className="editProfileBtn" onClick={UserEditHandle}>
                      프로필 수정
                    </button>
                  )}
                </div>

                <div className="SecondLayer">
                  <div className="postCount">
                    게시물: {user.user.postCount}개
                  </div>
                  <div className="followerCount">
                    팔로우 {user.followerCount}
                  </div>
                  <div className="followingCount">
                    팔로워 {user.followingCount}
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
          <ViewChoice uuid={uuid} />
        </div>
      </div>
    </div>
  );
}

export default UserMainpage;
