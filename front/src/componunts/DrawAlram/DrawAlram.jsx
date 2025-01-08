import React, { useEffect, useState } from "react";

const DrawAlarm = ({ isOpen, closeAlarmModal }) => {
  const [alarms, setAlarms] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 서버에서 알림 데이터 받아오기
  const fetchAlarmsFromServer = async () => {
    try {
      const response = await fetch("/api/getAlarms"); // 서버 API 엔드포인트
      const data = await response.json();
      const newAlarms = data.filter(
        (alarm) => !alarm.find((a) => a.id === alarm.id) // 기존 알림과 중복 방지
      );

      if (newAlarms.length > 0) {
        setAlarms((prevAlarms) => [...prevAlarms, ...newAlarms]);
        setUnreadCount((prevCount) => prevCount + newAlarms.length); // 새로운 알림 개수 추가
      }
    } catch (error) {
      console.error("알림 데이터를 가져올 수 없습니다:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchAlarmsFromServer, 5000);
    return () => clearInterval(interval);
  }, []);

  // 알림 클릭 시 읽음 처리
  const handleAlarmClick = (alarm) => {
    setUnreadCount((prevCount) => Math.max(0, prevCount - 1)); // 읽은 알람 제거
    window.location.href = alarm.link; // 클릭 시 해당 링크(유저페이지/공지페이지) 이동
  };

  return (
    <div className={`drawAlarm ${isOpen ? "open" : ""}`}>
      <div className="drawAlarmHeader">
        알람
        <button onClick={closeAlarmModal} className="closeButton">
          닫기
        </button>
      </div>
      <div className="drawAlarmBody">
        {/* 알람 내용 */}
        {alarms.length > 0 ? (
          alarms.map((alarm) => (
            <div
              key={alarm.id}
              onClick={() => handleAlarmClick(alarm)}
              className="alarmItem"
            >
              <img
                src={alarm.profileImage}
                alt="프로필"
                className="profileImage"
              />
              <p>{alarm.content}</p>
            </div>
          ))
        ) : (
          <p>새로운 알람이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default DrawAlarm;
