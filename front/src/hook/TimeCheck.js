import EXIF from "exif-js";
import { useState } from "react";

// 이미지 촬영 시간이 현재 시간으로부터 20분 이내인지 체크하는 훅
const TimeCheck = () => {
  const [errorMSG, setErrorMSG] = useState("");

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

  // 이미지 촬영 시간으로부터 20분 이내인지 확인하는 함수
  const checkTimeLimit = (imageDate) => {
    const currentTime = new Date(); // 현재 시간을 얻어야 합니다
    const timeDifference = currentTime - imageDate; // 밀리초 차이
    return timeDifference <= 20 * 60 * 1000; // 20분을 밀리초로 변환
  };

  // 이미지가 유효한지 검사하는 함수
  const validateImageTime = async (imageFile) => {
    const imageDate = await getImageMetadata(imageFile);
    if (imageDate) {
      const isWithinTimeLimit = checkTimeLimit(imageDate);
      if (!isWithinTimeLimit) {
        setErrorMSG("이미지는 찍고 나서 20분 이내로만 업로드 가능합니다.");
        return false;
      }
    } else {
      setErrorMSG("이미지에서 메타데이터를 추출할 수 없습니다.");
      return false;
    }
    return true;
  };

  return { validateImageTime, errorMSG };
};

export default TimeCheck;
