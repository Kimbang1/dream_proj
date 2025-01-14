// hooks/useImagePreview.js
import { useState, useRef, useEffect } from "react";

export const useImagePreview = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const profilehandle = (e) => {
    const selectFile = e.target.files[0];

    if (!selectFile) {
      setImagePreview("/profileImage/defaultProfile.png");
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
    if (selectFile.size > maxSize || !validTypes.includes(selectFile.type)) {
      alert("파일이 너무 크거나 지원하지 않는 형식입니다.");
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewURL = URL.createObjectURL(selectFile);
    setImagePreview(previewURL);
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return {
    imagePreview,
    fileInputRef,
    profilehandle,
    handleImageClick,
  };
};
