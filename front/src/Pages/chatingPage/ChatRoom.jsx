import React, { useState, useEffect } from "react";
import mqtt from "mqtt";

function ChatRoom({ chatId }) {
  const [client, setClient] = useState(null); // MQTT 클라이언트
  const [message, setMessage] = useState(""); // 현재 입력된 메시지
  const [chatMessages, setChatMessages] = useState([]); // 채팅 메시지 리스트
  const [isConnected, setIsConnected] = useState(false); // 연결 상태

  const brokerUrl = "ws://broker.hivemq.com:8000/mqtt"; // MQTT 브로커 주소
  const topic = `my-chat-app/room/${chatId}`; // 채팅방 ID에 따른 주제 설정

  useEffect(() => {
    // MQTT 클라이언트 연결 설정
    const mqttClient = mqtt.connect(brokerUrl);

    mqttClient.on("connect", () => {
      setIsConnected(true);
      console.log("MQTT 브로커에 접속이 되었습니다.");
      mqttClient.subscribe(topic, (err) => {
        if (!err) {
          console.log(`Subscribed to topic: ${topic}`);
        }
      });
    });

    mqttClient.on("disconnect", () => setIsConnected(false));

    mqttClient.on("message", (topic, payload) => {
      const receivedMessage = payload.toString();
      setChatMessages((prev) => [
        ...prev,
        { sender: "other", text: receivedMessage },
      ]);
    });

    setClient(mqttClient);

    // 클린업
    return () => {
      mqttClient.end();
    };
  }, [topic]);

  const sendMessage = () => {
    if (!message.trim() || !client) return;
    client.publish(topic, message);
    setChatMessages((prev) => [...prev, { sender: "me", text: message }]);
    setMessage("");
  };

  useEffect(() => {
    const chatWindow = document.querySelector(".chatWindow");
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h3>채팅방 {chatId}</h3>
      <p style={{ color: isConnected ? "green" : "red" }}>
        {isConnected ? "Connected" : "Disconnected"}
      </p>
      <div
        className="chatWindow"
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ddd",
          marginBottom: "10px",
          padding: "10px",
        }}
      >
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === "me" ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                background: msg.sender === "me" ? "#d1e7dd" : "#f8d7da",
                borderRadius: "5px",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={sendMessage}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
