import React, { useState } from "react";
import useNaverMap from "./useNaverMap";

const MapWithPhotos = ({ photoData }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const map = useNaverMap({
    center: new window.naver.maps.LatLng(37.5665, 126.978), // 서울 기본 위치
    zoom: 10,
  });

  // 사진 데이터를 기반으로 마커 추가
  React.useEffect(() => {
    if (map && photoData) {
      photoData.forEach((photo) => {
        const { latitude, longitude, imageUrl } = photo;

        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(latitude, longitude),
          map: map,
          icon: {
            url: imageUrl,
            size: new window.naver.maps.Size(50, 50),
            scaledSize: new window.naver.maps.Size(50, 50),
            origin: new window.naver.maps.Point(0, 0),
            anchor: new window.naver.maps.Point(25, 25),
          },
        });

        // 마커 클릭 시 사진 정보 표시
        window.naver.maps.Event.addListener(marker, "click", () => {
          setSelectedPhoto(photo);
        });
      });
    }
  }, [map, photoData]);

  return (
    <div className="MapWithPhotos">
      <div id="map" style={{ width: "100%", height: "500px" }}></div>
      {selectedPhoto && (
        <div className="photo-info">
          <p>선택된 사진:</p>
          <img
            src={selectedPhoto.imageUrl}
            alt="선택된 사진"
            style={{ width: "200px" }}
          />
          <p>위도: {selectedPhoto.latitude}</p>
          <p>경도: {selectedPhoto.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default MapWithPhotos;
