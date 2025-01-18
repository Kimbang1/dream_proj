import { useState, useRef, useEffect } from "react";
import AxiosApi from "../servies/AxiosApi"; // Axios 인스턴스

export const useImagePreview = () => {
  const [imagePreview, setImagePreview] = useState(null); // 여러 개의 미리보기 이미지
  const [linkId, setLinkId] = useState(null);
  const fileInputRef = useRef(null); // 파일 input ref

  useEffect(() => {
    // 컴포넌트가 언마운트될 때 미리보기 URL을 해제
    return () => {
      if(imagePreview) {
        URL.revokeObjectURL(imagePreview); // 미리보기 URL 해제
      }
    };
  }, [imagePreview]);
  
  const profilehandle = async (e) => {
    const file = e.target.files[0];
    
    if(file) {
      const validTypes = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/heic",
        "image/webp",
      ];
      const maxSize = 30 * 1024 * 1024; // 30MB
    
      if (file.size > maxSize || !validTypes.includes(file.type)) {
        alert("파일이 너무 크거나 지원하지 않는 형식입니다.");
        return;
      }

      const formData = new FormData();
      formData.append("profile_image", file);

      try {
        const response = await AxiosApi.post("/user/profileUpdate", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        });

        if (response.status === 201) {
          setLinkId(response.data.linkId);
          const previewURL = URL.createObjectURL(file);
          setImagePreview(previewURL);
        } else {
          console.error("이미지 저장 실패: ", response.statusText);
        }
      } catch (error) {
        console.error("파일 업로드 중 오류 발생: ", error);
      }
    }
  };

  // 파일 선택 창을 강제로 열기
  const openFileDialog = () => {
    fileInputRef.current.click(); // input 요소 클릭
  };

  return {
    imagePreview,
    fileInputRef,
    profilehandle,
    openFileDialog, // 파일 다이얼로그 열기 위한 함수 추가
    linkId,
  };
};
