import EXIF from "exif-js";
import { useState } from "react";

// 이미지 촬영 시간이 현재 시간으로부터 20분 이내인지 체크하는 훅
const TimeCheck = () => {
  const [errorMSG, setErrorMSG] = useState("");

  // EXIF 메타데이터에서 촬영 시간을 추출하는 함수
  // const getImageMetadata = (imageFile) => {
  //   return new Promise((resolve) => {
  //     EXIF.getData(imageFile, function () {
  //       const dateTimeOriginal = EXIF.getTag(this, "DateTimeOriginal");
  //       if (dateTimeOriginal) {
  //         // EXIF에서 DateTimeOriginal을 찾았다면
  //         const imageDate = new Date(dateTimeOriginal);
  //         resolve(imageDate);
  //       } else {
  //         resolve(null);
  //       }
  //     });
  //   });
  // };
  const getImageMetadata = (imageFile) => {
    return new Promise((resolve) => {
      EXIF.getData(imageFile, function () {
        const dateTimeOriginal = EXIF.getTag(this, "DateTimeOriginal");
<<<<<<< HEAD

        // DateTimeOriginal 형식 변환
        let formattedDateTime = null;
        if (dateTimeOriginal) {
          // 날짜 형식을 YYYY-MM-DDTHH:MM:SS로 변경
          const formattedDate = dateTimeOriginal
            .replace(/:/g, "-")
            .replace(" ", "T");
          const dateObj = new Date(formattedDate);
          console.log("변환된 날짜:", dateObj);
        } else {
          console.warn("DateTimeOriginal이 없습니다.");
=======
        console.log("EXIF 촬영 시간: ", dateTimeOriginal);
        if (dateTimeOriginal) {
          // EXIF에서 DateTimeOriginal을 찾았다면
          const [date, time] = dateTimeOriginal.split(" ");
          const [year, month, day] = date.split(":").map(Number);
          const [hour, minute, second] = time.split(":").map(Number);
          const imageDate = new Date(year, month -1, day, hour, minute, second);
          resolve(imageDate);
        } else {
          const lastModified = new Date(imageFile.lastModified);
          console.log("수정 시간: ", lastModified);
          resolve(lastModified);
>>>>>>> kbh
        }

        resolve({
          dateTimeOriginal: formattedDateTime,
        });
      });
    });
  };


  // 이미지 촬영 시간으로부터 20분 이내인지 확인하는 함수
  // const checkTimeLimit = (imageDate) => {
  //   const currentTime = new Date(); // 현재 시간을 얻어야 합니다
  //   const timeDifference = currentTime - imageDate; // 밀리초 차이
  //   return timeDifference <= 20 * 60 * 1000; // 20분을 밀리초로 변환
  // };
  const checkTimeLimit = (imageDate) => {
<<<<<<< HEAD
    const currentTime = new Date(); // 현재 시간
    const timeDifference = Math.abs(currentTime - imageDate); // 밀리초 차이
    return timeDifference <= 20 * 60 * 1000; // 20분
=======
    const currentTime = new Date(); // 현재 시간을 얻어야 합니다
    const timeDifference = currentTime.getTime() - imageDate.getTime(); // 밀리초 차이
    console.log("현재 시간: ", currentTime);
    console.log("이미지 촬영 시간: ", imageDate);
    console.log("시간 차이(밀리초): ", timeDifference);
    return timeDifference <= 20 * 60 * 100000 && timeDifference >= 0; // 20분을 밀리초로 변환
>>>>>>> kbh
  };


  // 이미지가 유효한지 검사하는 함수
  const validateImageTime = async (imageFile) => {
    try {
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
    } catch (error) {
      console.error("validateImageTime 중 오류 발생:", error);
      setErrorMSG("이미지 검증 중 문제가 발생했습니다.");
      return false;
    }
  };

  return { validateImageTime, errorMSG };
};

export default TimeCheck;
