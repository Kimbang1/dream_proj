import React, { useEffect, useState } from "react";


const Map = () => {
  const [mapPoint, setMapPoint] = useState({ x: 0, y: 0 });


  useEffect(() => {
    // 네이버 지도 스크립트가 로드되었는지 확인
    const script = document.createElement("script");
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_NAVER_MAP_CLIENT_ID}`;
    script.async = true;
    
    script.onload = () => {
      // 스크립트 로드 후 지도 초기화
      const mapDiv = document.getElementById("map");
      const map = new window.naver.maps.Map(mapDiv, {
        center: new window.naver.maps.LatLng(37.5665, 126.978), // 서울 기본 위치
        zoom: 10,
      });
      // console.log(
      //   "NAVER_MAP_CLIENT_ID:",
      //   process.env.REACT_APP_NAVER_MAP_CLIENT_ID
      // );

      // 지도 클릭 시 중심 좌표 업데이트
      window.naver.maps.Event.addDOMListener(mapDiv, "click", () => {
        const center = map.getCenter();
        const coordinate = { x: center.lng(), y: center.lat() }; // 중심의 경도, 위도
        setMapPoint({ x: coordinate.x, y: coordinate.y });
        console.log("클릭한 위치의 좌표:", coordinate); // 디버깅용 로그
      });
    };

    script.onerror = (e) => {
      console.error("네이버 지도 API 로드 오류:", e);
    };

    document.head.appendChild(script);
  }, []);

  return (
    <div className="Mapview">
      <div id="map" style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
};

export default Map;
