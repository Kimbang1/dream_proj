import { useState } from "react";
import EXIF from "exif-js";
import AxiosApi from "../servies/AxiosApi";

const UseMetadata = () => {
  const [errorMSG, setErrorMSG] = useState("");
  const [previewURL, setPreviewURL] = useState(null);

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

        const formattedTime = formattedDateTime ? formattedDateTime.toISOString() : new Date().toISOString(); // ISO 형식으로 변환

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
      const time = metadata.dateTimeOriginal || new Date().toISOString();
      const formData = new FormData();
      formData.append("file", metadata.imageFile);
      formData.append("latitude", metadata.latitude);
      formData.append("longitude", metadata.longitude);
      formData.append("time", time);
      formData.append("content", content);

      const response = await AxiosApi.post("/post/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
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

    const previewURL = URL.createObjectURL(imageFile);
    setPreviewURL(previewURL);

    const metadata = await getImageMetadata(imageFile);
    if (metadata.dateTimeOriginal || metadata.latitude || metadata.longitude) {
      return await sendMetadataToServer(metadata, content);
    } else {
      setErrorMSG("이미지 메타데이터 추출 실패");
      return false;
    }
  };

  return { handleMetadataAndSend, errorMSG, previewURL };
};

export default UseMetadata;
