import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AlarmComponent = ({ isOpen, closeAlarmModal }) => {
  const [alarms, setAlarms] = useState([]);
  const navigate = useNavigate();

  // 서버에서 알림 데이터 받아오기
  const fetchAlarmsFromServer = async () => {
    try {
      const response = await fetch("/api/getAlarms"); // 서버 API 엔드포인트
      const data = await response.json();
      setAlarms(data); // 알람 데이터 상태 업데이트
    } catch (error) {
      console.error("알림 데이터를 가져올 수 없습니다:", error);
    }
  };

  useEffect(() => {
    fetchAlarmsFromServer(); // 초기 로드 시 데이터 가져오기
    const interval = setInterval(fetchAlarmsFromServer, 5000); // 5초마다 데이터 갱신
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);

  // 알림 클릭 시 이동 처리
  const handleAlarmClick = (alarm) => {
    navigate(alarm.link); // 알람의 링크로 이동
  };

  return (
    <div className={`alarmModalArea ${isOpen ? "open" : ""}`}>
      <div className="alarmContent">
        <h2>알림</h2>
        <button className="closeButton" onClick={closeAlarmModal}>
          닫기
        </button>
        <div className="alarmList">
          {alarms.length > 0 ? (
            alarms.map((alarm) => (
              <div
                key={alarm.id}
                className="alarmItem"
                onClick={() => handleAlarmClick(alarm)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                {/* 유저 프로필 */}
                <img
                  src={alarm.profileImage || "/images/default-profile.png"} // 프로필 이미지
                  alt="유저 프로필"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                {/* 알람 내용 */}
                <div>
                  <p style={{ fontWeight: "bold", margin: "0" }}>
                    {alarm.userId} {/* 유저 ID */}
                  </p>
                  <p style={{ margin: "0", fontSize: "14px", color: "#555" }}>
                    {alarm.message} {/* 알람 메시지 */}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>새로운 알림이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlarmComponent;
