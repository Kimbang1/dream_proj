import React, { useState, useEffect } from "react";
import AxiosApi from "../servies/AxiosApi";

function FollowFC({ targetUuid, isFollowing, onFollowChange }) {
  const [followStatus, setFollowStatus] = useState(isFollowing); // 초기 팔로우 상태

  // 팔로우 상태를 서버로 업데이트하는 함수
  const toggleFollowStatus = async () => {
    try {
      // 서버에 팔로우 상태 변경 요청
      const response = await AxiosApi.post("/user/follow", {
        uuId: targetUuid, // 상대방의 uuId
        followStatus: !followStatus, // 현재 상태 반전값 전송
      });

      // 서버 응답이 성공적이면 팔로우 상태 업데이트
      if (response.data.success) {
        setFollowStatus(!followStatus); // 버튼 상태 업데이트
        onFollowChange(!followStatus); // 부모 컴포넌트 상태 업데이트
      } else {
        console.log("팔로우 업데이트 실패");
      }
    } catch (error) {
      console.error("팔로우 요청 실패:", error);
    }
  };

  return (
    <button id="followBtn" onClick={toggleFollowStatus}>
      {followStatus ? "팔로우 취소" : "팔로우"}
    </button>
  );
}

export default FollowFC;
