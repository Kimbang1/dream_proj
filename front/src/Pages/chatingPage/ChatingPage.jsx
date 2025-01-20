import React, { useState } from "react";
import ChatRoom from "./ChatRoom";
import ChatingList from "./ChatingList";

function ChatingPage() {
  const [activeChatId, setActiveChatId] = useState(null); // 현재 활성화된 채팅방 ID

  return (
    <div style={{ display: "flex", height: "100vh"}}>
      {/* 채팅 리스트 */}
      <ChatingList onChatSelect={(chatId) => setActiveChatId(chatId)} />

      {/* 채팅방 영역 (선택된 채팅방만 표시) */}
      {activeChatId && <ChatRoom chatId={activeChatId} />}
    </div>
  );
}



export default ChatingPage;