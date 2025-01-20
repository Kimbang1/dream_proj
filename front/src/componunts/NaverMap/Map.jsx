// Map.jsx
import React, { useEffect, useState } from "react";
import AxiosApi from "../../servies/AxiosApi"; // 경로 수정 (services)
import MapWithPhotos from "./PhothOfCoordinate";

const Map = () => {
  const [photoData, setPhotoData] = useState([]);

  useEffect(() => {
    const fetchPhotoData = async () => {
      try {
        const response = await AxiosApi.get(`/contents/postView`); // DB에서 사진 데이터 가져오기
        console.log("API 응답 데이터:", response.data);
        setPhotoData(response.data); // DB에서 가져온 사진 데이터를 상태에 저장
      } catch (error) {
        console.error("사진 데이터를 가져오지 못했습니다.", error);
      }
    };

    fetchPhotoData(); // 사진 데이터 가져오기
  }, []);

  return (
    <div className="Mapview">
      {/* MapWithPhotos 컴포넌트를 렌더링하고, photoData를 전달 */}
      <MapWithPhotos photoData={photoData} />
    </div>
  );
};

export default Map;
