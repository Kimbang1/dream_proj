import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import UserResign from "./UserResign";

function Useredit() {
  const [isOnresign, setIsOnresign] = useState(false); // 초기값 false 설정
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null); // 파일 입력 참조

  // 탈퇴 버튼 클릭 시 화면 전환
  const resignClick = () => {
    setIsOnresign(true); // 탈퇴 화면으로 전환
  };

  // 이미지 미리보기 해제 처리
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // 프로필 사진 선택 핸들러
  const profilehandle = (e) => {
    const selectFile = e.target.files[0];

    if (!selectFile) {
      // 사진 선택하지 않은 경우 기본 이미지 설정
      setImagePreview("/profileImage/defaultProfile.png");
      return;
    }

    // 이미지 형식 및 파일 크기 확인
    const validTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/heic",
      "image/webp",
    ];
    const maxSize = 30 * 1024 * 1024; // 30MB
    if (selectFile.size > maxSize || !validTypes.includes(selectFile.type)) {
      alert("파일이 너무 크거나 지원하지 않는 형식입니다.");
      return;
    }

    // 이전 미리보기 URL 해제
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    // 새로운 미리보기 URL 생성
    const previewURL = URL.createObjectURL(selectFile);
    setImagePreview(previewURL);
  };

  // 미리보기 영역 클릭 시 파일 선택 창 열기
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 숨겨진 파일 입력창을 클릭
    }
  };

  // 유저 정보 상태 관리
  const [userInfo, setUserInfo] = useState({
    tag_id: "",
    username: "",
    introduce: "",
    phone: "",
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
      await axios
        .put("/user/update", userInfo) // 실제 API 엔드포인트로 변경
        .then((response) => console.log(response))
        .catch((error) => console.error("Error:", error));
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
        const response = await axios.get("/user/info"); // 실제 API 엔드포인트로 변경
        const data = response.data;
        setUserInfo({
          tag_id: data.tag_id || "",
          username: data.username || "",
          introduce: data.introduce || "",
          phone: data.phone || "",
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
          <div className="ProfileimgArea">
            {/* 미리보기 이미지 */}
            <div className="miribogi" onClick={handleImageClick}>
              <img
                src={imagePreview || "/profileImage/defaultProfile.png"}
                alt="프로필 미리보기"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
              <img src="/images/profiletrade.png" alt="교체아이콘" className="trade" />

            {/* 파일 선택 인풋 (숨김 처리) */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/jpg,image/png,image/heic,image/jpeg"
              onChange={profilehandle}
            />
          </div>

          <div className="tagIdArea label">
            <input
              type="text"
              name="tag_id"
              value={userInfo.tag_id}
              onChange={handleChange}
              placeholder="태그 ID를 입력하세요"
            />
          </div>
          <div className="useNameArea label">
            <input
              type="text"
              name="username"
              value={userInfo.username}
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
              name="phone"
              value={userInfo.phone}
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
