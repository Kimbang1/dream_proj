import React, { useRef } from "react";

function InputPost1() {
  //fileInputet정의
  const fileInputRef = useRef(null);

  //핸들이미지 클릭 정의
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <form id="uploadArea" action="">
      <span>
        <textarea name="textarea" placeholder="게시글을 작성하시오"></textarea>
      </span>
      <div id="frame3">
        <div className="PhotoinputArea">
          <input
            type="file"
            id="imageUpload"
            name="image"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          <img
            src="/images/cameraNoback.png"
            alt="카메라 사진"
            id="upload"
            onClick={handleImageClick}
          />
        </div>
        <div className="PhotoinputArea">
          <button type="button">작성</button>
        </div>
      </div>
    </form>
  );
}

export default InputPost1;
