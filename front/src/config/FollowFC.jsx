import React, { useState, useEffect } from "react";
import AxiosApi from "../servies/AxiosApi";

function FollowFC({ uuId, currentFollowStatus }) {
  const [isFollowing, setIsFollowing] = useState(currentFollowStatus); // 팔로우 여부 상태
  const [isSameUser, setIsSameUser] = useState(false); // 동일 유저 여부 상태

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 서버에서 동일 유저 여부를 가져옴
        const response = await AxiosApi.get(`/user/info?uuid=${uuId}`);

        // 서버에서 받은 isSameUser 값으로 설정
        setIsSameUser(response.data.isSameUser); // 서버 응답에서 제공되는 isSameUser 값 사용
      } catch (error) {
        console.error("유저 정보 가져오기 실패:", error);
      }
    };
    if (uuId) {
      fetchData(); // uuid가 있을 때만 데이터 요청
    }
  }, [uuId]);

  console.log("isSameUser:", isSameUser);

  // 팔로우 상태를 서버로 업데이트하는 함수
  const toggleFollowStatus = async () => {
    try {
      // 팔로우 상태를 변경하여 서버에 요청
      const response = await AxiosApi.post("/user/follow", {
        uuId, // 상대방의 uuId
        followStatus: !isFollowing,
      });

      // 서버 응답이 성공적이면 팔로우 상태 업데이트
      if (response.data.success) {
        setIsFollowing(!isFollowing); // 상태 반전
      } else {
        console.log("팔로우 업데이트 실패");
      }
    } catch (error) {
      console.error("팔로우 요청 실패:", error);
    }
  };

  // 동일 유저일 경우 버튼 숨기기
  if (isSameUser) {
    return null;
  }

  return (
    <>
      <button id="followBtn" onClick={toggleFollowStatus}>
        {isFollowing ? "팔로우 취소" : "팔로우"}
      </button>
    </>
  );
}

export default FollowFC;
