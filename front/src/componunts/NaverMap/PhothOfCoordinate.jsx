import React, { useState, useEffect } from "react";
import AxiosApi from "../../servies/AxiosApi"; // 경로 확인

const MapWithPhotos = () => {
  const [photoData, setPhotoData] = useState([]);

  useEffect(() => {
    // 네이버 지도 API 로드 후 지도와 마커 설정
    const loadMapScript = () => {
      const script = document.createElement("script");
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_NAVER_MAP_CLIENT_ID}`;
      script.async = true;
      script.onload = () => {
        fetchPhotoData(); // 지도 스크립트가 로드되면 데이터를 불러옵니다.
      };
      script.onerror = (e) => {
        console.error("네이버 지도 API 로드 오류:", e);
      };
      document.head.appendChild(script);
    };

    const fetchPhotoData = async () => {
      try {
        const response = await AxiosApi.get(`/contents/mapLongLati`); // API 호출하여 사진 데이터 가져오기
        setPhotoData(response.data);
        console.log("사진 데이터:", response.data);

        const mapDiv = document.getElementById("map");
        const map = new window.naver.maps.Map(mapDiv, {
          center: new window.naver.maps.LatLng(37.5665, 126.978), // 지도 초기 중심
          zoom: 10,
        });

        // 사진 데이터를 기반으로 마커 추가
        response.data.forEach((photo) => {
          const { latitude, longitude, up_filename } = photo;

          if (!up_filename) {
            console.warn("up_filename이 없습니다:", photo); // up_filename이 없으면 경고
            return; // 이미지가 없으면 마커를 추가하지 않음
          }

          // 마커 아이콘 설정
          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(latitude, longitude),
            map: map,
            icon: {
              content: `<img class="marker-image" src="/contentImage/${up_filename}" alt="사진" />`,
              size: new window.naver.maps.Size(80, 80),
              scaledSize: new window.naver.maps.Size(50, 50),
              origin: new window.naver.maps.Point(0, 0),
              anchor: new window.naver.maps.Point(25, 25), // 마커 앵커 설정
            },
          });

          // 마커 클릭 시 이미지 정보를 표시하는 로직
          window.naver.maps.Event.addListener(marker, "click", () => {
            alert(`선택된 사진:\n위도: ${latitude}\n경도: ${longitude}`);
          });
        });
      } catch (error) {
        console.error(
          "사진 데이터를 가져오지 못했습니다.",
          error.response || error.message || error
        );
      }
    };

    loadMapScript();
  }, []); // 빈 배열로 설정해 한 번만 실행

  return <div id="map" style={{ width: "100%", height: "500px" }}></div>;
};

export default MapWithPhotos;
