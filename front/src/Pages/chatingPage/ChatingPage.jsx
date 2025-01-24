import React, { useState } from "react";
import ChatRoom from "./ChatRoom";
import ChatingList from "./ChatingList";

function ChatingPage() {
  const [activeChatId, setActiveChatId] = useState(null); // 현재 활성화된 채팅방 ID

  return (
    <div className="chatingpageArea">
      <div className="ChatingListArea">
        {/* 채팅 리스트 */}
        <ChatingList onChatSelect={(chatId) => setActiveChatId(chatId)} />
      </div>

      <div className="ChatingRoomArea">
        {/* 채팅방 영역 (선택된 채팅방만 표시) */}
        <div className="chatRoomContainer">
          {activeChatId ? (
            <ChatRoom chatId={activeChatId} />
          ) : (
            <div className="placehorder">채팅방을 선택해 주세요.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatingPage;
