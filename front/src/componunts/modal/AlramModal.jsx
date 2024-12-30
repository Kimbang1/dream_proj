import React, { useState } from "react";

const AlarmComponent = ({ isOpen, closeAlarmModal }) => {
  const [alarms, setAlarms] = useState([]);

  // 알림 추가 함수
  const addAlarm = (newAlarm) => {
    setAlarms((prevAlarms) => [...prevAlarms, newAlarm]);
  };

  // 알람이 발생하는 예시 함수 (상대방이 메시지를 보낼 때)
  const receiveNewAlarm = (content, link) => {
    const newAlarm = {
      id: Date.now(),
      type: "comment",
      content: content,
      profileImage: "profile3.png", // 실제 프로필 이미지로 변경 가능
      link: link,
    };
    addAlarm(newAlarm);
  };

  // 예시: 5초마다 새로운 알림을 받는 시뮬레이션
  // 실제로는 서버로부터 메시지를 받는 등의 방식으로 `receiveNewAlarm`을 호출할 수 있음
  setTimeout(() => {
    receiveNewAlarm(
      "홍길동님이 게시물에 댓글을 남겼습니다.",
      "/post/123#comment"
    );
  }, 5000);

  return (
    <div className={`alarmModalArea ${isOpen ? "open" : ""}`}>
      <div className="AlarmContet">
        <h1>알림</h1>
        <div className="alarm-list">
          {alarms.map((alarm) => (
            <div
              key={alarm.id}
              className="alarm-item"
              onClick={() => (window.location.href = alarm.link)}
            >
              <img
                src={alarm.profileImage}
                alt="프로필"
                className="profile-image"
              />
              <p>{alarm.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlarmComponent;
