import React, { useEffect, useState } from "react";
import AxiosApi from "../../servies/AxiosApi"; // 경로 수정 (servies -> services)
import MapWithPhotos from "./PhothOfCoordinate"; // PhothOfCoordinate -> PhotoOfCoordinate로 수정 필요할 수 있음

const Map = () => {
  const [mapPoint, setMapPoint] = useState({ x: 0, y: 0 });
  const [photoData, setPhotoData] = useState([]);

  useEffect(() => {
    const fetchPhotoData = async () => {
      try {
        const response = await AxiosApi.get(`/contents/mapLongLati`); // DB에서 사진 데이터 가져오기
        console.log("Map.jsx API 응답 데이터:", response.data); // 디버깅용 로그
        setPhotoData(response.data);

        const mapDiv = document.getElementById("map");
        const map = new window.naver.maps.Map(mapDiv, {
          center: new window.naver.maps.LatLng(37.5665, 126.978), // 지도 초기 중심점
          zoom: 10,
        });

        // 사진 데이터를 기반으로 마커 추가
        response.data.forEach((item) => {
          const { latitude, longitude, up_filename } = item;
          new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(latitude, longitude),
          
          // console.log("잘 가져오는 중인가?:", response.data);
          // new window.naver.maps.CustomOverlay({
          //   position: new window.naver.maps.LatLng(latitude, longtitude),
          //   content: `
          //     <div class="pamplate">
          //       <img src='/contentImage/${up_filename}' alt="사진" style="width:30px;height:30px;" />
          //     </div>
          //   `,
            map: map,
            icon: {
              url: up_filename,
              size: new window.naver.maps.Size(30, 30),
              scaledSize: new window.naver.maps.Size(30, 30),
              origin: new window.naver.maps.Point(0, 0),
              anchor: new window.naver.maps.Point(15, 15),
            },
          }).setMap(map);
        });

        // 지도 클릭 시 좌표 업데이트
        window.naver.maps.Event.addListener(map, "click", (e) => {
          const latLng = e.latLng;
          setMapPoint({
            x: latLng.lat(),
            y: latLng.lng(),
          });
        });
      } catch (error) {
        console.error("사진 데이터를 가져오지 못했습니다.", error);
      }
    };

    const loadMapScript = () => {
      const script = document.createElement("script");
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_NAVER_MAP_CLIENT_ID}`;
      script.async = true;

      script.onload = fetchPhotoData;
      script.onerror = (e) => {
        console.error("네이버 지도 API 로드 오류:", e);
      };

      document.head.appendChild(script);
    };

    loadMapScript();
  }, []);

  return (
    <div className="Mapview">
      <div id="map" style={{ width: "100%", height: "500px" }}></div>
      <div>
        <p>현재 선택된 좌표:</p>
        <p>X: {mapPoint.x}</p>
        <p>Y: {mapPoint.y}</p>
      </div>
      <div>
        <h1>지도와 사진 위치</h1>
      </div>
    </div>
  );
};

export default Map;
