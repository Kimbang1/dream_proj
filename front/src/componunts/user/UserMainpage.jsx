import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AxiosApi from "../../servies/AxiosApi";
import ViewChoice from "../layout/ViewChoice";
import FollowFC from "../../config/FollowFC";

function UserMainpage() {
  const location = useLocation();
  const { uuid } = location.state || {}; // 전달받은 타겟 UUID
  const loggedInUuid = localStorage.getItem("uuid"); // 로그인한 사용자의 UUID 가져오기
  const [isSameUser, setIsSameUser] = useState(false); // 기본적으로 false로 설정
  const [user, setUser] = useState({
    profile_image: "",
    user: {
      uuid: "",
      tag_id: "",
      username: "",
      introduce: "",
      postCount: 0,
    },
    followerCount: 0,
    followingCount: 0,
    isFollowing: false, // 팔로우 상태 추가
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
      console.log("API 응답 데이터:", response.data);

      setUser(response.data);

      // 서버에서 받은 isSameUser 값으로 설정
      setIsSameUser(response.data.isSameUser); // 서버 응답에서 제공되는 isSameUser 값 사용
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 팔로우 상태 업데이트 함수
  const handleFollowChange = (isFollowing) => {
    setUser((prevState) => ({
      ...prevState,
      isFollowing: isFollowing, // 팔로우 상태 업데이트
      followerCount: isFollowing
        ? prevState.followerCount + 1
        : prevState.followerCount - 1,
    }));
  };

  // uuid 변경 시 데이터 로드
  useEffect(() => {
    if (uuid) {
      // 데이터를 불러오기 전에 상태를 초기화
      setUser({
        profile_image: "",
        user: { tag_id: "", username: "", introduce: "" },
         postCount: 0,
        followerCount: 0,
        followingCount: 0,
      });

      fetchData(uuid); // 전달받은 uuid에 따라 데이터 로드
    } else {
      console.warn("UUID가 없습니다.");
    }

    fetchData(uuid); // 전달받은 uuid에 따라 데이터 로드
  }, [uuid]);

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
                      <div className="userName">
                        <span>@{user.user.tag_id}</span>
                      </div>
                      {/* 내 프로필이 아니면 팔로우 버튼이 뜨게 */}
                      {!isSameUser && (
                        <FollowFC
                          targetUuid={uuid}
                          isFollowing={user.isFollowing} // 팔로우 상태 전달
                          onFollowChange={handleFollowChange}
                        />
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
                        게시물: {user.postCount}개
                      </div>
                      <div className="followerCount">
                        팔로워 {user.followerCount}
                      </div>
                      <div className="followingCount">
                        팔로우 {user.followingCount}
                      </div>
                    </div>

                    <div className="ThirdLayer">
                      <div className="userName">
                        <span>{user.user.username}</span>
                      </div>
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
