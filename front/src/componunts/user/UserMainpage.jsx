import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AxiosApi from "../../servies/AxiosApi";
import ViewChoice from "../layout/ViewChoice";
import FollowFC from "../../config/FollowFC";

function UserMainpage() {
  const location = useLocation();
  const { uuid } = location.state || {}; // 전달받은 uuid
  const [isSameUser, setIsSameUser] = useState(true); // 기본적으로 내 계정으로 설정
  const [user, setUser] = useState({
    profile_image: "",
    user: {
      tag_id: "",
      username: "",
      introduce: "",
      postCount: 0,
    },
    followerCount: 0,
    followingCount: 0,
  }); // 불러올 데이터
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const navigate = useNavigate();

  const UserEditHandle = () => {
    navigate("/Useredit");
  };

  // 데이터 로드 함수
  const fetchData = async (targetUuid) => {
    setIsLoading(true); // 로딩 시작
    try {
      const response = await AxiosApi.get(`/user/info?uuid=${targetUuid}`); // API 호출
      console.log("uuid가 잘 타겟팅 된건가?:", targetUuid);
      setUser(response.data);

      // 자신의 계정인지 확인
      if (response.data.user.uuid === targetUuid) {
        setIsSameUser(true);
      } else {
        setIsSameUser(false);
      }
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // uuid 변경 시 데이터 로드
  useEffect(() => {
    if (uuid) {
      // 데이터를 불러오기 전에 상태를 초기화
      setUser({
        profile_image: "",
        user: { tag_id: "", username: "", introduce: "", postCount: 0 },
        followerCount: 0,
        followingCount: 0,
      });

      fetchData(uuid); // 전달받은 uuid에 따라 데이터 로드
    } else {
      console.warn("UUID가 없습니다.");
    }
  }, [uuid]);

  // 컴포넌트 언마운트 시 상태 초기화
  useEffect(() => {
    return () => {
      setUser({
        profile_image: "",
        user: { tag_id: "", username: "", introduce: "", postCount: 0 },
        followerCount: 0,
        followingCount: 0,
      });
      setIsSameUser(true);
    };
  }, []);

  return (
    <div className="UserFrame">
      <div className="userpage">
        {isLoading ? (
          <div>로딩 중...</div> // 로딩 상태 표시
        ) : (
          <>
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
                      {!isSameUser && (
                        <FollowFC setIsSameUser={setIsSameUser} />
                      )}
                      {/* 내 계정이라면 수정 버튼만 표시 */}
                      {isSameUser && (
                        <button
                          className="editProfileBtn"
                          onClick={UserEditHandle}
                        >
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
          </>
        )}
      </div>
    </div>
  );
}

export default UserMainpage;
