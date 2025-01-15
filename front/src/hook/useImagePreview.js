import { useState, useRef, useEffect } from "react";
import AxiosApi from "../servies/AxiosApi"; // Axios 인스턴스

export const useImagePreview = () => {
  const [imagePreviews, setImagePreviews] = useState([]); // 여러 개의 미리보기 이미지
  const [base64Images, setBase64Images] = useState([]); // 여러 개의 Base64 이미지 데이터
  const fileInputRef = useRef(null); // 파일 input ref

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview) {
          URL.revokeObjectURL(preview); // 미리보기 URL 해제
        }
      });
    };
  }, [imagePreviews]);

  const profilehandle = (e) => {
    const files = e.target.files;

    if (files.length === 0) {
      setImagePreviews([]);
      return;
    }

    const validTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/heic",
      "image/webp",
    ];
    const maxSize = 30 * 1024 * 1024; // 30MB
    const previews = [];
    const base64Arr = [];

    for (let i = 0; i < files.length; i++) {
      const selectFile = files[i];

      if (selectFile.size > maxSize || !validTypes.includes(selectFile.type)) {
        alert("파일이 너무 크거나 지원하지 않는 형식입니다.");
        continue;
      }

      // 이미지 미리보기 URL 생성
      const previewURL = URL.createObjectURL(selectFile);
      previews.push(previewURL);

      // 이미지 파일을 Base64로 변환
      const reader = new FileReader();
      reader.onloadend = () => {
        base64Arr.push(reader.result.split(",")[1]); // Base64 데이터 추출
        if (base64Arr.length === files.length) {
          setBase64Images(base64Arr); // 모든 이미지의 Base64 데이터 설정
        }
      };
      reader.readAsDataURL(selectFile);
    }

    setImagePreviews(previews); // 미리보기 이미지 설정
  };

  // 파일 선택 창을 강제로 열기
  const openFileDialog = () => {
    fileInputRef.current.click(); // input 요소 클릭
  };

  const handleImageClick = async () => {
    try {
      if (base64Images.length > 0) {
        // JSON 데이터로 전송
        const requestData = {
          images: base64Images,
        };

        const response = await AxiosApi.post(
          "/upload/updateProfileImages",
          requestData
        );
        if (response.status === 200) {
          console.log("프로필 이미지 업데이트 성공:", response.data);
        } else {
          console.error("프로필 이미지 업데이트 실패:", response.statusText);
        }
      } else {
        alert("이미지가 선택되지 않았습니다.");
      }
    } catch (error) {
      console.error("이미지 전송 중 오류 발생:", error);
    }
  };

  return {
    imagePreviews,
    fileInputRef,
    profilehandle,
    handleImageClick,
    openFileDialog, // 파일 다이얼로그 열기 위한 함수 추가
  };
};
