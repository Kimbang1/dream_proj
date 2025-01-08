import { useState } from "react";
import EXIF from "exif-js";
import AxiosApi from "../servies/AxiosApi";

const useImageMetadata = () => {
  const [errorMSG, setErrorMSG] = useState("");
  const [previewURL, setPreviewURL] = useState(null); // 상태 추가

  const getImageMetadata = (imageFile) => {
    return new Promise((resolve) => {
      EXIF.getData(imageFile, function () {
        const dateTimeOriginal = EXIF.getTag(this, "DateTimeOriginal");
        const gpsLatitude = EXIF.getTag(this, "GPSLatitude");
        const gpsLongitude = EXIF.getTag(this, "GPSLongitude");
        const gpsLatitudeRef = EXIF.getTag(this, "GPSLatitudeRef");
        const gpsLongitudeRef = EXIF.getTag(this, "GPSLongitudeRef");

        const allTags = EXIF.getAllTags(this);
        console.log("All EXIF tags:", allTags);

        console.log("GPS data:", {
          gpsLatitude,
          gpsLongitude,
          gpsLatitudeRef,
          gpsLongitudeRef,
        });

        let latitude = null;
        let longitude = null;

        if (gpsLatitude && gpsLongitude) {
          latitude =
            (gpsLatitude[0] + gpsLatitude[1] / 60 + gpsLatitude[2] / 3600) *
            (gpsLatitudeRef === "S" ? -1 : 1);
          longitude =
            (gpsLongitude[0] + gpsLongitude[1] / 60 + gpsLongitude[2] / 3600) *
            (gpsLongitudeRef === "W" ? -1 : 1);
        }

        let formattedDateTime = null;
        if (dateTimeOriginal) {
          try {
            const isoString = dateTimeOriginal
              .replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3")
              .replace(" ", "T");
            formattedDateTime = new Date(isoString);
          } catch {
            formattedDateTime = null;
          }
        }

        const formattedTime = formattedDateTime
          ? formattedDateTime.toISOString()
          : new Date().toISOString(); // ISO 형식으로 변환

        resolve({
          dateTimeOriginal: formattedTime,
          latitude,
          longitude,
          imageFile,
        });
      });
    });
  };

  const sendMetadataToServer = async (metadata, content) => {
    try {
      const captured_at = metadata.dateTimeOriginal || new Date().toISOString();
      const formData = new FormData();
      formData.append("file", metadata.imageFile);
      formData.append("latitude", metadata.latitude);
      formData.append("longitude", metadata.longitude);
      formData.append("captured_at", captured_at);

      const response = await AxiosApi.post("/post/fileUpload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      //서버에서 응답으로 URL을 받아 처리
      if (response.data && response.data.url) {
        setPreviewURL(response.data.url); // 서버에서 반환된 URL을 previewURL로 설정
        return response.data.url; //URL을 반환
      }
      return false;
    } catch (error) {
      setErrorMSG("메타데이터 전송 실패");
      return false;
    }
  };

  const handleMetadataAndSend = async (imageFile, content) => {
    if (!imageFile.type.startsWith("image/")) {
      setErrorMSG("이미지 파일만 업로드 가능합니다.");
      return false;
    }

    // FileReader를 사용하여 파일을 읽고 미리보기 URL 생성
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewURL(reader.result); // 데이터 URL을 previewURL에 저장
    };
    reader.readAsDataURL(imageFile);

    const metadata = await getImageMetadata(imageFile);
    if (metadata.dateTimeOriginal || metadata.latitude || metadata.longitude) {
      return await sendMetadataToServer(metadata, content);
    } else {
      setErrorMSG("이미지 메타데이터 추출 실패");
      return false;
    }
  };

  return { handleMetadataAndSend, errorMSG, previewURL, setPreviewURL }; // setPreviewURL 추가
};

export default useImageMetadata;
