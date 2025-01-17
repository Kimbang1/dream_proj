import React, { useEffect, useState } from "react";
import AxiosApi from "../../servies/AxiosApi";

const Map = () => {
  const [mapPoint, setMapPoint] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchPhotoData = async () => {
      try {
        const response = await AxiosApi.get(`/contents/postView`); // DB에서 사진 데이터 가져오기
        console.log("API 응답 데이터:", response.data); // 디버깅용 로그

        const mapDiv = document.getElementById("map");
        const map = new window.naver.maps.Map(mapDiv, {
          center: new window.naver.maps.LatLng(37.5665, 126.978), // 지도 초기 중심점
          zoom: 10,
        });

        // response.data 배열을 순회하여 CustomOverlay 생성
        response.data.forEach((item) => {
          const { latitude, longtitude, imageUrl } = item;
          console.log("잘 가져오는 중인가?:", response.data);
          new window.naver.maps.CustomOverlay({
            position: new window.naver.maps.LatLng(latitude, longtitude),
            content: `
              <div class="pamplate">
                <img src="${imageUrl}" alt="사진" style="width:30px;height:30px;" />
              </div>
            `,
            map: map,
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

      script.onload = fetchPhotoData; // 지도 스크립트 로드 후 데이터 가져오기
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
    </div>
  );
};

export default Map;
