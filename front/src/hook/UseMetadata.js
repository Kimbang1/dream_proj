import { useState } from "react";
import EXIF from "exif-js";
import AxiosApi from "../servies/AxiosApi";

// 이미지 메타데이터 추출 훅
const UseMetadata = () => {
  const [errorMSG, setErrorMSG] = useState(""); // 오류 메시지 상태

  // EXIF 메타데이터에서 촬영 시간을 추출하는 함수
  const getImageMetadata = (imageFile) => {
    return new Promise((resolve) => {
      EXIF.getData(imageFile, function () {
        const dateTimeOriginal = EXIF.getTag(this, "DateTimeOriginal");
        if (dateTimeOriginal) {
          // EXIF에서 DateTimeOriginal을 찾았다면
          const imageDate = new Date(dateTimeOriginal);
          resolve(imageDate);
        } else {
          resolve(null);
        }
      });
    });
  };

  // 서버로 메타데이터 전송하는 함수
  const sendMetadataToServer = async (imageFile, imageDate) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("imageDate", imageDate.toISOString());

    try {
      const response = await AxiosApi.post("/auth/upload-metadata", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("메타데이터 전송 성공:", response);
      if (response.status === 200) {
        console.log("메타데이터가 성공적으로 전송되었습니다.");
      }
    } catch (error) {
      console.error("메타데이터 전송 오류:", error);
      setErrorMSG("서버와 연결 할 수 없습니다.");
    }
  };

  // 메타데이터 추출 및 서버로 전송하는 함수
  const handleMetadataAndSend = async (imageFile) => {
    const imageDate = await getImageMetadata(imageFile);
    if (imageDate) {
      await sendMetadataToServer(imageFile, imageDate);
    } else {
      setErrorMSG("이미지에서 메타데이터를 추출할 수 없습니다.");
    }
  };

  return { handleMetadataAndSend, errorMSG };
};

export default UseMetadata;
