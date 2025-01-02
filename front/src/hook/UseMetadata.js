import { useState } from "react";
import EXIF from "exif-js";
import axios from "axios";

const UseMetadata = () => {
  const [errorMSG, setErrorMSG] = useState(""); // 오류 메시지 상태

  // EXIF 메타데이터에서 촬영 시간을 포함한 정보를 추출하는 함수
  const getImageMetadata = (imageFile) => {
    return new Promise((resolve) => {
      EXIF.getData(imageFile, function () {
        const dateTimeOriginal = EXIF.getTag(this, "DateTimeOriginal");
        const gpsLatitude = EXIF.getTag(this, "GPSLatitude");
        const gpsLongitude = EXIF.getTag(this, "GPSLongitude");
        const gpsLatitudeRef = EXIF.getTag(this, "GPSLatitudeRef");
        const gpsLongitudeRef = EXIF.getTag(this, "GPSLongitudeRef");

        let latitude = null;
        let longitude = null;

        // 위도, 경도 계산
        if (gpsLatitude && gpsLongitude) {
          latitude =
            (gpsLatitude[0] + gpsLatitude[1] / 60 + gpsLatitude[2] / 3600) *
            (gpsLatitudeRef === "S" ? -1 : 1); // S 방향이면 음수
          longitude =
            (gpsLongitude[0] + gpsLongitude[1] / 60 + gpsLongitude[2] / 3600) *
            (gpsLongitudeRef === "W" ? -1 : 1); // W 방향이면 음수

          console.log("latitude:", latitude);
          console.log("longitude:", longitude);
        } else {
          console.warn("GPS 데이터가 없습니다.");
        }
  // dateTimeOriginal 값을 유효한 형식으로 변환
      let formattedDateTime = null;
      if (dateTimeOriginal) {
        try {
          formattedDateTime = new Date(
            dateTimeOriginal.replace(/:/g, "-").replace(" ", "T")
          );
          if (isNaN(formattedDateTime.getTime())) {
            formattedDateTime = null; // 변환 실패 시 null로 설정
          }
        } catch (error) {
          console.error("DateTimeOriginal 변환 오류:", error);
        }
      }

      resolve({
        dateTimeOriginal: formattedDateTime,
        latitude,
        longitude,
      });
    });
  });
};

  // 서버로 메타데이터 전송하는 함수
  const sendMetadataToServer = async (imageFile, metadata) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    if (metadata.dateTimeOriginal) {
      formData.append("imageDate", metadata.dateTimeOriginal.toISOString());
    }
    if (metadata.latitude && metadata.longitude) {
      formData.append("latitude", metadata.latitude);
      formData.append("longitude", metadata.longitude);
    }

    try {
      const response = await axios.post("/auth/upload-metadata", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setErrorMSG("메타데이터가 성공적으로 전송되었습니다.");
      } else {
        setErrorMSG("서버 오류 발생.");
      }
    } catch (error) {
      console.error("메타데이터 전송 오류:", error);
      setErrorMSG("서버와 연결할 수 없습니다.");
    }
  };

  // 메타데이터 추출 및 서버로 전송하는 함수
  const handleMetadataAndSend = async (imageFile) => {
    if (!imageFile.type.startsWith("image/")) {
      setErrorMSG("이미지 파일만 업로드 가능합니다.");
      return;
    }

    const metadata = await getImageMetadata(imageFile);
    if (
      metadata.dateTimeOriginal ||
      (metadata.latitude && metadata.longitude)
    ) {
      await sendMetadataToServer(imageFile, metadata);
    } else {
      setErrorMSG("이미지에서 메타데이터를 추출할 수 없습니다.");
      console.error("메타데이터 추출 실패:", metadata);
    }
  };

  return { handleMetadataAndSend, errorMSG };
};

export default UseMetadata;
