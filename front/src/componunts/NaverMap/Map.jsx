import React, { useEffect, useState } from "react";

const Map = () => {
  const [mapPoint, setMapPoint] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // window.naver로 명시적 접근
    const mapDiv = document.getElementById("map");
    const map = new window.naver.maps.Map(mapDiv, {
      center: new window.naver.maps.LatLng(37.5665, 126.978), // 서울 기본 위치
      zoom: 10,
    });

    // 지도 클릭 시 중심 좌표 업데이트
    window.naver.maps.Event.addDOMListener(mapDiv, "click", () => {
      const center = map.getCenter();
      const coordinate = { x: center.lng(), y: center.lat() }; // 중심의 경도, 위도
      setMapPoint({ x: coordinate.x, y: coordinate.y });
      console.log("클릭한 위치의 좌표:", coordinate); // 디버깅용 로그
    });
  }, []);

  return (
    <div className="Mapview">
      <div id="map" style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
};

export default Map;
