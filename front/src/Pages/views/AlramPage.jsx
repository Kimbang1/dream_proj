import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

function AlarmPage() {
  const [sendAlarm, setSendAlram] = useState(null);

  useEffect(() => {
    //모스키토 브로커와 TCP 연결
    const client = mqtt.connect("ws://localhost:1883"); //기본 TCP 포트 1883 사용

    //연결 성공시
    client.on("connect", () => {
      console.log("Connected to MQTT broker");

      //'home/temperature' 토픽을 구독
      client.subscribe("home/temperature", (err) => {
        if (!err) {
          console.log("Subscribe to topic home/temperature");
        }
      });
    });

    //메시지 수신 시
    client.on("message", (topic, payload) => {
      setSendAlram(payload.toString()); //수신된 메시지 상태로 업데이트
    });

    //컴포넌트 언마운트 시 클라이언트 종료
    return () => {
      client.end();
    };
  }, []);

  return (
    <div className="alramFrame">
      <div className="alramListArea">{sendAlarm}</div>
    </div>
  );
}

export default AlarmPage;
