import React, { useState } from "react";
import AxiosApi from "../servies/AxiosApi";

function FollowFC({ uuId, currentFollowStatus, userid }) {
  const [isFollowing, setIsFollowing] = useState(currentFollowStatus); //팔로우 여부 상태

  //내 게시물인 아닌지
  const isMyPost = Number(uuId) === Number(userid);

  console.log("uuId:", uuId); // uuId 값 출력
  console.log("userid:", userid); // userid 값 출력

  console.log("::::::::::::::::");
  console.log(isMyPost);
  console.log("::::::::::::::::");
  //왜 내 게시물이 아닌데 true로 뜨는거야? 그야 지금 데이터를 못가져와서 안뜨니까 그렇지

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

  if (isMyPost) {
    return null;
  }

  return (
    <>
      <button id="followBtn" onClick={toggleFollowStatus}>
        {isFollowing ? "팔로우 워" : "팔로우"} {/* 버튼 텍스트 수정 */}
      </button>
    </>
  );
}

export default FollowFC;
