import axios from "axios";
import React, { useEffect, useState } from "react";
import UserResign from "./UserResign";

function Useredit() {
  const [isOnresign, setIsOnresign] = useState(false); // 초기값 false 설정

  // 탈퇴 버튼 클릭 시 화면 전환
  const resignClick = () => {
    setIsOnresign(true); // 탈퇴 화면으로 전환
  };

  // 유저 정보 상태 관리
  const [userInfo, setUserInfo] = useState({
    tagId: "",
    userName: "",
    introduce: "",
    phoneNum: "",
    profileImage: "",
  });

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // 수정 완료 버튼 클릭 시 처리
  const handleSave = async () => {
    try {
      await axios.put("/api/user/update", userInfo); // 실제 API 엔드포인트로 변경
      alert("수정 완료!");
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정 실패!");
    }
  };

  // API를 통해 유저 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user/details"); // 실제 API 엔드포인트로 변경
        const data = response.data;
        setUserInfo({
          tagId: data.tagId || "",
          userName: data.userName || "",
          introduce: data.introduce || "",
          phoneNum: data.phoneNum || "",
          profileImage: data.profileImage || "",
        });
      } catch (error) {
        console.error("유저 정보를 가져오지 못했습니다.:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="editProfile">
      {/* 탈퇴 화면 */}
      {isOnresign && <UserResign />}

      {/* 유저 프로필 화면 (isOnresign이 false일 때만 렌더링) */}
      {!isOnresign && (
        <>
          <div className="imgArea">
            <img
              src={userInfo.profileImage || "/default-profile.png"}
              alt="프로필사진"
            />
          </div>

          <div className="tagIdArea label">
            <input
              type="text"
              name="tagId"
              value={userInfo.tagId}
              onChange={handleChange}
              placeholder="태그 ID를 입력하세요"
            />
          </div>
          <div className="useNameArea label">
            <input
              type="text"
              name="userName"
              value={userInfo.userName}
              onChange={handleChange}
              placeholder="사용자 이름을 입력하세요"
            />
          </div>
          <div className="introDuceArea label">
            <textarea
              name="introduce"
              maxLength={300} // 글자수 제한
              value={userInfo.introduce}
              onChange={handleChange}
              placeholder="자기소개를 입력하세요"
            ></textarea>
            <p>{userInfo.introduce.length}/300자</p>
          </div>
          <div className="phonNumArea label">
            <input
              type="text"
              name="phoneNum"
              value={userInfo.phoneNum}
              onChange={handleChange}
              placeholder="전화번호를 입력하세요"
            />
          </div>
        </>
      )}

      {/* 버튼 영역 */}
      <div className="BtnArea">
        {!isOnresign && <button onClick={resignClick}>탈퇴</button>}
        {!isOnresign && <button onClick={handleSave}>수정 완료</button>}
      </div>
    </div>
  );
}

export default Useredit;
