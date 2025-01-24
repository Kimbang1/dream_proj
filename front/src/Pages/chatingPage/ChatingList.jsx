import React from "react";
import { useChatRooms } from "../../hook/Chating/bringChatId";
import { useUserInfo } from "../../hook/useUserInfo";

function ChatingList({ onChatSelect }) {
  const { chatRooms, userTagid, loading, error } = useChatRooms();
  const { userInfo } = useUserInfo(); //유저 정보 가져와서 사용하기

  if (loading) return <p>로딩중 ...</p>;
  if (error) return <p>오류 발생 : {error.message}</p>;

  return (
    <div className="chatingList">
      {/* 설정과 광고가 들어가는 영역 */}
      <div className="functionTools">
        <div className="advertisement"></div>
        <div className="Tools">
          <img src="" alt="" />
        </div>
      </div>

      {/* 채팅방 리스트 */}
      <div className="chatroomList">
        {chatRooms.map((room) => (
          <div
            key={room.id || room.uuid}
            className="chatingBoxes"
            onClick={() => {
              console.log(`${room.name} 클릭됨`);
              onChatSelect(room.id); // 부모로 chatId 전달
            }}
          >
            <div className="reftArea">
              <img
                className="chatingPro"
                src={`/profileImage/${userInfo.profile_image}`}
                alt={`${userInfo.username} 이미지`}
              />
              <span className="chatinNames">{room.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatingList;
