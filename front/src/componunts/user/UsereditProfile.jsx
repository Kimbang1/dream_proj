import React, { useState } from "react";
import { useImagePreview } from "../../hook/useImagePreview";
import { useUserInfo } from "../../hook/useUserInfo";
import { useUpdateUserInfo } from "../../hook/useUpdateUserInfo";
import UserResign from "./UserResign";

function Useredit() {
  const [isOnresign, setIsOnresign] = useState(false);
  const {
    imagePreviews,
    fileInputRef,
    profilehandle,
    handleImageClick,
    openFileDialog,
  } = useImagePreview();
  const { userInfo, handleChange } = useUserInfo();
  const { isLoading, updateUserInfo } = useUpdateUserInfo();

  const resignClick = () => setIsOnresign(true);

  const handleSave = async () => {
    updateUserInfo(userInfo);
  };

  return (
    <div className="editProfile">
      {isOnresign && <UserResign />}
      {!isOnresign && (
        <>
          <div className="ProfileimgArea">
            <div className="miribogi" onClick={openFileDialog}>
              {imagePreviews.length > 0 ? (
                imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`프로필 미리보기 ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ))
              ) : (
                <img
                  src="/profileImage/defaultProfile.png"
                  alt="프로필 미리보기"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>
            <img
              src="/images/profiletrade.png"
              alt="교체아이콘"
              className="trade"
              onClick={openFileDialog}
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/jpg,image/png,image/heic,image/jpeg"
              multiple
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
              maxLength={300}
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
      <div className="BtnArea">
        {!isOnresign && <button onClick={resignClick}>탈퇴</button>}
        {!isOnresign && (
          <button onClick={handleSave} disabled={isLoading}>
            수정 완료
          </button>
        )}
      </div>
    </div>
  );
}

export default Useredit;
