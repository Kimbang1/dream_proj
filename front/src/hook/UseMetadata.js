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

          // 유효한 날짜인지 확인
          if (isNaN(imageDate)) {
            resolve(null);  // 유효하지 않으면 null을 반환
          } else {
            resolve(imageDate); // 유효한 날짜라면 반환
          }
        } else {
          resolve(null);  // "DateTimeOriginal" 태그가 없으면 null 반환
        }
      });
    });
  };

  // 서버로 메타데이터 전송하는 함수
  const sendMetadataToServer = async (imageFile, imageDate) => {
    // imageDate가 유효하지 않으면 메타데이터 전송을 진행하지 않음
    if (!imageDate) {
      setErrorMSG("이미지에서 유효한 촬영 시간을 추출할 수 없습니다.");
      return false;
    }

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("imageDate", imageDate.toISOString());

    // 디버깅용 로그 추가: 서버로 전송할 데이터 확인
    console.log("서버로 전송할 데이터: ", formData);

    try {
      const response = await AxiosApi.post("/post/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("메타데이터 전송 성공:", response);

      if (response.status === 200) {
        console.log("메타데이터가 성공적으로 전송되었습니다.");
        return true;  // 메타데이터 전송 성공 시 ture 반환
      } else {
        console.log("서버 응답 코드: ", response.status);
        return false; // 실패 시 false 반환
      }
    } catch (error) {
      console.error("메타데이터 전송 오류:", error);
      setErrorMSG("서버와 연결 할 수 없습니다.");
      return false; // 오류 발생 시 false 반환
    }
  };

  const handleMetadataAndSend = async (imageFile) => {
    console.log("메타데이터 추출 시작:", imageFile);
    const imageDate = await getImageMetadata(imageFile);
    if (imageDate) {
      console.log("추출된 촬영 시간:", imageDate);
      const isMetadataSent = await sendMetadataToServer(imageFile, imageDate);
      return isMetadataSent;
    } else {
      console.log("메타데이터 추출 실패");
      setErrorMSG("이미지에서 메타데이터를 추출할 수 없습니다.");
      return false;
    }
  };

  return { handleMetadataAndSend, errorMSG };
};

export default UseMetadata;
