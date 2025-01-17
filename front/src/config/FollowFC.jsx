import React, { useState } from "react";
import AxiosApi from "../servies/AxiosApi";

function FollowFC({ uuId, currentFollowStatus }) {
  const [isFollowing, setIsFollowing] = useState(currentFollowStatus); //팔로우 여부 상태

  //팔로우 상태를 서버로 업데이트 하는 함수
  const toggleFollowStatus = async () => {
    try {
      // 팔로우 상태를 변경하여 서버에 요청
      const response = await AxiosApi.post("/user/follow", {
        uuId, // 상대의 uuId
        followStatus: !isFollowing,
      });

      // 서버 응답이 성공적이면 팔로우 상태 업데이트
      if (response.data.success) {
        setIsFollowing(!isFollowing); // 상태 반전
      } else {
        console.log("팔로우 업데이트 실패");
      }
    } catch (error) {
      console.log("팔로우가 되질 못했습니다", error);
    }
  };

  return (
    <>
      <button id="followBtn" onClick={toggleFollowStatus}>
        {isFollowing ? "팔로우 취소" : "팔로우"} {/* 버튼 텍스트 수정 */}
      </button>
    </>
  );
}

export default FollowFC;
