import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function Agree() {
  //각 파트별로 동의 했는지 아닌지
  const [isAgreedPrivacy, setIsAgreedPrivacy] = useState(true);
  const [isAgreedPhoto, setIsAgreedPhoto] = useState(true);
  const [isAgreedService, setIsAgreedService] = useState(true);

  //모든 약관에 동의 했는지 확인하는 것
  const isAllAgreed = isAgreedPhoto && isAgreedPrivacy && isAgreedService;

  //네이비게이트 설정
  const navigate = useNavigate();

  const handleAgreeAll = () => {
    const newAgreeStatus = !isAgreedPrivacy;
    setIsAgreedPhoto(newAgreeStatus);
    setIsAgreedPrivacy(newAgreeStatus);
    setIsAgreedService(newAgreeStatus);
  };

  const handlecheck = () => {
    if (isAllAgreed) {
      alert("모든 약관에 동의 하셨습니다.");
      navigate("/joinchoice");
    } else {
      alert("모든 약관에 동의하셔야 합니다.");
    }
  };

  return (
    <div className="background">
      <div className="terms-container">
        <h1>사용 약관 동의</h1>

        {/* 개인정보 수집 및 이용 동의 */}
        <div className="terms-section">
          <h4>1. 개인정보 수집 및 이용 동의</h4>
          <div className="text">
            본 애플리케이션은 사용자가 사진을 찍고 이를 업로드하는 과정에서,
            사진의 메타데이터에 포함된 위치 정보, 시간 정보 등을 수집합니다. 이
            정보는 사용자의 활동 및 위치 기반 추천 서비스를 제공하기 위해
            사용됩니다.
          </div>
        </div>
        <label>
          <input
            type="checkbox"
            checked={isAgreedPrivacy}
            onChange={() => setIsAgreedPrivacy(!isAgreedPrivacy)}
          />
          개인정보 수집 및 이용에 동의합니다.
        </label>

        {/* 사진 업로드 및 위치 정보 활용 동의 */}
        <div className="terms-section">
          <h4>2. 사진 업로드 및 위치 정보 활용 동의</h4>
          <div className="text">
            업로드된 사진의 메타데이터는 해당 장소의 밀집 시간 분석에 활용되며,
            해당 지역에 대한 밀집도, 추천 장소 등 다양한 정보가 사용자에게
            제공됩니다. 위치 정보는 앱 서비스 내에서만 사용됩니다.
          </div>
        </div>
        <label>
          <input
            type="checkbox"
            checked={isAgreedPhoto}
            onChange={() => setIsAgreedPhoto(!isAgreedPhoto)}
          />
          사진 업로드 및 위치 정보 활용에 동의합니다.
        </label>

        {/* 서비스 이용 조건 동의 */}
        <div className="terms-section">
          <h4>3. 서비스 이용 조건 동의</h4>
          <div className="text">
            사용자는 본 애플리케이션을 통해 사진을 업로드하고, 해당 지역에 대한
            밀집 시간 정보를 제공받으며, 해당 정보를 바탕으로 추천 서비스를 받을
            수 있습니다.
          </div>
        </div>
        <label>
          <input
            type="checkbox"
            checked={isAgreedService}
            onChange={() => setIsAgreedService(!isAgreedService)}
          />
          서비스 이용 조건에 동의합니다.
        </label>

        {/* 모든 약관 동의 버튼 */}
        <div className="terms-actions">
          <button onClick={handleAgreeAll}>
            {isAgreedPrivacy ? "모든 동의 취소" : "모두 동의"}
          </button>
          <button onClick={handlecheck}>약관 동의 후 진행</button>
        </div>
      </div>
    </div>
  );
}

export default Agree;
